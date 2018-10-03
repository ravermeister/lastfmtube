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

DROP TABLE IF EXISTS fimport;

CREATE TABLE fimport (
  fname VARCHAR(50),
  shasum VARCHAR(50),
  PRIMARY KEY (fname)
);


DROP TABLE IF EXISTS replacement
;

CREATE TABLE replacement (
  orig VARCHAR(500),
  repl VARCHAR(500),
  PRIMARY KEY (orig)
)
;


DROP VIEW IF EXISTS v_trackplay
;

CREATE VIEW v_trackplay AS
  WITH vars AS (
      SELECT orig, repl
        FROM replacement
        ORDER BY LENGTH(orig)
  ), duplicates AS (
      SELECT artist,
             title,
             TRIM(REPLACE(mc.artist, repl.orig, repl.repl)) AS new_artist,
             TRIM(REPLACE(mc.title, repl.orig, repl.repl))  AS new_title,
             playcount,
             lastplayed,
             lastplay_ip
        FROM trackplay mc
               JOIN replacement repl ON mc.title LIKE "%" || repl.orig || "%" OR
                                        mc.artist LIKE "%" || repl.orig || "%"
  ), excluded AS (
      SELECT TRIM(mc.artist) AS artist, TRIM(mc.title) AS title, mc.playcount, mc.lastplayed, mc.lastplay_ip
        FROM trackplay mc
        WHERE mc.title NOT IN( SELECT title FROM duplicates )
           OR mc.artist NOT IN( SELECT artist FROM duplicates )
  )
  SELECT artist, title, SUM(playcount) AS playcount, lastplayed, lastplay_ip
    FROM (SELECT new_artist AS artist, new_title AS title, playcount, lastplayed, lastplay_ip FROM duplicates
          UNION ALL SELECT artist, title, playcount, lastplayed, lastplay_ip FROM excluded)
    GROUP BY artist, title
;