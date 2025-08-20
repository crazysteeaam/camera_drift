@echo off
echo ========================================
echo 漂流胶片 - 电影接力项目
echo ========================================
echo.

echo 正在检查环境依赖...
echo.

REM 检查Java环境
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Java环境，请安装Java 17或更高版本
    pause
    exit /b 1
)

REM 检查Maven环境
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Maven环境，请安装Maven 3.6或更高版本
    pause
    exit /b 1
)

REM 检查Node.js环境
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js环境，请安装Node.js 16或更高版本
    pause
    exit /b 1
)

echo [成功] 环境依赖检查完成
echo.

echo 请选择启动方式：
echo 1. 启动后端服务 (Spring Boot)
echo 2. 启动前端服务 (React)
echo 3. 启动全部服务
echo 4. 退出
echo.

set /p choice=请输入选择 (1-4): 

if "%choice%"=="1" goto start_backend
if "%choice%"=="2" goto start_frontend
if "%choice%"=="3" goto start_all
if "%choice%"=="4" goto exit
goto invalid_choice

:start_backend
echo.
echo [信息] 正在启动后端服务...
echo [信息] 服务地址: http://localhost:8080/api
echo.
cd backend
start "后端服务" cmd /k "mvn spring-boot:run"
echo [信息] 后端服务启动中，请稍候...
goto end

:start_frontend
echo.
echo [信息] 正在启动前端服务...
echo [信息] 服务地址: http://localhost:3000
echo.
cd frontend
start "前端服务" cmd /k "npm start"
echo [信息] 前端服务启动中，请稍候...
goto end

:start_all
echo.
echo [信息] 正在启动全部服务...
echo.
cd backend
start "后端服务" cmd /k "mvn spring-boot:run"
cd ../frontend
start "前端服务" cmd /k "npm start"
echo [信息] 全部服务启动中，请稍候...
echo [信息] 后端: http://localhost:8080/api
echo [信息] 前端: http://localhost:3000
goto end

:invalid_choice
echo.
echo [错误] 无效选择，请输入1-4之间的数字
echo.
goto end

:end
echo.
echo 服务启动完成，请查看对应的命令行窗口
echo.
pause

:exit
exit /b 0 