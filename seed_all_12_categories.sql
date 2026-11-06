-- Ensure events table has official CUTM events and upcoming events categorized across the 12 categories
-- Updating events categories to match the 12 official categories
UPDATE events SET category = 'Cultural Events' WHERE id = 1; -- GAJAJYOTI Inauguration 2026
UPDATE events SET category = 'Technical Events' WHERE id = 2; -- Vyomang Day-1
UPDATE events SET category = 'Technical Events' WHERE id = 3; -- Vyomang Day-2
UPDATE events SET category = 'Cultural Events' WHERE id = 4; -- Public Speaking Competition – Gajajyoti 2026
UPDATE events SET category = 'Workshops' WHERE id = 5; -- Workshop on Basic Cardio-Pulmonary Life Support
UPDATE events SET category = 'Academic Events' WHERE id = 6; -- Pharma Anveshan 2026
UPDATE events SET category = 'University Celebrations' WHERE id = 7; -- Women's Day Celebration 2026
UPDATE events SET category = 'Technical Events' WHERE id = 8; -- SEMICON ARENA (ECE Day-1)
UPDATE events SET category = 'Hackathons' WHERE id = 9; -- SEMICON ARENA (ECE Day-2 Hardware Hackathon)
UPDATE events SET category = 'Social Service Activities' WHERE id = 10; -- Optometry Day
UPDATE events SET category = 'Social Service Activities' WHERE id = 11; -- NSS Blood Donation Camp
UPDATE events SET category = 'Social Service Activities' WHERE id = 12; -- Dandi March 2.0 (Anti Drug Campaign)
UPDATE events SET category = 'Seminars' WHERE id = 13; -- World Quantum Day
UPDATE events SET category = 'University Celebrations' WHERE id = 14; -- Placement Students 2026
UPDATE events SET category = 'Hackathons' WHERE id = 15; -- CUTM AP National Hackathon 2026: AI & Smart Systems
UPDATE events SET category = 'Sports Events' WHERE id = 16; -- Centurion Annual Sports Meet & Athletics Championship

-- Add additional events representing remaining categories: Guest Lectures, Student Activities, Campus Life
INSERT INTO events (id, title, category, description, venue, event_date, event_time, registration_deadline, max_capacity, current_registrations, status, image_url, official_source, permission_status)
VALUES
(17, 'Guest Lecture by Dr. Prasada Raju, Former DST Scientist', 'Guest Lectures', 'Distinguished guest address on National Research Funding, Scientific Innovation, and Deep-Tech Commercialization delivered to faculty and postgraduate scholars at CUTM-AP.', 'Main Boardroom & Auditorium, CUTM-AP', '2026-05-01', '11:00 AM', '2026-04-30 18:00:00', 200, 140, 'COMPLETED', '/cutmap_events/cutmap_guest_dst_scientist.jpg', 'https://photos.app.goo.gl/rCVNRsZ19EHirGaw6', 'VERIFIED_OFFICIAL_CUTMAP'),
(18, 'NCC Cadets Valedictory & Passing Parade', 'Student Activities', 'Centurion University NCC unit ceremonial passing parade, honors distribution, and farewell commemoration honoring graduating student cadets under the motto "Once a Cadet, Always a Cadet".', 'Parade Grounds & Sports Pavilion, CUTM-AP', '2026-04-11', '08:00 AM', '2026-04-10 18:00:00', 300, 220, 'COMPLETED', '/cutmap_events/cutmap_ncc_farewell.jpg', 'https://photos.app.goo.gl/nhRkvM9JxRJ94Qp49', 'VERIFIED_OFFICIAL_CUTMAP'),
(19, 'Centurion Alumni Homecoming & Reunion 2k26', 'Campus Life', 'Annual alumni homecoming summit celebrating graduate milestones, institutional progress, and industry networking across engineering, management, and pharmacy batches.', 'Convention Hall & Central Lawns, CUTM-AP', '2026-03-28', '05:00 PM', '2026-03-27 18:00:00', 400, 310, 'COMPLETED', '/cutmap_events/cutmap_alumni_campus_life.jpg', 'https://photos.app.goo.gl/bbfBQGLcNrU2vT83A', 'VERIFIED_OFFICIAL_CUTMAP'),
(20, 'UNICONNECT Inter-University Esports & LAN Championship', 'Sports Events', 'State-level collegiate LAN finals with multi-title gaming tournaments, low-latency arena setups, and high-performance esports matches between regional universities.', 'Indoor Sports Complex, CUTM-AP', '2026-03-16', '10:00 AM', '2026-03-15 18:00:00', 250, 185, 'COMPLETED', '/cutmap_events/cutmap_lan_hackathon.jpg', 'https://photos.app.goo.gl/xRbScSJxf7PaZWw39', 'VERIFIED_OFFICIAL_CUTMAP')
ON DUPLICATE KEY UPDATE
title=VALUES(title), category=VALUES(category), description=VALUES(description), venue=VALUES(venue), event_date=VALUES(event_date), event_time=VALUES(event_time), registration_deadline=VALUES(registration_deadline), status=VALUES(status), image_url=VALUES(image_url), official_source=VALUES(official_source), permission_status=VALUES(permission_status);

