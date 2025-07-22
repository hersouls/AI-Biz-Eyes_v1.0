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
    email_notifications BOOLEAN DEFAULT true,
    web_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT false,
    new_bid_notifications BOOLEAN DEFAULT true,
    urgent_notifications BOOLEAN DEFAULT true,
    deadline_notifications BOOLEAN DEFAULT true,
    performance_notifications BOOLEAN DEFAULT true,
    daily_report BOOLEAN DEFAULT false,
    weekly_report BOOLEAN DEFAULT true,
    monthly_report BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 알림 설정 인덱스
CREATE INDEX IF NOT EXISTS idx_user_notification_settings_user_id ON user_notification_settings(user_id);

-- 사용자 리포트 설정 테이블
CREATE TABLE IF NOT EXISTS user_report_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    daily_report BOOLEAN DEFAULT false,
    weekly_report BOOLEAN DEFAULT true,
    monthly_report BOOLEAN DEFAULT true,
    performance_report BOOLEAN DEFAULT true,
    activity_report BOOLEAN DEFAULT true,
    format VARCHAR(10) DEFAULT 'excel' CHECK (format IN ('excel', 'csv', 'json', 'pdf')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 리포트 설정 인덱스
CREATE INDEX IF NOT EXISTS idx_user_report_settings_user_id ON user_report_settings(user_id);

-- 사용자 대시보드 설정 테이블
CREATE TABLE IF NOT EXISTS user_dashboard_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    default_filters JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 대시보드 설정 인덱스
CREATE INDEX IF NOT EXISTS idx_user_dashboard_settings_user_id ON user_dashboard_settings(user_id);

-- 대시보드 위젯 테이블
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('overview', 'trend', 'calendar', 'recommendations', 'notifications', 'references', 'reports')),
    order_num INTEGER NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 대시보드 위젯 인덱스
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_user_id ON dashboard_widgets(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_type ON dashboard_widgets(type);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_order ON dashboard_widgets(order_num);

-- 사용자 환경설정 테이블
CREATE TABLE IF NOT EXISTS user_personal_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    language VARCHAR(10) DEFAULT 'ko' CHECK (language IN ('ko', 'en', 'ja')),
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    auto_refresh BOOLEAN DEFAULT false,
    desktop_notifications BOOLEAN DEFAULT true,
    mobile_optimization BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 환경설정 인덱스
CREATE INDEX IF NOT EXISTS idx_user_personal_settings_user_id ON user_personal_settings(user_id);

-- 사용자 활동 내역 테이블
CREATE TABLE IF NOT EXISTS user_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_id INTEGER,
    target_type VARCHAR(50),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 활동 인덱스
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_action ON user_activities(action);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);

-- 데이터 내보내기 테이블
CREATE TABLE IF NOT EXISTS data_exports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    types JSONB NOT NULL,
    date_range JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    file_path VARCHAR(500),
    file_size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 데이터 내보내기 인덱스
CREATE INDEX IF NOT EXISTS idx_data_exports_user_id ON data_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_data_exports_status ON data_exports(status);
CREATE INDEX IF NOT EXISTS idx_data_exports_created_at ON data_exports(created_at);

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
INSERT INTO user_notification_settings (user_id, email_notifications, web_notifications, push_notifications, new_bid_notifications, urgent_notifications, deadline_notifications, performance_notifications, daily_report, weekly_report, monthly_report) VALUES
(1, true, true, false, true, true, true, true, false, true, true);

-- 샘플 사용자 리포트 설정
INSERT INTO user_report_settings (user_id, daily_report, weekly_report, monthly_report, performance_report, activity_report, format) VALUES
(1, false, true, true, true, true, 'excel');

-- 샘플 사용자 대시보드 설정
INSERT INTO user_dashboard_settings (user_id, default_filters) VALUES
(1, '{"organization": [], "businessType": [], "budgetRange": {"min": 0, "max": 1000000000}, "dateRange": {"start": "", "end": ""}, "status": []}');

-- 샘플 대시보드 위젯
INSERT INTO dashboard_widgets (user_id, type, order_num, is_visible, settings) VALUES
(1, 'overview', 1, true, '{}'),
(1, 'trend', 2, true, '{}'),
(1, 'calendar', 3, true, '{}'),
(1, 'recommendations', 4, true, '{}'),
(1, 'notifications', 5, true, '{}'),
(1, 'references', 6, false, '{}'),
(1, 'reports', 7, false, '{}');

-- 샘플 사용자 환경설정
INSERT INTO user_personal_settings (user_id, timezone, language, theme, auto_refresh, desktop_notifications, mobile_optimization) VALUES
(1, 'Asia/Seoul', 'ko', 'light', false, true, true);

-- 샘플 사용자 활동 내역
INSERT INTO user_activities (user_id, action, target_id, target_type, details, ip_address, user_agent) VALUES
(1, 'view_bid', 123, 'bid', '{"bidId": 123, "title": "스마트공장 구축 사업"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'participate_bid', 124, 'bid', '{"bidId": 124, "title": "AI 플랫폼 개발 사업"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'add_reference', 1, 'reference', '{"referenceId": 1, "projectName": "스마트시티 구축 사업"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'update_settings', NULL, 'notification', '{"settingType": "notification", "changes": {"emailNotifications": true}}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- 샘플 데이터 내보내기
INSERT INTO data_exports (user_id, types, date_range, status, file_path, file_size, completed_at) VALUES
(1, '["work_history", "activity_log"]', '{"startDate": "2024-01-01", "endDate": "2024-07-22"}', 'completed', '/exports/1.xlsx', 1024000, '2024-07-22 10:30:00'),
(1, '["personal_settings"]', NULL, 'completed', '/exports/2.json', 5120, '2024-07-21 15:45:00');