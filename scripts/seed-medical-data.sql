-- ============================================================================
-- MEDICAL UNIVERSITIES AND PROGRAMS DATA SEEDING
-- Dodaje kierunki medyczne i uczelnie do istniejącej bazy danych
-- ============================================================================

-- 1. Dodaj uniwersytety medyczne
INSERT INTO public.universities (name, short_name, city, website, type, established_year, students_count, ranking_position, rating, is_active) VALUES
-- Top uczelnie medyczne
('Uniwersytet Jagielloński - Collegium Medicum', 'UJ CM', 'Kraków', 'https://www.cm.uj.edu.pl', 'public', 1364, 4500, 1, 4.8, true),
('Warszawski Uniwersytet Medyczny', 'WUM', 'Warszawa', 'https://www.wum.edu.pl', 'public', 1950, 6200, 2, 4.7, true),
('Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu', 'UM Poznań', 'Poznań', 'https://www.ump.edu.pl', 'public', 1919, 3800, 3, 4.6, true),
('Gdański Uniwersytet Medyczny', 'GUMed', 'Gdańsk', 'https://gumed.edu.pl', 'public', 1945, 4100, 4, 4.5, true),
('Śląski Uniwersytet Medyczny w Katowicach', 'SUM', 'Katowice', 'https://www.sum.edu.pl', 'public', 1948, 4300, 5, 4.4, true),
('Uniwersytet Medyczny w Lublinie', 'UM Lublin', 'Lublin', 'https://www.umlub.pl', 'public', 1944, 3600, 6, 4.3, true),
('Uniwersytet Medyczny w Łodzi', 'UM Łódź', 'Łódź', 'https://www.umed.pl', 'public', 1949, 3900, 7, 4.2, true),
('Pomorski Uniwersytet Medyczny w Szczecinie', 'PUM', 'Szczecin', 'https://www.pum.edu.pl', 'public', 1948, 3200, 8, 4.1, true),
('Uniwersytet Medyczny w Białymstoku', 'UMB', 'Białystok', 'https://www.umb.edu.pl', 'public', 1950, 2800, 9, 4.0, true),
-- Uniwersytety z wydziałami medycznymi
('Uniwersytet Warmińsko-Mazurski w Olsztynie', 'UWM', 'Olsztyn', 'https://www.uwm.edu.pl', 'public', 1999, 2400, 10, 3.9, true),
('Uniwersytet Rzeszowski', 'UR', 'Rzeszów', 'https://www.ur.edu.pl', 'public', 2001, 2200, 11, 3.8, true),
('Uniwersytet Zielonogórski', 'UZ', 'Zielona Góra', 'https://www.uz.zgora.pl', 'public', 2001, 1800, 12, 3.7, true),
('Uniwersytet Mikołaja Kopernika w Toruniu - Collegium Medicum', 'UMK CM', 'Bydgoszcz', 'https://www.cm.umk.pl', 'public', 1999, 2600, 13, 3.9, true),
('Akademia Pomorska w Słupsku', 'AP Słupsk', 'Słupsk', 'https://www.apsl.edu.pl', 'public', 1969, 1500, 14, 3.6, true),
('Uniwersytet Opolski', 'UO', 'Opole', 'https://www.uni.opole.pl', 'public', 1994, 1400, 15, 3.5, true),
('Państwowa Medyczna Wyższa Szkoła Zawodowa w Opolu', 'PMWSZ Opole', 'Opole', 'https://www.pmwsz.opole.pl', 'public', 2003, 1200, 16, 3.4, true),
('Uniwersytet Jana Kochanowskiego w Kielcach', 'UJK', 'Kielce', 'https://www.ujk.edu.pl', 'public', 1969, 1600, 17, 3.3, true),
('Akademia im. Jakuba z Paradyża w Gorzowie Wielkopolskim', 'AJP', 'Gorzów Wielkopolski', 'https://www.ajp.edu.pl', 'public', 2002, 1100, 18, 3.2, true),
('Państwowa Uczelnia im. Stefana Batorego w Skierniewicach', 'PUSB', 'Skierniewice', 'https://www.pusb.pl', 'public', 2000, 900, 19, 3.1, true),
('Uniwersytet Humanistyczno-Przyrodniczy im. Jana Długosza w Częstochowie', 'UJD', 'Częstochowa', 'https://www.ujd.edu.pl', 'public', 1971, 1300, 20, 3.0, true)
ON CONFLICT (name) DO NOTHING;