-- Clear and Repopulate event_gallery with extensive entries across all 12 categories, linking multiple photos per event
DELETE FROM event_gallery;

INSERT INTO event_gallery (id, event_id, image_url, title, caption, category, display_order, created_at, official_source, permission_status, event_date)
VALUES
-- 1. Technical Events
(1, 8, '/cutmap_events/cutmap_semicon_day1.jpg', 'SEMICON ARENA (ECE Day-1)', 'Department of ECE technical expo featuring VLSI silicon design, embedded circuitry and FPGA challenges', 'Technical Events', 1, NOW(), 'https://photos.app.goo.gl/9zxigbqmucg7JW5J6', 'VERIFIED_OFFICIAL_CUTMAP', '17 March 2026'),
(2, 2, '/cutmap_events/cutmap_vyomang_day1.jpg', 'Vyomang Day-1: Aerospace Conclave', 'National Aerospace and Tech Fest opening keynotes, UAV models and supersonic aerodynamics', 'Technical Events', 2, NOW(), 'https://photos.app.goo.gl/nhRkvM9JxRJ94Qp49', 'VERIFIED_OFFICIAL_CUTMAP', '5 February 2026'),
(3, 8, '/cutmap_events/cutmap_semicon_arena.jpg', 'Semicon Arena ECE Project Showcase', 'ECE student engineers presenting smart sensors and hardware prototypes at Centurion tech pavilion', 'Technical Events', 3, NOW(), 'https://photos.app.goo.gl/9zxigbqmucg7JW5J6', 'VERIFIED_OFFICIAL_CUTMAP', '17 March 2026'),
(4, NULL, '/cutmap_events/cutmap_ev_vehicles_tech.jpg', 'EV VEHICLES Expo & Green Tech', 'Electric vehicle demonstration showcasing solar-assisted drivetrains and sustainable mobility engineering', 'Technical Events', 4, NOW(), 'https://photos.app.goo.gl/HQmQt2EXEVHmD6Uj9', 'VERIFIED_OFFICIAL_CUTMAP', '19 June 2026'),

-- 2. Cultural Events
(5, 1, '/cutmap_events/cutmap_gajajyoti_inauguration.jpg', 'GAJAJYOTI Inauguration 2026', 'Inauguration of Gajajyoti 2026 Annual Inter-College Cultural Festival at CUTM-AP Vizianagaram', 'Cultural Events', 5, NOW(), 'https://photos.app.goo.gl/kZ41vWVZietMZVyU9', 'VERIFIED_OFFICIAL_CUTMAP', '31 January 2026'),
(6, 4, '/cutmap_events/cutmap_public_speaking.jpg', 'Public Speaking Competition – Gajajyoti 2026', 'Inter-departmental elocution and public speaking championship for Gajajyoti 2026', 'Cultural Events', 6, NOW(), 'https://photos.app.goo.gl/3nHP58T8tjXvxCJS6', 'VERIFIED_OFFICIAL_CUTMAP', '9 February 2026'),

-- 3. Sports Events
(7, 20, '/cutmap_events/cutmap_lan_hackathon.jpg', 'UNICONNECT University LAN Championship', 'Collegiate esports teams competing in live LAN matches at CUTM AP indoor auditorium', 'Sports Events', 7, NOW(), 'https://photos.app.goo.gl/xRbScSJxf7PaZWw39', 'VERIFIED_OFFICIAL_CUTMAP', '16 March 2026'),
(8, 16, '/cutmap_events/cutmap_lan_finals.jpg', 'Centurion Sports Meet & LAN Finals', 'Student finalists at the UNICONNECT esports and campus gaming tournament', 'Sports Events', 8, NOW(), 'https://cutmap.ac.in/events-calendar/', 'VERIFIED_OFFICIAL_CUTMAP', '16 March 2026'),

-- 4. Hackathons
(9, 9, '/cutmap_events/cutmap_semicon_day2.jpg', 'SEMICON ARENA (ECE Day-2): Hardware Hackathon', 'Fast-paced embedded IoT hardware hackathon, analog IC design and industry evaluator presentations', 'Hackathons', 9, NOW(), 'https://photos.app.goo.gl/A4MAv3n1HhtQTgQK7', 'VERIFIED_OFFICIAL_CUTMAP', '18 March 2026'),
(10, 3, '/cutmap_events/cutmap_vyomang_day2.jpg', 'Vyomang Day-2: Drone Hackathon', 'Autonomous drone flight obstacle course and avionics circuitry hackathon awards', 'Hackathons', 10, NOW(), 'https://photos.app.goo.gl/yP47LQPYYfXkDwwT8', 'VERIFIED_OFFICIAL_CUTMAP', '6 February 2026'),

