-- 관리자 계정 (admin1234)
INSERT INTO users (email, password, google_id, profile_image, name, role)
VALUES
('admin@example.com', '$2a$12$y2bkmuxxrUjLhd.ptA7Sqe54hbCrS9iZQc9LexQOyHE2p5aDl1rNW', NULL, NULL, 'Admin User', 'admin');

-- 일반 사용자 (user1234)
INSERT INTO users (email, password, google_id, profile_image, name, role)
VALUES 
('user1@example.com', '$2a$12$oyvHJExPIZCEPLDDAlg/v.OuIBcxD7AjM8e3p2AfyVv0i/kyeFCcW', NULL, NULL, 'User1', 'user'),
('user2@example.com', '$2a$12$oyvHJExPIZCEPLDDAlg/v.OuIBcxD7AjM8e3p2AfyVv0i/kyeFCcW', NULL, NULL, 'User2', 'user'),
('user3@example.com', '$2a$12$oyvHJExPIZCEPLDDAlg/v.OuIBcxD7AjM8e3p2AfyVv0i/kyeFCcW', NULL, NULL, 'User3', 'user');