-- 2. Dodaj kierunki studiów medycznych dla UJ Collegium Medicum
INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Lekarski', 'jednolite_magisterskie', 6, 'polish', 'Jednolite studia magisterskie kształcące lekarzy'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Lekarsko-dentystyczny', 'jednolite_magisterskie', 5, 'polish', 'Studia kształcące lekarzy dentystów'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Farmacja', 'magisterskie', 5, 'polish', 'Studia magisterskie farmaceutyczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Pielęgniarstwo', 'licencjackie', 3, 'polish', 'Studia pielęgniarskie'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Fizjoterapia', 'licencjackie', 3, 'polish', 'Studia fizjoterapeutyczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Analityka medyczna', 'licencjackie', 3, 'polish', 'Studia analityki medycznej'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Dietetyka', 'licencjackie', 3, 'polish', 'Studia dietetyczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Psychologia', 'magisterskie', 5, 'polish', 'Studia psychologiczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum';

-- 3. Dodaj kierunki studiów medycznych dla WUM Warszawa
INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Lekarski', 'jednolite_magisterskie', 6, 'polish', 'Jednolite studia magisterskie kształcące lekarzy'
FROM public.universities u 
WHERE u.name = 'Warszawski Uniwersytet Medyczny';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Lekarsko-dentystyczny', 'jednolite_magisterskie', 5, 'polish', 'Studia kształcące lekarzy dentystów'
FROM public.universities u 
WHERE u.name = 'Warszawski Uniwersytet Medyczny';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Farmacja', 'magisterskie', 5, 'polish', 'Studia magisterskie farmaceutyczne'
FROM public.universities u 
WHERE u.name = 'Warszawski Uniwersytet Medyczny';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Pielęgniarstwo', 'licencjackie', 3, 'polish', 'Studia pielęgniarskie'
FROM public.universities u 
WHERE u.name = 'Warszawski Uniwersytet Medyczny';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Fizjoterapia', 'licencjackie', 3, 'polish', 'Studia fizjoterapeutyczne'
FROM public.universities u 
WHERE u.name = 'Warszawski Uniwersytet Medyczny';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Analityka medyczna', 'licencjackie', 3, 'polish', 'Studia analityki medycznej'
FROM public.universities u 
WHERE u.name = 'Warszawski Uniwersytet Medyczny';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Zdrowie publiczne', 'magisterskie', 2, 'polish', 'Studia zdrowia publicznego'
FROM public.universities u 
WHERE u.name = 'Warszawski Uniwersytet Medyczny';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Elektroradiologia', 'licencjackie', 3, 'polish', 'Studia elektroradiologiczne'
FROM public.universities u 
WHERE u.name = 'Warszawski Uniwersytet Medyczny';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, description) 
SELECT u.id, 'Dietetyka', 'licencjackie', 3, 'polish', 'Studia dietetyczne'
FROM public.universities u 
WHERE u.name = 'Warszawski Uniwersytet Medyczny';

-- 4. Dodaj przykładowe punkty przyjęć dla UJ CM
INSERT INTO public.admission_scores (program_id, year, min_points, max_points, avg_points, candidates_count, admitted_count)
SELECT sp.id, 2024, 196.5, 200.0, 198.2, 2800, 320
FROM public.study_programs sp
JOIN public.universities u ON sp.university_id = u.id
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum' AND sp.name = 'Lekarski';

INSERT INTO public.admission_scores (program_id, year, min_points, max_points, avg_points, candidates_count, admitted_count)
SELECT sp.id, 2024, 185.2, 195.0, 190.1, 850, 60
FROM public.study_programs sp
JOIN public.universities u ON sp.university_id = u.id
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum' AND sp.name = 'Lekarsko-dentystyczny';

INSERT INTO public.admission_scores (program_id, year, min_points, max_points, avg_points, candidates_count, admitted_count)
SELECT sp.id, 2024, 170.8, 185.0, 177.9, 1200, 120
FROM public.study_programs sp
JOIN public.universities u ON sp.university_id = u.id
WHERE u.name = 'Uniwersytet Jagielloński - Collegium Medicum' AND sp.name = 'Farmacja';

-- 5. Dodaj przykładowe punkty przyjęć dla WUM
INSERT INTO public.admission_scores (program_id, year, min_points, max_points, avg_points, candidates_count, admitted_count)
SELECT sp.id, 2024, 198.2, 200.0, 199.1, 3200, 350
FROM public.study_programs sp
JOIN public.universities u ON sp.university_id = u.id
WHERE u.name = 'Warszawski Uniwersytet Medyczny' AND sp.name = 'Lekarski';