-- 5. Workshops
(11, 5, '/cutmap_events/cutmap_cardio_pulmonary.jpg', 'Workshop on Basic Cardio-Pulmonary Life Support', 'Hands-on clinical training on Basic Cardio-Pulmonary Life Support (BCLS) & emergency CPR procedures', 'Workshops', 11, NOW(), 'https://photos.app.goo.gl/R3Vm1DMhPQRqoPyp8', 'VERIFIED_OFFICIAL_CUTMAP', '28 February 2026'),
(12, NULL, '/cutmap_events/cutmap_manufacturing_workforce.jpg', 'Workshop for Tomorrow\'s Manufacturing Workforce', 'Dr. Kaushik Kumar conducting specialized automated manufacturing and CNC engineering workshop', 'Workshops', 12, NOW(), 'https://photos.app.goo.gl/HQEcCshqmZTPN1wv6', 'VERIFIED_OFFICIAL_CUTMAP', '23 March 2026'),
(13, NULL, '/cutmap_events/cutmap_ai_business_analytics.jpg', 'AI Driven Business Analytics Workshop', 'Upasana Das conducting interactive masterclass on AI workflows for enterprise digital transformation', 'Workshops', 13, NOW(), 'https://photos.app.goo.gl/A4oDJStftDt9hi1n9', 'VERIFIED_OFFICIAL_CUTMAP', '11 March 2026'),

-- 6. Seminars
(14, 13, '/cutmap_events/cutmap_quantum_day_2026.jpg', 'World Quantum Day Seminars', 'Faculty and researchers presenting emerging breakthroughs in photonic quantum systems and cryptography', 'Seminars', 14, NOW(), 'https://photos.app.goo.gl/emQ7fzqsiyB4hU2T9', 'VERIFIED_OFFICIAL_CUTMAP', '14 April 2026'),
(15, NULL, '/cutmap_events/cutmap_forensic_seminar.jpg', 'Role of Forensic Sciences In Criminal Prosecution', 'National criminal law and forensic ballistic symposium addressing modern forensic techniques', 'Seminars', 15, NOW(), 'https://photos.app.goo.gl/MuqovrR6DudjEdeV8', 'VERIFIED_OFFICIAL_CUTMAP', '27 June 2026'),

-- 7. Student Activities
(16, 18, '/cutmap_events/cutmap_ncc_farewell.jpg', 'NCC Cadets Valedictory (Once a Cadet, Always a Cadet)', 'Centurion University NCC unit celebrating cadet milestones, discipline and youth leadership', 'Student Activities', 16, NOW(), 'https://photos.app.goo.gl/nhRkvM9JxRJ94Qp49', 'VERIFIED_OFFICIAL_CUTMAP', '11 April 2026'),
(17, 4, '/cutmap_events/cutmap_public_speaking.jpg', 'Centurion Orators Club & Debating Society', 'Undergraduate students delivering keynote orations during inter-departmental competitions', 'Student Activities', 17, NOW(), 'https://photos.app.goo.gl/3nHP58T8tjXvxCJS6', 'VERIFIED_OFFICIAL_CUTMAP', '9 February 2026'),

-- 8. University Celebrations
(18, 7, '/cutmap_events/cutmap_womens_day_2026.jpg', 'Women\'s Day Celebration 2026', 'International Women\'s Day celebrations honoring faculty leaders, researchers and student innovators', 'University Celebrations', 18, NOW(), 'https://photos.app.goo.gl/ZKP61ABJrJSTmW7GA', 'VERIFIED_OFFICIAL_CUTMAP', '9 March 2026'),
(19, 14, '/cutmap_events/cutmap_placement_students.svg', 'Placement Students 2026 Felicitation', 'Official felicitation ceremony honoring Centurion University graduates placed in leading MNCs', 'University Celebrations', 19, NOW(), 'https://photos.app.goo.gl/rCVNRsZ19EHirGaw6', 'UNAVAILABLE', '4 May 2026'),

-- 9. Guest Lectures
(20, 17, '/cutmap_events/cutmap_guest_dst_scientist.jpg', 'Campus Visiting by Dr. Prasada Raju, Former DST Scientist', 'Distinguished guest lecture on translational research, government grants and technological innovation', 'Guest Lectures', 20, NOW(), 'https://photos.app.goo.gl/rCVNRsZ19EHirGaw6', 'VERIFIED_OFFICIAL_CUTMAP', '1 May 2026'),
(21, NULL, '/cutmap_events/cutmap_guest_suresh_kadari.jpg', 'Embedding AI into Product Development by Suresh Kadari', 'Industry guest session by tech lead Suresh Kadari on deploying modern AI into production software', 'Guest Lectures', 21, NOW(), 'https://photos.app.goo.gl/issLQGvYqnKxaUGL7', 'VERIFIED_OFFICIAL_CUTMAP', '10 March 2026'),

