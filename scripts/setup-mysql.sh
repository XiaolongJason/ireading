#!/bin/bash

# 配置变量
CONTAINER_NAME="ireading-mysql"
MYSQL_ROOT_PASSWORD="ireading123"
MYSQL_DATABASE="ireading"
MYSQL_USER="ireading_user"
MYSQL_PASSWORD="ireading_pass"
MYSQL_PORT=3306
MYSQL_VERSION="8.0"

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Docker 是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        exit 1
    fi
}

# 启动 MySQL 容器
start_mysql() {
    echo "Starting MySQL container..."
    
    # 检查容器是否已存在
    if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
        if [ "$(docker ps -aq -f status=running -f name=$CONTAINER_NAME)" ]; then
            echo -e "${GREEN}MySQL container is already running${NC}"
            return 0
        fi
        # 启动已存在的容器
        docker start $CONTAINER_NAME
    else
        # 创建并启动新容器
        docker run --name $CONTAINER_NAME \
            -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
            -e MYSQL_DATABASE=$MYSQL_DATABASE \
            -e MYSQL_USER=$MYSQL_USER \
            -e MYSQL_PASSWORD=$MYSQL_PASSWORD \
            -p $MYSQL_PORT:3306 \
            -d mysql:$MYSQL_VERSION \
            --character-set-server=utf8mb4 \
            --collation-server=utf8mb4_unicode_ci
    fi

    # 等待 MySQL 启动
    echo "Waiting for MySQL to start..."
    
    # 等待MySQL准备就绪
    for i in {1..30}; do
        if docker exec $CONTAINER_NAME mysqladmin ping -h"127.0.0.1" -uroot -p"$MYSQL_ROOT_PASSWORD" --protocol=tcp &>/dev/null; then
            echo -e "${GREEN}MySQL is ready!${NC}"
            break
        fi
        echo -n "."
        sleep 1
    done

    # 设置用户权限
    docker exec -i $CONTAINER_NAME mysql -h"127.0.0.1" -uroot -p"$MYSQL_ROOT_PASSWORD" --protocol=tcp << EOF
CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;
CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}MySQL container started successfully${NC}"
        update_env_file
    else
        echo -e "${RED}Failed to start MySQL container${NC}"
        exit 1
    fi
}

# 停止 MySQL 容器
stop_mysql() {
    echo "Stopping MySQL container..."
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        docker stop $CONTAINER_NAME
        echo -e "${GREEN}MySQL container stopped${NC}"
    else
        echo -e "${RED}MySQL container is not running${NC}"
    fi
}

# 更新环境变量文件
update_env_file() {
    ENV_FILE="../backend/.env"
    echo "Updating $ENV_FILE..."
    
    # 创建或更新 .env 文件
    cat > $ENV_FILE << EOF
# MySQL 数据库连接配置
DATABASE_URL="mysql://$MYSQL_USER:$MYSQL_PASSWORD@localhost:$MYSQL_PORT/$MYSQL_DATABASE"

# API URL 配置
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 其他配置
NODE_ENV=development
EOF
    
    echo -e "${GREEN}Environment file updated${NC}"
}

# 显示数据库连接信息
show_info() {
    echo -e "${GREEN}MySQL Container Information:${NC}"
    echo "Container Name: $CONTAINER_NAME"
    echo "Database Name: $MYSQL_DATABASE"
    echo "User: $MYSQL_USER"
    echo "Password: $MYSQL_PASSWORD"
    echo "Port: $MYSQL_PORT"
    echo "Root Password: $MYSQL_ROOT_PASSWORD"
    echo
    echo "Connection URL:"
    echo "mysql://$MYSQL_USER:$MYSQL_PASSWORD@localhost:$MYSQL_PORT/$MYSQL_DATABASE"
}

# 主菜单
show_menu() {
    echo
    echo "MySQL Docker Management"
    echo "1) Start MySQL"
    echo "2) Stop MySQL"
    echo "3) Show Info"
    echo "4) Exit"
    echo
    read -p "Select an option: " choice
    
    case $choice in
        1) start_mysql ;;
        2) stop_mysql ;;
        3) show_info ;;
        4) exit 0 ;;
        *) echo -e "${RED}Invalid option${NC}" ;;
    esac
}

# 主程序
main() {
    check_docker
    
    # 如果没有参数，显示菜单
    if [ $# -eq 0 ]; then
        while true; do
            show_menu
        done
    fi
    
    # 处理命令行参数
    case "$1" in
        "start") start_mysql ;;
        "stop") stop_mysql ;;
        "info") show_info ;;
        *) echo "Usage: $0 {start|stop|info}" ;;
    esac
}

# 运行主程序
main "$@"