INSERT INTO public.admission_scores (program_id, year, min_points, max_points, avg_points, candidates_count, admitted_count)
SELECT sp.id, 2024, 187.6, 198.0, 192.8, 920, 75
FROM public.study_programs sp
JOIN public.universities u ON sp.university_id = u.id
WHERE u.name = 'Warszawski Uniwersytet Medyczny' AND sp.name = 'Lekarsko-dentystyczny';

INSERT INTO public.admission_scores (program_id, year, min_points, max_points, avg_points, candidates_count, admitted_count)
SELECT sp.id, 2024, 172.4, 188.0, 180.2, 1400, 140
FROM public.study_programs sp
JOIN public.universities u ON sp.university_id = u.id
WHERE u.name = 'Warszawski Uniwersytet Medyczny' AND sp.name = 'Farmacja';

-- ============================================================================
-- PRYWATNE UCZELNIE MEDYCZNE
-- ============================================================================

-- Dodaj prywatne uczelnie medyczne w Polsce
INSERT INTO public.universities (name, short_name, city, website, type, established_year, students_count, ranking_position, rating, is_active) VALUES

-- TOP PRYWATNE UCZELNIE MEDYCZNE
('Uniwersytet Medyczny w Łodzi - Wydział Medycyny Prywatnej', 'UML Prywatny', 'Łódź', 'https://www.umed.pl', 'private', 2008, 800, 21, 4.2, true),
('Collegium Medicum w Bydgoszczy', 'CM Bydgoszcz', 'Bydgoszcz', 'https://www.cm.umk.pl', 'private', 2004, 900, 22, 4.0, true),

-- UCZELNIE Z KIERUNKAMI MEDYCZNYMI  
('Uniwersytet Kardynała Stefana Wyszyńskiego w Warszawie', 'UKSW', 'Warszawa', 'https://www.uksw.edu.pl', 'private', 1999, 1200, 23, 3.8, true),
('Uniwersytet Humanistyczno-Społeczny SWPS', 'SWPS', 'Warszawa', 'https://www.swps.pl', 'private', 1996, 2800, 24, 4.1, true),
('Akademia Leona Koźmińskiego', 'ALK', 'Warszawa', 'https://www.kozminski.edu.pl', 'private', 1993, 1500, 25, 3.9, true),
('Uniwersytet Łazarski', 'UŁ', 'Warszawa', 'https://www.lazarski.pl', 'private', 1993, 1100, 26, 3.7, true),

-- UCZELNIE REGIONALNE Z KIERUNKAMI MEDYCZNYMI
('Krakowska Akademia im. Andrzeja Frycza Modrzewskiego', 'KAAFM', 'Kraków', 'https://www.ka.edu.pl', 'private', 2000, 1800, 27, 3.6, true),
('Uniwersytet WSB Merito', 'WSB Merito', 'Wrocław', 'https://www.wsb.pl', 'private', 1998, 2200, 28, 3.5, true),
('Wyższa Szkoła Biznesu i Przedsiębiorczości w Ostrowcu Świętokrzyskim', 'WSBiP', 'Ostrowiec Świętokrzyski', 'https://www.wsbip.edu.pl', 'private', 1996, 600, 29, 3.2, true),

-- WYŻSZE SZKOŁY MEDYCZNE
('Wyższa Szkoła Medyczna w Białymstoku', 'WSM Białystok', 'Białystok', 'https://www.wsm.bialystok.pl', 'private', 2005, 800, 30, 3.8, true),
('Wyższa Szkoła Administracji i Biznesu im. Eugeniusza Kwiatkowskiego w Gdyni', 'WSAIB', 'Gdynia', 'https://www.wsaib.pl', 'private', 1996, 900, 31, 3.4, true),
('Collegium Da Vinci', 'CdV', 'Poznań', 'https://www.cdv.pl', 'private', 2008, 1400, 32, 3.6, true),
('Wyższa Szkoła Techniczno-Ekonomiczna w Świdnicy', 'WSTE', 'Świdnica', 'https://www.wste.edu.pl', 'private', 1998, 700, 33, 3.1, true),