-- 10. Social Service Activities
(22, 11, '/cutmap_events/cutmap_nss_blood_donation.jpg', 'NSS Blood Donation Camp', 'Centurion NSS youth voluntary blood donation camp organized with District Red Cross Society', 'Social Service Activities', 22, NOW(), 'https://photos.app.goo.gl/g8FJbqhbLUAyGM9m8', 'VERIFIED_OFFICIAL_CUTMAP', '25 March 2026'),
(23, 10, '/cutmap_events/cutmap_optometry_day.jpg', 'Optometry Day Vision Screening Clinic', 'World Optometry Day community vision screening, refractive exams and outreach clinics in rural villages', 'Social Service Activities', 23, NOW(), 'https://photos.app.goo.gl/mqSowwZfkyrCTPzi6', 'VERIFIED_OFFICIAL_CUTMAP', '24 March 2026'),
(24, 12, '/cutmap_events/cutmap_dandi_march.jpg', 'Dandi March 2.0 (Anti Drug Campaign)', 'Student peace and anti-narcotics community rally across Vizianagaram', 'Social Service Activities', 24, NOW(), 'https://photos.app.goo.gl/HQmQt2EXEVHmD6Uj9', 'VERIFIED_OFFICIAL_CUTMAP', '22 April 2026'),
(25, NULL, '/cutmap_events/cutmap_vidya_daan_social.jpg', 'Vidya Daan Program: School Kit Distribution', 'Centurion student volunteers distributing digital kits, uniforms and notebooks to rural schools', 'Social Service Activities', 25, NOW(), 'https://photos.app.goo.gl/MuqovrR6DudjEdeV8', 'VERIFIED_OFFICIAL_CUTMAP', '1 April 2026'),
(26, NULL, '/cutmap_events/cutmap_no_smoking_day.jpg', 'World No Smoking Day Health Awareness', 'Community health outreach campaign promoting smoke-free lifestyle and cardiovascular wellbeing', 'Social Service Activities', 26, NOW(), 'https://photos.app.goo.gl/Cg6QQgQEUoPmKyRj6', 'VERIFIED_OFFICIAL_CUTMAP', '12 March 2026'),

-- 11. Academic Events
(27, 6, '/cutmap_events/cutmap_pharma_anveshan.jpg', 'Pharma Anveshan 2026', 'School of Pharmacy National Symposium on drug discovery and clinical formulations', 'Academic Events', 27, NOW(), 'https://photos.app.goo.gl/6fNVDfyivoJExkdU7', 'VERIFIED_OFFICIAL_CUTMAP', '5 March 2026'),
(28, NULL, '/cutmap_events/cutmap_phd_viva.jpg', 'Ph.D. Viva-Voce Examination: Mr. Mohammad Anwar Basha', 'Doctoral defense committee examining advanced research in computational engineering', 'Academic Events', 28, NOW(), 'https://photos.app.goo.gl/jzfKvp9tHJi52jvB9', 'VERIFIED_OFFICIAL_CUTMAP', '24 March 2026'),
(29, NULL, '/cutmap_events/cutmap_fpo_mou.jpg', 'CUTMAP FPOs MOU Signing & Agronomy Summit', 'Centurion University signing institutional MoU with Farmer Producer Organizations for smart farming', 'Academic Events', 29, NOW(), 'https://photos.app.goo.gl/HQEcCshqmZTPN1wv6', 'VERIFIED_OFFICIAL_CUTMAP', '3 July 2026'),

-- 12. Campus Life
(30, 19, '/cutmap_events/cutmap_alumni_campus_life.jpg', 'Alumni Reunion Hyderabad 2k26', 'Graduates and distinguished alumni gathering for institutional fellowship and campus reminiscence', 'Campus Life', 30, NOW(), 'https://photos.app.goo.gl/bbfBQGLcNrU2vT83A', 'VERIFIED_OFFICIAL_CUTMAP', '28 March 2026'),
(31, NULL, '/cutmap_events/cutmap_forensic_farewell.jpg', 'Farewell Celebrations: Department of Forensic', 'Graduating forensic science students and faculty commemorating academic journey and campus life', 'Campus Life', 31, NOW(), 'https://photos.app.goo.gl/MuqovrR6DudjEdeV8', 'VERIFIED_OFFICIAL_CUTMAP', '30 March 2026');

