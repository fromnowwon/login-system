-- 관리자 계정
INSERT INTO users (email, password, google_id, profile_image, name, role)
VALUES
('admin@example.com', 'admin1234', NULL, NULL, 'Admin User', 'admin');

-- 일반 사용자
INSERT INTO users (email, password, google_id, profile_image, name, role)
VALUES 
('user1@example.com', 'user1234', NULL, NULL, 'User1', 'user'),
('user2@example.com', 'user1234', NULL, NULL, 'User2', 'user'),
('user3@example.com', 'user1234', NULL, NULL, 'User3', 'user');