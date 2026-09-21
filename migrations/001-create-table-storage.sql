CREATE TABLE storage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL,
    session_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('local', 'cookie', 'config')),
    key TEXT NOT NULL,
    value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    UNIQUE(domain, session_id, type, key)
);

CREATE INDEX IX_storage_domain_session_id_type_key ON storage (domain, session_id, type, key);
CREATE INDEX IX_storage_expires_at ON storage (expires_at) WHERE expires_at IS NOT NULL;

CREATE VIRTUAL TABLE fts_storage USING fts5( key, value, content = 'storage', content_rowid = 'id' );

CREATE TRIGGER TR_AI_storage 
AFTER INSERT ON storage 
BEGIN
    INSERT INTO fts_storage(rowid, key, value) VALUES (new.id, new.key, new.value);
END;

CREATE TRIGGER TR_AD_storage 
AFTER DELETE ON storage 
BEGIN
    INSERT INTO fts_storage(fts_storage, rowid, key, value) VALUES('delete', old.id, old.key, old.value);
END;

CREATE TRIGGER TR_AU_storage 
AFTER UPDATE ON storage 
BEGIN
    INSERT INTO fts_storage(fts_storage, rowid, key, value) VALUES('delete', old.id, old.key, old.value);
    INSERT INTO fts_storage(rowid, key, value) VALUES (new.id, new.key, new.value);
END;
