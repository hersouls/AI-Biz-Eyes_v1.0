-- 알림 테이블
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('urgent', 'deadline', 'missing', 'duplicate', 'new', 'update')),
    bid_ntce_no VARCHAR(50) REFERENCES bids(bid_ntce_no),
    title VARCHAR(500) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'important', 'completed')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    assigned_to INTEGER REFERENCES users(id),
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 알림 인덱스
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_bid_ntce_no ON notifications(bid_ntce_no);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_assigned_to ON notifications(assigned_to);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- 리포트 테이블
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
    title VARCHAR(500) NOT NULL,
    summary JSONB NOT NULL,
    charts JSONB NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    generated_by INTEGER REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 리포트 인덱스
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_generated_by ON reports(generated_by);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON reports(generated_at);

-- 사용자 알림 설정 테이블
CREATE TABLE IF NOT EXISTS user_notification_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    settings JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 알림 설정 인덱스
CREATE INDEX IF NOT EXISTS idx_user_notification_settings_user_id ON user_notification_settings(user_id);

-- 알림 생성 트리거 함수
CREATE OR REPLACE FUNCTION create_deadline_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- 마감일이 3일 이내인 경우 긴급 알림 생성
    IF NEW.bid_clse_date <= CURRENT_DATE + INTERVAL '3 days' AND NEW.bid_clse_date > CURRENT_DATE THEN
        INSERT INTO notifications (
            type, bid_ntce_no, title, message, priority, status
        ) VALUES (
            'deadline',
            NEW.bid_ntce_no,
            '마감임박 공고 알림',
            '공고 "' || NEW.bid_ntce_nm || '"의 마감일이 ' || NEW.bid_clse_date || '입니다.',
            'high',
            'unread'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 공고 테이블에 알림 트리거 추가
CREATE TRIGGER trigger_deadline_notification
    AFTER INSERT OR UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION create_deadline_notification();

-- 샘플 알림 데이터
INSERT INTO notifications (type, bid_ntce_no, title, message, priority, status) VALUES
('urgent', '20240100001', '긴급 공고 알림', '긴급 공고가 등록되었습니다.', 'urgent', 'unread'),
('deadline', '20240100002', '마감임박 공고 알림', '공고 "스마트공장 구축 사업"의 마감일이 2024-08-22입니다.', 'high', 'unread'),
('missing', '20240100003', '누락 공고 알림', '처리되지 않은 공고가 있습니다.', 'normal', 'unread'),
('duplicate', '20240100004', '중복 공고 알림', '유사한 공고가 이미 존재합니다.', 'low', 'read'),
('new', '20240100005', '신규 공고 알림', '새로운 공고가 등록되었습니다.', 'normal', 'unread'),
('update', '20240100006', '공고 업데이트 알림', '기존 공고 정보가 변경되었습니다.', 'normal', 'unread');

-- 샘플 리포트 데이터
INSERT INTO reports (type, title, summary, charts, period_start, period_end, generated_by) VALUES
('daily', '일간 리포트 (2024-07-22)', 
 '{"newBids": 15, "deadlineBids": 3, "missingBids": 2, "duplicateBids": 1, "successRate": 85}',
 '{"bidTypeDistribution": [{"type": "공사", "count": 8}, {"type": "용역", "count": 5}, {"type": "물품", "count": 2}], "statusDistribution": [{"status": "진행중", "count": 12}, {"status": "완료", "count": 3}], "weeklyTrend": [{"date": "2024-07-22", "count": 15}]}',
 '2024-07-22', '2024-07-22', 1),
('weekly', '주간 리포트 (2024-07-16 ~ 2024-07-22)',
 '{"newBids": 45, "deadlineBids": 12, "missingBids": 5, "duplicateBids": 3, "successRate": 78}',
 '{"bidTypeDistribution": [{"type": "공사", "count": 25}, {"type": "용역", "count": 15}, {"type": "물품", "count": 5}], "statusDistribution": [{"status": "진행중", "count": 35}, {"status": "완료", "count": 10}], "weeklyTrend": [{"date": "2024-07-16", "count": 8}, {"date": "2024-07-17", "count": 12}, {"date": "2024-07-18", "count": 10}, {"date": "2024-07-19", "count": 7}, {"date": "2024-07-20", "count": 5}, {"date": "2024-07-21", "count": 3}, {"date": "2024-07-22", "count": 0}]}',
 '2024-07-16', '2024-07-22', 1);

-- 샘플 사용자 알림 설정
INSERT INTO user_notification_settings (user_id, settings) VALUES
(1, '{"emailNotifications": {"enabled": true, "types": ["urgent", "deadline"], "frequency": "immediate"}, "webNotifications": {"enabled": true, "types": ["urgent", "deadline", "missing", "duplicate"]}, "pushNotifications": {"enabled": false}}');