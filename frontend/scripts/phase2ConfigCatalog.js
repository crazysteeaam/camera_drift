const fs = require('fs');
const path = require('path');

const phase2ConfigPath = path.join(__dirname, '../src/config/phase2Data.ts');

function findMatchingChar(content, startIndex, openChar, closeChar) {
    let depth = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inTemplateString = false;
    let inLineComment = false;
    let inBlockComment = false;
    let isEscaped = false;

    for (let i = startIndex; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];

        if (inLineComment) {
            if (char === '\n') {
                inLineComment = false;
            }
            continue;
        }

        if (inBlockComment) {
            if (char === '*' && nextChar === '/') {
                inBlockComment = false;
                i += 1;
            }
            continue;
        }

        if (isEscaped) {
            isEscaped = false;
            continue;
        }

        if ((inSingleQuote || inDoubleQuote || inTemplateString) && char === '\\') {
            isEscaped = true;
            continue;
        }

        if (!inSingleQuote && !inDoubleQuote && !inTemplateString) {
            if (char === '/' && nextChar === '/') {
                inLineComment = true;
                i += 1;
                continue;
            }

            if (char === '/' && nextChar === '*') {
                inBlockComment = true;
                i += 1;
                continue;
            }
        }

        if (!inDoubleQuote && !inTemplateString && char === '\'') {
            inSingleQuote = !inSingleQuote;
            continue;
        }

        if (!inSingleQuote && !inTemplateString && char === '"') {
            inDoubleQuote = !inDoubleQuote;
            continue;
        }

        if (!inSingleQuote && !inDoubleQuote && char === '`') {
            inTemplateString = !inTemplateString;
            continue;
        }

        if (inSingleQuote || inDoubleQuote || inTemplateString) {
            continue;
        }

        if (char === openChar) {
            depth += 1;
        } else if (char === closeChar) {
            depth -= 1;
            if (depth === 0) {
                return i;
            }
        }
    }

    return -1;
}

function collectTopLevelObjectBlocks(arrayContent) {
    const blocks = [];
    let blockStart = -1;
    let depth = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inTemplateString = false;
    let inLineComment = false;
    let inBlockComment = false;
    let isEscaped = false;

    for (let i = 0; i < arrayContent.length; i++) {
        const char = arrayContent[i];
        const nextChar = arrayContent[i + 1];

        if (inLineComment) {
            if (char === '\n') {
                inLineComment = false;
            }
            continue;
        }

        if (inBlockComment) {
            if (char === '*' && nextChar === '/') {
                inBlockComment = false;
                i += 1;
            }
            continue;
        }

        if (isEscaped) {
            isEscaped = false;
            continue;
        }

        if ((inSingleQuote || inDoubleQuote || inTemplateString) && char === '\\') {
            isEscaped = true;
            continue;
        }

        if (!inSingleQuote && !inDoubleQuote && !inTemplateString) {
            if (char === '/' && nextChar === '/') {
                inLineComment = true;
                i += 1;
                continue;
            }

            if (char === '/' && nextChar === '*') {
                inBlockComment = true;
                i += 1;
                continue;
            }
        }

        if (!inDoubleQuote && !inTemplateString && char === '\'') {
            inSingleQuote = !inSingleQuote;
            continue;
        }

        if (!inSingleQuote && !inTemplateString && char === '"') {
            inDoubleQuote = !inDoubleQuote;
            continue;
        }

        if (!inSingleQuote && !inDoubleQuote && char === '`') {
            inTemplateString = !inTemplateString;
            continue;
        }

        if (inSingleQuote || inDoubleQuote || inTemplateString) {
            continue;
        }

        if (char === '{') {
            if (depth === 0) {
                blockStart = i;
            }
            depth += 1;
        } else if (char === '}') {
            depth -= 1;
            if (depth === 0 && blockStart !== -1) {
                blocks.push(arrayContent.slice(blockStart, i + 1));
                blockStart = -1;
            }
        }
    }

    return blocks;
}

function extractAssignedArrayContent(content, marker) {
    const markerIndex = content.indexOf(marker);
    if (markerIndex === -1) {
        return '';
    }

    const assignmentIndex = content.indexOf('=', markerIndex);
    if (assignmentIndex === -1) {
        return '';
    }

    const arrayStart = content.indexOf('[', assignmentIndex);
    if (arrayStart === -1) {
        return '';
    }

    const arrayEnd = findMatchingChar(content, arrayStart, '[', ']');
    if (arrayEnd === -1) {
        return '';
    }

    return content.slice(arrayStart + 1, arrayEnd);
}

function extractPropertyArrayContent(content, marker) {
    const markerIndex = content.indexOf(marker);
    if (markerIndex === -1) {
        return '';
    }

    const arrayStart = content.indexOf('[', markerIndex);
    if (arrayStart === -1) {
        return '';
    }

    const arrayEnd = findMatchingChar(content, arrayStart, '[', ']');
    if (arrayEnd === -1) {
        return '';
    }

    return content.slice(arrayStart + 1, arrayEnd);
}

function parseGroupBlock(groupBlock) {
    const idMatch = groupBlock.match(/id:\s*'([^']+)'/);
    const nameMatch = groupBlock.match(/name:\s*'([^']+)'/);
    const participantCountMatch = groupBlock.match(/participantCount:\s*(\d+)/);

    if (!idMatch) {
        return null;
    }

    return {
        id: idMatch[1],
        name: nameMatch ? nameMatch[1] : `${idMatch[1]}组`,
        participantCount: participantCountMatch ? Number(participantCountMatch[1]) : 6
    };
}

function parseProvinceBlock(provinceBlock) {
    const idMatch = provinceBlock.match(/id:\s*'([^']+)'/);
    const nameMatch = provinceBlock.match(/name:\s*'([^']+)'/);

    if (!idMatch) {
        return null;
    }

    const groupsContent = extractPropertyArrayContent(provinceBlock, 'groups:');
    const groups = collectTopLevelObjectBlocks(groupsContent)
        .map(parseGroupBlock)
        .filter(Boolean);

    return {
        id: idMatch[1],
        name: nameMatch ? nameMatch[1] : idMatch[1],
        groups
    };
}

function loadPhase2Catalog() {
    const configContent = fs.readFileSync(phase2ConfigPath, 'utf8');
    const provincesContent = extractAssignedArrayContent(configContent, 'const phase2ProvincesRaw');

    return collectTopLevelObjectBlocks(provincesContent)
        .map(parseProvinceBlock)
        .filter(Boolean);
}

module.exports = {
    loadPhase2Catalog,
    phase2ConfigPath
};