-- AKADEMIE I INSTYTUTY
('Akademia Humanistyczno-Ekonomiczna w Łodzi', 'AHE', 'Łódź', 'https://www.ahe.lodz.pl', 'private', 1991, 1200, 34, 3.3, true),
('Wyższa Szkoła Bankowa w Poznaniu', 'WSB Poznań', 'Poznań', 'https://www.wsb.pl/poznan', 'private', 1994, 1600, 35, 3.5, true),
('Uniwersytet Medyczny Silesia w Katowicach', 'UMS', 'Katowice', 'https://www.sum.edu.pl/silesia', 'private', 2018, 500, 36, 4.0, true),
('Collegium Humanum - Szkoła Główna Menedżerska', 'CH', 'Warszawa', 'https://www.humanum.pl', 'private', 2018, 800, 37, 3.2, true),

-- WYŻSZE SZKOŁY ZAWODOWE
('Wyższa Szkoła Zawodowa w Nysie', 'WSZ Nysa', 'Nysa', 'https://www.wsz.nysa.pl', 'private', 2001, 400, 38, 3.0, true),
('Wyższa Szkoła Medyczna i Społeczna w Warszawie', 'WSMiS', 'Warszawa', 'https://www.wsmis.edu.pl', 'private', 2010, 600, 39, 3.7, true),
('Wyższa Szkoła Cosinus w Krakowie', 'WSC', 'Kraków', 'https://www.cosinus.edu.pl', 'private', 2003, 500, 40, 3.1, true),
('Warszawska Wyższa Szkoła Medyczna', 'WWSM', 'Warszawa', 'https://www.wwsm.edu.pl', 'private', 2012, 700, 41, 3.8, true),

