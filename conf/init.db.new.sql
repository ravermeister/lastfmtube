-- not yet used

DROP TABLE IF EXISTS tracks;

CREATE TABLE tracks (
  trackid     INTEGER PRIMARY KEY,
  artist      VARCHAR(500) NOT NULL,
  title       VARCHAR(500) NOT NULL,	
  url         VARCHAR(500) NULL
)
;

DROP TABLE IF EXISTS trackplay
;

CREATE TABLE trackplay (
  trackid     INTEGER PRIMARY KEY,
  artist      VARCHAR(500) NOT NULL,
  title       VARCHAR(500) NOT NULL,
  playcount   INTEGER      NOT NULL DEFAULT 0,
  lastplayed  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastplay_ip VARCHAR(50)  NULL,

  FOREIGN KEY (trackid) REFERENCES tracks(trackid),
  CHECK (playcount >= 0)
)
;


DROP TABLE IF EXISTS lfmuserplay
;

CREATE TABLE lfmuserplay (
  lfmuser    VARCHAR(250) NOT NULL,
  lastplayed TIMESTAMP    NOT NULL,
  playcount  INTEGER      NOT NULL,
  PRIMARY KEY (lfmuser)
)
;

DROP TABLE IF EXISTS fimport
;

CREATE TABLE fimport (
  fname  VARCHAR(50),
  shasum VARCHAR(50),
  PRIMARY KEY (shasum)
)
;


DROP TABLE IF EXISTS replacement
;

CREATE TABLE replacement (
  import_file_sha   VARCHAR(50),
  orig_artist_expr  VARCHAR(500),
  orig_title_expr   VARCHAR(500),
  repl_artist       VARCHAR(500),
  repl_title        VARCHAR(500),

  PRIMARY KEY (orig_artist_expr, orig_title_expr),
  FOREIGN KEY (import_file_sha) REFERENCES fimport(shasum) ON DELETE CASCADE
)
;

