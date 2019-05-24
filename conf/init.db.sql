DROP TABLE IF EXISTS trackplay
;

CREATE TABLE trackplay (
  trackid     INTEGER PRIMARY KEY,
  artist      VARCHAR(500) NOT NULL,
  title       VARCHAR(500) NOT NULL,
  playcount   INTEGER      NOT NULL DEFAULT 0,
  lastplayed  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastplay_ip VARCHAR(50)  NULL,
  url         VARCHAR(500) NULL,

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
  PRIMARY KEY (fname)
)
;


DROP TABLE IF EXISTS replacement
;

CREATE TABLE replacement (
  repltyp VARCHAR(10) DEFAULT ('TITLE'),
  orig    VARCHAR(500),
  repl    VARCHAR(500),

  PRIMARY KEY (repltyp, orig),
  CHECK (repltyp IN ('ARTIST', 'TITLE'))
)
;