-- AKADEMIE REGIONALNE
('Akademia Nauk Stosowanych w Nowym Sączu', 'ANS', 'Nowy Sącz', 'https://www.ans.edu.pl', 'private', 2000, 800, 42, 3.3, true),
('Wyższa Szkoła Gospodarki w Bydgoszczy', 'WSG', 'Bydgoszcz', 'https://www.wsg.byd.pl', 'private', 1998, 900, 43, 3.2, true),
('Akademia Wychowania Fizycznego i Sportu w Gdańsku', 'AWFiS', 'Gdańsk', 'https://www.awf.gda.pl', 'private', 1946, 1200, 44, 3.4, true),
('Wyższa Szkoła Edukacji i Terapii w Poznaniu', 'WSEiT', 'Poznań', 'https://www.wseit.edu.pl', 'private', 2005, 600, 45, 3.5, true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- KIERUNKI DLA PRYWATNYCH UCZELNI
-- ============================================================================

-- SWPS - psychologia i kierunki pokrewne
INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Psychologia', 'magisterskie', 5, 'polish', 18000, 'Studia psychologiczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Humanistyczno-Społeczny SWPS';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Pielęgniarstwo', 'licencjackie', 3, 'polish', 12000, 'Studia pielęgniarskie'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Humanistyczno-Społeczny SWPS';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Fizjoterapia', 'licencjackie', 3, 'polish', 15000, 'Studia fizjoterapeutyczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Humanistyczno-Społeczny SWPS';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Dietetyka', 'licencjackie', 3, 'polish', 10000, 'Studia dietetyczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Humanistyczno-Społeczny SWPS';

-- WSB Merito - kierunki biznesowo-medyczne
INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Pielęgniarstwo', 'licencjackie', 3, 'polish', 11000, 'Studia pielęgniarskie'
FROM public.universities u 
WHERE u.name = 'Uniwersytet WSB Merito';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Fizjoterapia', 'licencjackie', 3, 'polish', 14000, 'Studia fizjoterapeutyczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet WSB Merito';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Dietetyka', 'licencjackie', 3, 'polish', 9500, 'Studia dietetyczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet WSB Merito';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Ratownictwo medyczne', 'licencjackie', 3, 'polish', 12000, 'Studia ratownictwa medycznego'
FROM public.universities u 
WHERE u.name = 'Uniwersytet WSB Merito';

-- Krakowska Akademia - kierunki medyczne
INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Psychologia', 'magisterskie', 5, 'polish', 16000, 'Studia psychologiczne'
FROM public.universities u 
WHERE u.name = 'Krakowska Akademia im. Andrzeja Frycza Modrzewskiego';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Pielęgniarstwo', 'licencjackie', 3, 'polish', 10500, 'Studia pielęgniarskie'
FROM public.universities u 
WHERE u.name = 'Krakowska Akademia im. Andrzeja Frycza Modrzewskiego';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Fizjoterapia', 'licencjackie', 3, 'polish', 13500, 'Studia fizjoterapeutyczne'
FROM public.universities u 
WHERE u.name = 'Krakowska Akademia im. Andrzeja Frycza Modrzewskiego';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Ratownictwo medyczne', 'licencjackie', 3, 'polish', 11000, 'Studia ratownictwa medycznego'
FROM public.universities u 
WHERE u.name = 'Krakowska Akademia im. Andrzeja Frycza Modrzewskiego';

-- Uniwersytet Medyczny Silesia - nowoczesne kierunki
INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Lekarski', 'jednolite_magisterskie', 6, 'polish', 45000, 'Jednolite studia magisterskie kształcące lekarzy'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Medyczny Silesia w Katowicach';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Farmacja', 'magisterskie', 5, 'polish', 25000, 'Studia magisterskie farmaceutyczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Medyczny Silesia w Katowicach';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Biotechnologia', 'licencjackie', 3, 'polish', 18000, 'Studia biotechnologiczne'
FROM public.universities u 
WHERE u.name = 'Uniwersytet Medyczny Silesia w Katowicach';

-- Warszawska Wyższa Szkoła Medyczna - specjalistyczne kierunki
INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Pielęgniarstwo', 'licencjackie', 3, 'polish', 12000, 'Studia pielęgniarskie'
FROM public.universities u 
WHERE u.name = 'Warszawska Wyższa Szkoła Medyczna';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Fizjoterapia', 'licencjackie', 3, 'polish', 15000, 'Studia fizjoterapeutyczne'
FROM public.universities u 
WHERE u.name = 'Warszawska Wyższa Szkoła Medyczna';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Analityka medyczna', 'licencjackie', 3, 'polish', 13000, 'Studia analityki medycznej'
FROM public.universities u 
WHERE u.name = 'Warszawska Wyższa Szkoła Medyczna';

INSERT INTO public.study_programs (university_id, name, type, duration_years, language, tuition_fee_pln, description) 
SELECT u.id, 'Elektroradiologia', 'licencjackie', 3, 'polish', 14000, 'Studia elektroradiologiczne'
FROM public.universities u 
WHERE u.name = 'Warszawska Wyższa Szkoła Medyczna';

-- Dodaj przykładowe punkty przyjęć dla wybranych prywatnych uczelni
INSERT INTO public.admission_scores (program_id, year, min_points, max_points, avg_points, candidates_count, admitted_count)
SELECT sp.id, 2024, 165.8, 185.0, 175.4, 450, 180
FROM public.study_programs sp
JOIN public.universities u ON sp.university_id = u.id
WHERE u.name = 'Uniwersytet Humanistyczno-Społeczny SWPS' AND sp.name = 'Psychologia';

INSERT INTO public.admission_scores (program_id, year, min_points, max_points, avg_points, candidates_count, admitted_count)
SELECT sp.id, 2024, 175.5, 190.0, 182.8, 350, 60
FROM public.study_programs sp
JOIN public.universities u ON sp.university_id = u.id
WHERE u.name = 'Uniwersytet Medyczny Silesia w Katowicach' AND sp.name = 'Lekarski';

-- ============================================================================
-- WERYFIKACJA DANYCH
-- ============================================================================

-- Sprawdź ile uniwersytetów zostało dodanych
SELECT 'Uniwersytety' as typ, COUNT(*) as ilosc FROM public.universities WHERE name LIKE '%edyczny%' OR name LIKE '%Collegium Medicum%';

-- Sprawdź ile kierunków zostało dodanych
SELECT 'Kierunki studiów' as typ, COUNT(*) as ilosc FROM public.study_programs;

-- Sprawdź ile punktów przyjęć zostało dodanych
SELECT 'Punkty przyjęć' as typ, COUNT(*) as ilosc FROM public.admission_scores;

-- Pokaż przykładowe dane
SELECT 
    u.name as uniwersytet,
    sp.name as kierunek,
    sp.type as typ,
    sp.duration_years as lata,
    ads.min_points as min_pkt
FROM public.universities u
JOIN public.study_programs sp ON u.id = sp.university_id
LEFT JOIN public.admission_scores ads ON sp.id = ads.program_id
WHERE u.name LIKE '%edyczny%' OR u.name LIKE '%Collegium Medicum%'
ORDER BY u.name, sp.name
LIMIT 20;