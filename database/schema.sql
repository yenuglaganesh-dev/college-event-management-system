-- ========================================================
-- College Event Management System - Database Schema
-- Database: MySQL 8+
-- ========================================================

CREATE DATABASE IF NOT EXISTS `college_event_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `college_event_db`;

-- --------------------------------------------------------
-- Table: admins
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_ADMIN',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: organizers
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `organizers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `phone` VARCHAR(20) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_ORGANIZER',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: students
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` VARCHAR(50) NOT NULL UNIQUE,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `year_of_study` VARCHAR(20) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_STUDENT',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: events
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `venue` VARCHAR(150) NOT NULL,
    `event_date` DATE NOT NULL,
    `event_time` VARCHAR(20) NOT NULL,
    `registration_deadline` DATETIME NOT NULL,
    `max_capacity` INT NOT NULL,
    `current_registrations` INT NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `image_url` VARCHAR(255) DEFAULT NULL,
    `organizer_id` BIGINT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_event_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `organizers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: registrations
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `registrations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `registration_code` VARCHAR(50) NOT NULL UNIQUE,
    `student_id` BIGINT NOT NULL,
    `event_id` BIGINT NOT NULL,
    `registration_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    `admin_remarks` VARCHAR(255) DEFAULT NULL,
    `updated_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reg_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reg_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `uk_student_event_registration` UNIQUE (`student_id`, `event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: attendances
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `attendances` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `registration_id` BIGINT NOT NULL UNIQUE,
    `event_id` BIGINT NOT NULL,
    `student_id` BIGINT NOT NULL,
    `marked_by` VARCHAR(100) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PRESENT',
    `marked_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_att_reg` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_att_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_att_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: certificates
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `certificates` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `certificate_code` VARCHAR(50) NOT NULL UNIQUE,
    `registration_id` BIGINT NOT NULL UNIQUE,
    `student_id` BIGINT NOT NULL,
    `event_id` BIGINT NOT NULL,
    `issue_date` DATE NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ISSUED',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_cert_reg` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cert_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cert_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: announcements
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `announcements` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `priority` VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    `target_role` VARCHAR(20) NOT NULL DEFAULT 'ALL',
    `event_id` BIGINT DEFAULT NULL,
    `author_name` VARCHAR(100) NOT NULL,
    `author_role` VARCHAR(30) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ann_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: event_gallery
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_gallery` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `caption` VARCHAR(255) DEFAULT NULL,
    `event_id` BIGINT DEFAULT NULL,
    `uploaded_by` VARCHAR(100) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_gallery_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: feedbacks
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `feedbacks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `registration_id` BIGINT NOT NULL UNIQUE,
    `student_id` BIGINT NOT NULL,
    `event_id` BIGINT NOT NULL,
    `rating` INT NOT NULL,
    `comments` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_fb_reg` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_fb_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_fb_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: event_waitlists
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `event_waitlists` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `event_id` BIGINT NOT NULL,
    `student_id` BIGINT NOT NULL,
    `position` INT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'WAITING',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_wl_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_wl_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    CONSTRAINT `uk_waitlist_student_event` UNIQUE (`student_id`, `event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: audit_logs
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `action` VARCHAR(100) NOT NULL,
    `entity_name` VARCHAR(50) NOT NULL,
    `entity_id` BIGINT DEFAULT NULL,
    `performed_by` VARCHAR(100) NOT NULL,
    `role` VARCHAR(30) NOT NULL,
    `details` TEXT DEFAULT NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Indexes
-- --------------------------------------------------------
CREATE INDEX `idx_events_status_date` ON `events` (`status`, `event_date`);
CREATE INDEX `idx_registrations_status` ON `registrations` (`status`);
CREATE INDEX `idx_registrations_student` ON `registrations` (`student_id`);
CREATE INDEX `idx_registrations_event` ON `registrations` (`event_id`);
CREATE INDEX `idx_certificates_code` ON `certificates` (`certificate_code`);
CREATE INDEX `idx_announcements_created` ON `announcements` (`created_at`);
