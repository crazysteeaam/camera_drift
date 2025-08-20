# 电影接力前端项目启动脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "电影接力前端项目启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js环境
Write-Host "检查Node.js环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

# 检查npm环境
Write-Host "检查npm环境..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm版本: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未找到npm，请检查Node.js安装" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "当前目录: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# 检查是否在frontend目录中
Write-Host "检查是否在frontend目录中..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "错误: 请在frontend目录中运行此脚本" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 检查依赖是否已安装
Write-Host "检查依赖是否已安装..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "依赖未安装，正在安装..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "错误: 依赖安装失败" -ForegroundColor Red
            Read-Host "按回车键退出"
            exit 1
        }
        Write-Host ""
        Write-Host "依赖安装完成！" -ForegroundColor Green
    } catch {
        Write-Host "错误: 依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
} else {
    Write-Host "依赖已安装" -ForegroundColor Green
}

Write-Host ""
Write-Host "启动开发服务器..." -ForegroundColor Green
Write-Host "应用将在浏览器中自动打开" -ForegroundColor Cyan
Write-Host "如果没有自动打开，请访问: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

# 启动开发服务器
try {
    npm start
} catch {
    Write-Host "服务器启动失败" -ForegroundColor Red
    Read-Host "按回车键退出"
}

