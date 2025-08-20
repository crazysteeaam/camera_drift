@echo off
echo ========================================
echo 电影接力前端项目启动脚本
echo ========================================
echo.

echo 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo 检查npm环境...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到npm，请检查Node.js安装
    pause
    exit /b 1
)

echo.
echo 当前目录: %CD%
echo.

echo 检查是否在frontend目录中...
if not exist "package.json" (
    echo 错误: 请在frontend目录中运行此脚本
    pause
    exit /b 1
)

echo 检查依赖是否已安装...
if not exist "node_modules" (
    echo 依赖未安装，正在安装...
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo 错误: 依赖安装失败
        pause
        exit /b 1
    )
    echo.
    echo 依赖安装完成！
) else (
    echo 依赖已安装
)

echo.
echo 启动开发服务器...
echo 应用将在浏览器中自动打开
echo 如果没有自动打开，请访问: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo.

npm start

pause

