package com.college.event.config;

import com.college.event.entity.*;
import com.college.event.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final OrganizerRepository organizerRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final EventGalleryRepository galleryRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminRepository adminRepository,
                           StudentRepository studentRepository,
                           OrganizerRepository organizerRepository,
                           EventRepository eventRepository,
                           RegistrationRepository registrationRepository,
                           EventGalleryRepository galleryRepository,
                           AnnouncementRepository announcementRepository,
                           PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.organizerRepository = organizerRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.galleryRepository = galleryRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Initialize or Reset Admin Password to Admin@123
        Admin admin = adminRepository.findByUsername("admin")
                .orElse(new Admin("admin", "", "System Administrator", "admin@college.edu", "ROLE_ADMIN"));
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        adminRepository.save(admin);
        log.info("Default admin initialized/updated: admin / Admin@123");

        // 2. Initialize Default Faculty Organizer
        Organizer organizer = organizerRepository.findByUsername("organizer")
                .orElse(new Organizer("organizer", "", "Dr. Priya Deshmukh", "priya.organizer@college.edu", "+91 98450 12345", "Computer Science & Engineering"));
        organizer.setPassword(passwordEncoder.encode("Admin@123"));
        organizerRepository.save(organizer);
        log.info("Default organizer initialized/updated: organizer / Admin@123");

        // 3. Initialize Sample Student
        if (!studentRepository.existsByStudentId("STU-2026-001")) {
            Student student = new Student(
                    "STU-2026-001",
                    "Rahul Sharma",
                    "rahul.sharma@college.edu",
                    passwordEncoder.encode("Student@123"),
                    "+91 98765 43210",
                    "Computer Science & Engineering",
                    "3rd Year"
            );
            studentRepository.save(student);
            log.info("Sample student created: STU-2026-001 / Student@123");
        }

        // 4. Initialize Official CUTM AP Events if table is empty
        if (eventRepository.count() == 0) {
            createEvent("GAJAJYOTI Inauguration 2026", "Cultural Events",
                    "Official inaugural commencement of Gajajyoti 2026, Centurion University's flagship annual cultural and arts extravaganza.",
                    "Main Auditorium & Amphitheater, CUTM-AP", LocalDate.of(2026, 1, 31), "10:00 AM", 500, 245,
                    "/cutmap_events/cutmap_gajajyoti_inauguration.jpg", "https://photos.app.goo.gl/kZ41vWVZietMZVyU9", organizer);

            createEvent("Vyomang Day-1", "Technical Events",
                    "Day 1 of Vyomang 2026 National Aerospace and Engineering Conclave featuring keynote sessions on UAV systems and aerodynamics.",
                    "Aero Tech Pavilion & Center of Excellence, CUTM-AP", LocalDate.of(2026, 2, 5), "09:30 AM", 300, 180,
                    "/cutmap_events/cutmap_vyomang_day1.jpg", "https://photos.app.goo.gl/nhRkvM9JxRJ94Qp49", organizer);

            createEvent("Vyomang Day-2", "Technical Events",
                    "Day 2 of Vyomang 2026 highlighting autonomous drone flight obstacle courses, CAD aircraft modeling, and avionics hackathon.",
                    "Robotics Arena & Flight Test Grounds, CUTM-AP", LocalDate.of(2026, 2, 6), "09:30 AM", 300, 210,
                    "/cutmap_events/cutmap_vyomang_day2.jpg", "https://photos.app.goo.gl/yP47LQPYYfXkDwwT8", organizer);

            createEvent("Public Speaking Competition – Gajajyoti 2026", "Cultural Events",
                    "Annual Inter-Departmental Public Speaking & Elocution Championship organized under the Gajajyoti 2026 banner.",
                    "Seminar Hall 1, CUTM-AP", LocalDate.of(2026, 2, 9), "02:00 PM", 150, 75,
                    "/cutmap_events/cutmap_public_speaking.jpg", "https://photos.app.goo.gl/3nHP58T8tjXvxCJS6", organizer);

            createEvent("Workshop on Basic Cardio-Pulmonary Life Support", "Workshops",
                    "Comprehensive clinical workshop on Basic Cardio-Pulmonary Life Support (BCLS) and emergency resuscitation techniques.",
                    "School of Paramedics & Allied Health Sciences Lab, CUTM-AP", LocalDate.of(2026, 2, 28), "10:00 AM", 120, 115,
                    "/cutmap_events/cutmap_cardio_pulmonary.jpg", "https://photos.app.goo.gl/R3Vm1DMhPQRqoPyp8", organizer);

            createEvent("Pharma Anveshan 2026", "Academic Events",
                    "National symposium organized on National Pharmacy Education Day celebrating innovation in pharmaceutical sciences.",
                    "Pharmacy Auditorium, Centurion University AP", LocalDate.of(2026, 3, 5), "09:00 AM", 250, 190,
                    "/cutmap_events/cutmap_pharma_anveshan.jpg", "https://photos.app.goo.gl/6fNVDfyivoJExkdU7", organizer);

            createEvent("Women's Day Celebration 2026", "University Celebrations",
                    "Centurion University celebration of International Women's Day honoring faculty leaders and student innovators.",
                    "Central Convention Hall, CUTM-AP", LocalDate.of(2026, 3, 9), "11:00 AM", 400, 320,
                    "/cutmap_events/cutmap_womens_day_2026.jpg", "https://photos.app.goo.gl/ZKP61ABJrJSTmW7GA", organizer);

            createEvent("SEMICON ARENA (ECE Day-1)", "Technical Events",
                    "Semicon Arena 2026 Day 1 technical symposium organized by the Department of ECE on VLSI silicon design circuits.",
                    "Department of ECE & VLSI Design Center, CUTM-AP", LocalDate.of(2026, 3, 17), "09:00 AM", 300, 260,
                    "/cutmap_events/cutmap_semicon_day1.jpg", "https://photos.app.goo.gl/9zxigbqmucg7JW5J6", organizer);

            createEvent("SEMICON ARENA (ECE Day-2)", "Hackathons",
                    "Semicon Arena Day 2 project exhibitions and embedded hardware hackathon with smart sensor arrays.",
                    "IoT & Embedded Systems Laboratory, CUTM-AP", LocalDate.of(2026, 3, 18), "09:30 AM", 250, 210,
                    "/cutmap_events/cutmap_semicon_day2.jpg", "https://photos.app.goo.gl/A4MAv3n1HhtQTgQK7", organizer);

            createEvent("Optometry Day", "Social Service Activities",
                    "World Optometry Day outreach initiative by the Department of Optometry providing free vision screenings.",
                    "Optometry Clinic & Community Health Wing, CUTM-AP", LocalDate.of(2026, 3, 24), "08:30 AM", 200, 140,
                    "/cutmap_events/cutmap_optometry_day.jpg", "https://photos.app.goo.gl/mqSowwZfkyrCTPzi6", organizer);

            createEvent("NSS Blood Donation Camp", "Social Service Activities",
                    "Voluntary Blood Donation Drive organized by the Centurion University NSS Unit with District Red Cross Blood Bank.",
                    "Student Activity Centre, Centurion University AP", LocalDate.of(2026, 3, 25), "09:00 AM", 300, 205,
                    "/cutmap_events/cutmap_nss_blood_donation.jpg", "https://photos.app.goo.gl/g8FJbqhbLUAyGM9m8", organizer);

            createEvent("World Quantum Day", "Seminars",
                    "Celebration of World Quantum Day 2026 featuring research lectures on quantum computing and algorithms.",
                    "Department of Physics & Computational Science Lab, CUTM-AP", LocalDate.of(2026, 4, 14), "10:00 AM", 200, 165,
                    "/cutmap_events/cutmap_quantum_day_2026.jpg", "https://photos.app.goo.gl/emQ7fzqsiyB4hU2T9", organizer);

            createEvent("Dandi March 2.0 (Anti Drug Campaign)", "Social Service Activities",
                    "Dandi March 2.0 student peace and anti-drug public awareness march organized by Centurion University youth volunteers.",
                    "Campus Boulevard to Vizianagaram Junction, CUTM-AP", LocalDate.of(2026, 4, 22), "07:00 AM", 500, 380,
                    "/cutmap_events/cutmap_dandi_march.jpg", "https://photos.app.goo.gl/HQmQt2EXEVHmD6Uj9", organizer);

            createEvent("Placement Students 2026", "Placement Events",
                    "Annual campus placement felicitation ceremony celebrating Centurion University AP 2026 graduates securing offers in leading MNCs.",
                    "University Auditorium, CUTM-AP Vizianagaram Campus", LocalDate.of(2026, 5, 4), "04:00 PM", 450, 290,
                    "/cutmap_events/cutmap_placement_students_2026.jpg", "https://photos.app.goo.gl/rCVNRsZ19EHirGaw6", organizer);

            log.info("Seeded 14 verified CUTM AP events");
        }

        // 5. Initialize Official CUTM AP Gallery Photos across all 12 categories + Placement Events
        if (galleryRepository.count() == 0) {
            // Technical Events
            saveGallery("/cutmap_events/cutmap_semicon_day1.jpg", "SEMICON ARENA (ECE Day-1)", "Department of ECE technical expo featuring VLSI silicon design", "Technical Events", 1, "17 March 2026", "https://photos.app.goo.gl/9zxigbqmucg7JW5J6");
            saveGallery("/cutmap_events/cutmap_vyomang_day1.jpg", "Vyomang Day-1: Aerospace Conclave", "National Aerospace and Tech Fest opening keynotes and UAV models", "Technical Events", 2, "5 February 2026", "https://photos.app.goo.gl/nhRkvM9JxRJ94Qp49");
            saveGallery("/cutmap_events/cutmap_semicon_arena.jpg", "Semicon Arena ECE Project Showcase", "ECE student engineers presenting smart sensors and hardware prototypes", "Technical Events", 3, "17 March 2026", "https://photos.app.goo.gl/9zxigbqmucg7JW5J6");
            saveGallery("/cutmap_events/cutmap_ev_vehicles_tech.jpg", "EV VEHICLES Expo & Green Tech", "Electric vehicle demonstration showcasing sustainable mobility engineering", "Technical Events", 4, "19 June 2026", "https://photos.app.goo.gl/HQmQt2EXEVHmD6Uj9");

            // Cultural Events
            saveGallery("/cutmap_events/cutmap_gajajyoti_inauguration.jpg", "GAJAJYOTI Inauguration 2026", "Inauguration of Gajajyoti 2026 Annual Inter-College Cultural Festival", "Cultural Events", 5, "31 January 2026", "https://photos.app.goo.gl/kZ41vWVZietMZVyU9");
            saveGallery("/cutmap_events/cutmap_public_speaking.jpg", "Public Speaking Competition – Gajajyoti 2026", "Inter-departmental elocution and public speaking championship", "Cultural Events", 6, "9 February 2026", "https://photos.app.goo.gl/3nHP58T8tjXvxCJS6");

            // Sports Events
            saveGallery("/cutmap_events/cutmap_lan_hackathon.jpg", "UNICONNECT University LAN Championship", "Collegiate esports teams competing in live LAN matches", "Sports Events", 7, "16 March 2026", "https://photos.app.goo.gl/xRbScSJxf7PaZWw39");
            saveGallery("/cutmap_events/cutmap_lan_finals.jpg", "Centurion Sports Meet & LAN Finals", "Student finalists at the UNICONNECT esports championship", "Sports Events", 8, "16 March 2026", "https://cutmap.ac.in/events-calendar/");

            // Hackathons
            saveGallery("/cutmap_events/cutmap_semicon_day2.jpg", "SEMICON ARENA (ECE Day-2): Hardware Hackathon", "Fast-paced embedded IoT hardware hackathon and IC design", "Hackathons", 9, "18 March 2026", "https://photos.app.goo.gl/A4MAv3n1HhtQTgQK7");
            saveGallery("/cutmap_events/cutmap_ai_product_dev.jpg", "24-Hour AI Product Hackathon", "Computer science undergraduates building generative AI prototypes", "Hackathons", 10, "15 May 2026", "https://photos.app.goo.gl/rCVNRsZ19EHirGaw6");

            // Workshops
            saveGallery("/cutmap_events/cutmap_cardio_pulmonary.jpg", "Workshop on Basic Cardio-Pulmonary Life Support", "Clinical emergency life support training for paramedical students", "Workshops", 11, "28 February 2026", "https://photos.app.goo.gl/R3Vm1DMhPQRqoPyp8");
            saveGallery("/cutmap_events/cutmap_manufacturing_workforce.jpg", "Future of Smart Manufacturing & Automation", "Dr. Kaushik Kumar conducting Industry 4.0 automation workshop", "Workshops", 12, "20 May 2026", "https://photos.app.goo.gl/nhRkvM9JxRJ94Qp49");

            // Seminars
            saveGallery("/cutmap_events/cutmap_quantum_day_2026.jpg", "World Quantum Day 2026 Seminar", "National symposium on quantum algorithms and photonic communication", "Seminars", 13, "14 April 2026", "https://photos.app.goo.gl/emQ7fzqsiyB4hU2T9");
            saveGallery("/cutmap_events/cutmap_quantum_day.jpg", "Quantum Information & Cryptography Lecture", "Distinguished speaker address on post-quantum cybersecurity", "Seminars", 14, "14 April 2026", "https://photos.app.goo.gl/emQ7fzqsiyB4hU2T9");

            // Student Activities
            saveGallery("/cutmap_events/cutmap_ncc_farewell.jpg", "NCC Cadets Passing Parade & Farewell", "Centurion University NCC unit ceremonial passing parade", "Student Activities", 15, "11 April 2026", "https://photos.app.goo.gl/nhRkvM9JxRJ94Qp49");
            saveGallery("/cutmap_events/cutmap_forensic_farewell.jpg", "Department of Forensic Sciences Farewell 2026", "Graduating forensic science students farewell ceremony", "Student Activities", 16, "19 March 2026", "https://photos.app.goo.gl/3nHP58T8tjXvxCJS6");

            // University Celebrations
            saveGallery("/cutmap_events/cutmap_womens_day_2026.jpg", "Women's Day Celebration 2026", "Centurion University celebrating International Women's Day", "University Celebrations", 17, "9 March 2026", "https://photos.app.goo.gl/ZKP61ABJrJSTmW7GA");

            // Guest Lectures
            saveGallery("/cutmap_events/cutmap_guest_dst_scientist.jpg", "Guest Lecture by Dr. Prasada Raju, Former DST Scientist", "Keynote address on National Research Funding and Innovation", "Guest Lectures", 18, "1 May 2026", "https://photos.app.goo.gl/rCVNRsZ19EHirGaw6");
            saveGallery("/cutmap_events/cutmap_guest_suresh_kadari.jpg", "Guest Talk: Suresh Kadari on Enterprise AI Systems", "Interactive industry session on scalable generative AI products", "Guest Lectures", 19, "15 May 2026", "https://photos.app.goo.gl/rCVNRsZ19EHirGaw6");

            // Social Service Activities
            saveGallery("/cutmap_events/cutmap_nss_blood_donation.jpg", "NSS Blood Donation Camp", "Centurion University NSS voluntary blood donation camp", "Social Service Activities", 20, "25 March 2026", "https://photos.app.goo.gl/g8FJbqhbLUAyGM9m8");
            saveGallery("/cutmap_events/cutmap_dandi_march.jpg", "Dandi March 2.0 (Anti Drug Campaign)", "Peace march by student volunteers advocating substance abuse prevention", "Social Service Activities", 21, "22 April 2026", "https://photos.app.goo.gl/HQmQt2EXEVHmD6Uj9");
            saveGallery("/cutmap_events/cutmap_optometry_day.jpg", "Optometry Day Vision Screening", "Free clinical refraction testing and ocular health checkups", "Social Service Activities", 22, "24 March 2026", "https://photos.app.goo.gl/mqSowwZfkyrCTPzi6");

            // Academic Events
            saveGallery("/cutmap_events/cutmap_pharma_anveshan.jpg", "Pharma Anveshan 2026", "National Pharmacy Education Day scientific paper presentations", "Academic Events", 23, "5 March 2026", "https://photos.app.goo.gl/6fNVDfyivoJExkdU7");
            saveGallery("/cutmap_events/cutmap_phd_viva.jpg", "Doctoral PhD Viva Voce & Defense", "Public academic defense of doctoral research thesis at CUTM-AP", "Academic Events", 24, "8 May 2026", "https://photos.app.goo.gl/rCVNRsZ19EHirGaw6");

            // Campus Life
            saveGallery("/cutmap_events/cutmap_alumni_campus_life.jpg", "Centurion Alumni Reunion & Homecoming 2k26", "Campus evening gathering celebrating institutional milestones", "Campus Life", 25, "28 March 2026", "https://photos.app.goo.gl/bbfBQGLcNrU2vT83A");
            saveGallery("/cutmap_events/cutmap_alumni_reunion.jpg", "Annual University Gala Dinner & Networking", "Faculty and alumni celebrating institutional growth and awards", "Campus Life", 26, "28 March 2026", "https://photos.app.goo.gl/bbfBQGLcNrU2vT83A");

            // Placement Events
            saveGallery("/cutmap_events/cutmap_placement_students_2026.jpg", "Placement Students 2026", "Annual campus placement felicitation ceremony celebrating Centurion University AP 2026 graduates", "Placement Events", 27, "4 May 2026", "https://photos.app.goo.gl/rCVNRsZ19EHirGaw6");

            log.info("Seeded 27 official CUTM AP gallery images across all 12 categories + Placement Events");
        }

        // 6. Initialize Sample Announcements if table is empty
        if (announcementRepository.count() == 0) {
            announcementRepository.save(new Announcement(
                    "Registration Open for HackNova 2026",
                    "Early bird registrations for the 24-hour national hackathon are now open. Team slots are limited to 120 participants.",
                    "ALL",
                    null,
                    "Dr. Priya Deshmukh",
                    LocalDate.now().plusDays(10)
            ));
            announcementRepository.save(new Announcement(
                    "QR Attendance Enabled for Sanskriti 2026",
                    "All registered attendees must present their digital QR pass at the entrance gate for instant attendance verification.",
                    "ALL",
                    null,
                    "Campus Activity Cell",
                    LocalDate.now().plusDays(20)
            ));
            log.info("Seeded 2 initial announcements");
        }
    }

    private void createEvent(String title, String category, String description, String venue,
                             LocalDate date, String time, int capacity, int registered,
                             String imageUrl, String source, Organizer organizer) {
        Event event = new Event(title, category, description, venue, date, time,
                date.atTime(18, 0).minusDays(1), capacity, imageUrl);
        event.setCurrentRegistrations(registered);
        event.setStatus(EventStatus.COMPLETED);
        event.setOfficialSource(source);
        event.setPermissionStatus("VERIFIED_OFFICIAL_CUTMAP");
        event.setOrganizer(organizer);
        eventRepository.save(event);
    }

    private void saveGallery(String imageUrl, String title, String caption, String category,
                             int displayOrder, String eventDate, String source) {
        EventGallery gallery = new EventGallery(null, imageUrl, title, caption, category, displayOrder);
        gallery.setEventDate(eventDate);
        gallery.setOfficialSource(source);
        gallery.setPermissionStatus("VERIFIED_OFFICIAL_CUTMAP");
        galleryRepository.save(gallery);
    }
}
