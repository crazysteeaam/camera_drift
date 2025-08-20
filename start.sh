#!/bin/bash

echo "========================================"
echo "漂流胶片 - 电影接力项目"
echo "========================================"
echo

echo "正在检查环境依赖..."
echo

# 检查Java环境
if ! command -v java &> /dev/null; then
    echo "[错误] 未检测到Java环境，请安装Java 17或更高版本"
    exit 1
fi

# 检查Maven环境
if ! command -v mvn &> /dev/null; then
    echo "[错误] 未检测到Maven环境，请安装Maven 3.6或更高版本"
    exit 1
fi

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到Node.js环境，请安装Node.js 16或更高版本"
    exit 1
fi

echo "[成功] 环境依赖检查完成"
echo

echo "请选择启动方式："
echo "1. 启动后端服务 (Spring Boot)"
echo "2. 启动前端服务 (React)"
echo "3. 启动全部服务"
echo "4. 退出"
echo

read -p "请输入选择 (1-4): " choice

case $choice in
    1)
        echo
        echo "[信息] 正在启动后端服务..."
        echo "[信息] 服务地址: http://localhost:8080/api"
        echo
        cd backend
        gnome-terminal --title="后端服务" -- bash -c "mvn spring-boot:run; exec bash" 2>/dev/null || \
        xterm -title "后端服务" -e "mvn spring-boot:run; exec bash" 2>/dev/null || \
        konsole --title "后端服务" -e "mvn spring-boot:run; exec bash" 2>/dev/null || \
        mvn spring-boot:run
        echo "[信息] 后端服务启动中，请稍候..."
        ;;
    2)
        echo
        echo "[信息] 正在启动前端服务..."
        echo "[信息] 服务地址: http://localhost:3000"
        echo
        cd frontend
        gnome-terminal --title="前端服务" -- bash -c "npm start; exec bash" 2>/dev/null || \
        xterm -title "前端服务" -e "npm start; exec bash" 2>/dev/null || \
        konsole --title "前端服务" -e "npm start; exec bash" 2>/dev/null || \
        npm start
        echo "[信息] 前端服务启动中，请稍候..."
        ;;
    3)
        echo
        echo "[信息] 正在启动全部服务..."
        echo
        # 启动后端
        cd backend
        gnome-terminal --title="后端服务" -- bash -c "mvn spring-boot:run; exec bash" 2>/dev/null || \
        xterm -title "后端服务" -e "mvn spring-boot:run; exec bash" 2>/dev/null || \
        konsole --title "后端服务" -e "mvn spring-boot:run; exec bash" 2>/dev/null || \
        (mvn spring-boot:run &)
        
        # 启动前端
        cd ../frontend
        gnome-terminal --title="前端服务" -- bash -c "npm start; exec bash" 2>/dev/null || \
        xterm -title "前端服务" -e "npm start; exec bash" 2>/dev/null || \
        konsole --title "前端服务" -e "npm start; exec bash" 2>/dev/null || \
        (npm start &)
        
        echo "[信息] 全部服务启动中，请稍候..."
        echo "[信息] 后端: http://localhost:8080/api"
        echo "[信息] 前端: http://localhost:3000"
        ;;
    4)
        echo "再见！"
        exit 0
        ;;
    *)
        echo
        echo "[错误] 无效选择，请输入1-4之间的数字"
        echo
        ;;
esac

echo
echo "服务启动完成，请查看对应的终端窗口"
echo
read -p "按回车键继续..." 