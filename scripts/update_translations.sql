--select count(1) from translations;
--select count(1) from re3.translations;
--create table translations_bak as select * from translations

-- Update items
UPDATE translations a
  SET en = re3.translations.en,
    fr = re3.translations.fr,
    it = re3.translations.it,
    rm = re3.translations.rm,
    de = re3.translations.de
  FROM re3.translations
  WHERE a.msg_id = re3.translations.msg_id;

-- Add missing items
--INSERT INTO translations (msg_id, en, fr, it, de, rm)
--SELECT msg_id, en, fr, it, de, rm
-- FROM  re3.translations where msg_id not in (select msg_id from translations);