-- 电影接力项目数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS film_relay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE film_relay;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建小组表
CREATE TABLE IF NOT EXISTS groups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_participants INT DEFAULT 6,
    current_participants INT DEFAULT 0,
    status ENUM('recruiting', 'active', 'completed') DEFAULT 'recruiting',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 创建参与者表
CREATE TABLE IF NOT EXISTS participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    group_id BIGINT NOT NULL,
    relay_order INT NOT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_group (user_id, group_id)
);

-- 创建照片表
CREATE TABLE IF NOT EXISTS photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    participant_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    title VARCHAR(200),
    description TEXT,
    taken_date TIMESTAMP,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_order INT NOT NULL,
    camera VARCHAR(100),
    film VARCHAR(100),
    location VARCHAR(200),
    is_featured BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- 创建消息表
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    participant_id BIGINT NOT NULL,
    photo_id BIGINT,
    content TEXT NOT NULL,
    message_type ENUM('relay', 'comment', 'story') DEFAULT 'comment',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE SET NULL
);

-- 创建电影表
CREATE TABLE IF NOT EXISTS movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    original_title VARCHAR(200),
    director VARCHAR(100),
    year INT,
    genre VARCHAR(100),
    duration INT,
    description TEXT,
    poster_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建小组电影关联表
CREATE TABLE IF NOT EXISTS group_movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    relay_order INT NOT NULL,
    assigned_date TIMESTAMP,
    completed_date TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_group_movie (group_id, movie_id)
);

-- 插入示例数据
INSERT INTO users (username, email, password_hash, full_name, bio, location) VALUES
('film_lover', 'film@example.com', '$2a$10$example_hash', '电影爱好者', '热爱电影艺术，喜欢用胶片记录生活', '北京'),
('camera_master', 'camera@example.com', '$2a$10$example_hash', '相机大师', '专业摄影师，擅长胶片摄影', '上海'),
('story_teller', 'story@example.com', '$2a$10$example_hash', '故事讲述者', '喜欢分享故事，记录生活中的美好瞬间', '广州');

INSERT INTO groups (name, description, max_participants, current_participants, status, start_date, created_by) VALUES
('经典电影接力小组', '专注于经典黑白电影的接力观看，体验电影艺术的永恒魅力', 6, 4, 'recruiting', '2024-01-15', 1),
('科幻电影探索队', '探索科幻电影的无限可能，从经典到现代，感受科技与想象的碰撞', 6, 6, 'active', '2024-01-10', 2),
('文艺片爱好者联盟', '深度探讨文艺片的艺术价值，分享观影感受和人生感悟', 6, 3, 'recruiting', '2024-01-20', 3);

INSERT INTO movies (title, director, year, genre, duration, description) VALUES
('肖申克的救赎', '弗兰克·德拉邦特', 1994, '剧情', 142, '希望让人自由'),
('教父', '弗朗西斯·福特·科波拉', 1972, '犯罪/剧情', 175, '最伟大的黑帮电影'),
('盗梦空间', '克里斯托弗·诺兰', 2010, '科幻/动作', 148, '梦境与现实的边界'),
('千与千寻', '宫崎骏', 2001, '动画/奇幻', 125, '成长与勇气的故事');

-- 创建索引
CREATE INDEX idx_groups_status ON groups(status);
CREATE INDEX idx_participants_group ON participants(group_id);
CREATE INDEX idx_photos_participant ON photos(participant_id);
CREATE INDEX idx_messages_participant ON messages(participant_id);
CREATE INDEX idx_group_movies_group ON group_movies(group_id);

-- 创建视图：活跃小组信息
CREATE VIEW active_groups AS
SELECT 
    g.id,
    g.name,
    g.description,
    g.max_participants,
    g.current_participants,
    g.status,
    g.start_date,
    COUNT(p.id) as participant_count
FROM groups g
LEFT JOIN participants p ON g.id = p.group_id AND p.is_active = TRUE
GROUP BY g.id;

-- 创建存储过程：添加参与者到小组
DELIMITER //
CREATE PROCEDURE AddParticipantToGroup(
    IN p_user_id BIGINT,
    IN p_group_id BIGINT,
    IN p_relay_order INT
)
BEGIN
    DECLARE current_count INT;
    DECLARE max_count INT;
    
    -- 检查小组是否已满
    SELECT current_participants, max_participants INTO current_count, max_count
    FROM groups WHERE id = p_group_id;
    
    IF current_count < max_count THEN
        INSERT INTO participants (user_id, group_id, relay_order)
        VALUES (p_user_id, p_group_id, p_relay_order);
        
        UPDATE groups 
        SET current_participants = current_participants + 1
        WHERE id = p_group_id;
        
        SELECT 'SUCCESS' as result;
    ELSE
        SELECT 'GROUP_FULL' as result;
    END IF;
END //
DELIMITER ; 