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
            Event e1 = new Event(
                    "Semicon Arena 2026: National VLSI & Semiconductor Symposium",
                    "Technical",
                    "Two-day specialized national technical symposium organized by the Department of Electronics and Communication Engineering (ECE), featuring hands-on chip architecture design, semiconductor fabrication demonstrations, VLSI career roadmaps, and technical project exhibitions at Centurion University AP.",
                    "ECE Block & Advanced Fabrication Facility, CUTM AP Vizianagaram",
                    LocalDate.now().plusDays(14),
                    "09:30 AM",
                    LocalDateTime.now().plusDays(10),
                    150,
                    "/cutmap_events/cutmap_semicon_arena.jpg"
            );
            e1.setOrganizer(organizer);

            Event e2 = new Event(
                    "Gajajyoti 2K26: Annual Inter-College Cultural & Arts Fiesta",
                    "Cultural",
                    "Centurion University AP flagship annual cultural carnival featuring live musical band performances, classical and Western choreography battles, theatrical competitions, celebrity guest performances, and student art installations.",
                    "Main University Amphitheater & Campus Grounds, CUTM AP",
                    LocalDate.now().plusDays(21),
                    "04:30 PM",
                    LocalDateTime.now().plusDays(18),
                    500,
                    "/cutmap_events/cutmap_alumni_reunion.jpg"
            );
            e2.setOrganizer(organizer);

            Event e3 = new Event(
                    "Advanced Workshop: Future of Smart Manufacturing & Automation",
                    "Workshop",
                    "Intensive technical workshop delivered by esteemed expert Dr. Kaushik Kumar on modern Industry 4.0 paradigms, CNC automation, digital additive fabrication, and workforce engineering for automated production lines.",
                    "Mechanical & Mechatronics Engineering Pavilion, Centurion University AP",
                    LocalDate.now().plusDays(7),
                    "10:00 AM",
                    LocalDateTime.now().plusDays(5),
                    80,
                    "/cutmap_events/cutmap_manufacturing_workforce.jpg"
            );
            e3.setOrganizer(organizer);

            Event e4 = new Event(
                    "UNICONNECT University LAN Championship 2026 – CUTM AP",
                    "Sports",
                    "Annual university-wide competitive esports and LAN gaming championship featuring collegiate squads competing in tactical PC and mobile tournaments with live professional commentary, custom trophies, and LED tournament stages.",
                    "Main Auditorium & Advanced Esports Arena, CUTM AP Vizianagaram",
                    LocalDate.now().plusDays(28),
                    "11:00 AM",
                    LocalDateTime.now().plusDays(25),
                    120,
                    "/cutmap_events/cutmap_lan_finals.jpg"
            );
            e4.setOrganizer(organizer);

            eventRepository.save(e1);
            eventRepository.save(e2);
            eventRepository.save(e3);
            eventRepository.save(e4);

            log.info("Seeded official CUTM AP events");
        }

        // 5. Initialize Official CUTM AP Gallery Photos if table is empty
        if (galleryRepository.count() == 0) {
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_lan_finals.jpg", "UNICONNECT University LAN Finals", "Collegiate esports teams competing in live LAN matches at CUTM AP Vizianagaram", "Sports", 1));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_semicon_arena.jpg", "Semicon Arena ECE Technical Expo", "Department of ECE students demonstrating VLSI silicon design and embedded circuits", "Technical", 2));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_manufacturing_workforce.jpg", "Future Manufacturing Workshop", "Dr. Kaushik Kumar conducting smart CNC & automated manufacturing lab session", "Workshop", 3));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_ai_product_dev.jpg", "Generative AI Product Development", "Suresh Kadari training computer science undergraduates in AI system engineering", "Technical", 4));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_optometry_camp.jpg", "World Optometry Day Vision Screening", "Centurion University Optometry faculty and students conducting community vision checkups", "Community", 5));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_blood_donation.jpg", "NSS Voluntary Blood Donation Camp", "Student and faculty donors participating in the humanitarian blood donation drive", "Community", 6));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_quantum_day.jpg", "World Quantum Day Celebrations", "Faculty and researchers presenting emerging breakthroughs in photonic quantum systems", "Conference", 7));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_alumni_reunion.jpg", "Centurion University Alumni Reunion", "Alumni homecoming celebrating institutional excellence and graduate milestones", "Cultural", 8));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_ev_vehicles.jpg", "Electric Vehicles & Clean Mobility Expo", "Electric mobility symposium featuring custom EV prototypes and solar drivetrain tech", "Technical", 9));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_forensic_science.jpg", "Forensic Sciences in Criminal Law", "Specialized forensic symposium on ballistic verification and digital criminalistics", "Conference", 10));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_fpo_academia.jpg", "FPO-Academia Agribusiness Summit", "School of Agriculture summit with farmer producer groups for precision agronomy", "Workshop", 11));
            galleryRepository.save(new EventGallery(null, "/cutmap_events/cutmap_vidya_daan.jpg", "Vidya Daan School Kit Outreach", "Centurion volunteers providing educational kits and digital tablets to rural schools", "Community", 12));
            log.info("Seeded 12 official CUTM AP gallery images");
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
}
