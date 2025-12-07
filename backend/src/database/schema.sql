CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    linkedin_id VARCHAR(255) UNIQUE NOT NULL,
    access_token TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    headline TEXT,
    profile_picture_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Analytics Snapshots (Daily/Weekly stats)
-- Analytics Snapshots (Daily/Weekly stats)
CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER,
    profile_views INTEGER DEFAULT 0,
    search_appearances INTEGER DEFAULT 0,
    snapshot_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, snapshot_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Viewer Activity (Optional, for detailed tracking if legal/compliant)
-- Viewer Activity (Optional, for detailed tracking if legal/compliant)
CREATE TABLE IF NOT EXISTS viewer_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER,
    viewer_name VARCHAR(255),
    viewer_headline TEXT,
    viewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
