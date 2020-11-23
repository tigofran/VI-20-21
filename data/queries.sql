#select characters
SELECT DISTINCT name, allegiance FROM got_deaths UNION Select DISTINCT killer, killers_house FROM got_deaths where killer not in (select name from got_deaths) Order by allegiance, name;

#deaths by house
SELECT DISTINCT name, killer, COUNT(*), COUNT() FROM got_deaths GROUP BY name, killer;
