/* ======================================================
 CLEAN RESEED FOR: student_portal
 - Emails: Gmail only
 - Password for all users: Password@123
 - Admins: 2, Faculty: 5, Parents: 20, Students: 20
 - Courses: 6 (assigned to faculty)
 - Enrollments: each student -> BIM101..BIM103 (3 courses)
 - Attendance: 3 recent days
 - Marks: Midterm & Final
 ====================================================== */
USE student_portal;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE marks;
TRUNCATE TABLE attendance;
TRUNCATE TABLE enrollments;
TRUNCATE TABLE courses;
TRUNCATE TABLE students;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
/* bcrypt ($2a$) hash for Password@123 — works with bcryptjs */
SET @PWD := '$2a$10$LsEIr0Tx1Qxv8TRKuAIvz.Flruwrd1ZTcDAHHt.bi69wYkV5DoOFq';
/* ======================
 USERS — Students (20)
 ====================== */
INSERT INTO users (email, password_hash, role, full_name)
VALUES (
        'student01@gmail.com',
        @PWD,
        'STUDENT',
        'Aayush Shrestha'
    ),
    (
        'student02@gmail.com',
        @PWD,
        'STUDENT',
        'Kritika Ghimire'
    ),
    (
        'student03@gmail.com',
        @PWD,
        'STUDENT',
        'Pratik Adhikari'
    ),
    (
        'student04@gmail.com',
        @PWD,
        'STUDENT',
        'Nisha Karki'
    ),
    (
        'student05@gmail.com',
        @PWD,
        'STUDENT',
        'Saurav Thapa'
    ),
    (
        'student06@gmail.com',
        @PWD,
        'STUDENT',
        'Nirajan Khadka'
    ),
    (
        'student07@gmail.com',
        @PWD,
        'STUDENT',
        'Shristi Bista'
    ),
    (
        'student08@gmail.com',
        @PWD,
        'STUDENT',
        'Bibek Poudel'
    ),
    (
        'student09@gmail.com',
        @PWD,
        'STUDENT',
        'Aarati Pandey'
    ),
    (
        'student10@gmail.com',
        @PWD,
        'STUDENT',
        'Sanjay Shah'
    ),
    (
        'student11@gmail.com',
        @PWD,
        'STUDENT',
        'Kabir Koirala'
    ),
    (
        'student12@gmail.com',
        @PWD,
        'STUDENT',
        'Anisha Shrestha'
    ),
    (
        'student13@gmail.com',
        @PWD,
        'STUDENT',
        'Suman Gurung'
    ),
    (
        'student14@gmail.com',
        @PWD,
        'STUDENT',
        'Asmita Rai'
    ),
    (
        'student15@gmail.com',
        @PWD,
        'STUDENT',
        'Prakash Panta'
    ),
    (
        'student16@gmail.com',
        @PWD,
        'STUDENT',
        'Rashmi Tamang'
    ),
    (
        'student17@gmail.com',
        @PWD,
        'STUDENT',
        'Rohit Neupane'
    ),
    (
        'student18@gmail.com',
        @PWD,
        'STUDENT',
        'Pramila KC'
    ),
    (
        'student19@gmail.com',
        @PWD,
        'STUDENT',
        'Bishal Shahi'
    ),
    (
        'student20@gmail.com',
        @PWD,
        'STUDENT',
        'Indira Lama'
    );
/* ======================
 USERS — Faculty (5)
 ====================== */
INSERT INTO users (email, password_hash, role, full_name)
VALUES (
        'faculty1@gmail.com',
        @PWD,
        'FACULTY',
        'Prof. Ramesh Shrestha'
    ),
    (
        'faculty2@gmail.com',
        @PWD,
        'FACULTY',
        'Prof. Sita Koirala'
    ),
    (
        'faculty3@gmail.com',
        @PWD,
        'FACULTY',
        'Prof. Bikash Adhikari'
    ),
    (
        'faculty4@gmail.com',
        @PWD,
        'FACULTY',
        'Prof. Nirmala Basnet'
    ),
    (
        'faculty5@gmail.com',
        @PWD,
        'FACULTY',
        'Prof. Prakash Thapa'
    );
/* ======================
 USERS — Admins (2)
 ====================== */
INSERT INTO users (email, password_hash, role, full_name)
VALUES (
        'admin1@gmail.com',
        @PWD,
        'ADMIN',
        'System Admin One'
    ),
    (
        'admin2@gmail.com',
        @PWD,
        'ADMIN',
        'System Admin Two'
    );
/* ======================
 USERS — Parents (20)
 ====================== */
INSERT INTO users (email, password_hash, role, full_name)
VALUES (
        'parent01@gmail.com',
        @PWD,
        'PARENT',
        'Manoj Shrestha'
    ),
    (
        'parent02@gmail.com',
        @PWD,
        'PARENT',
        'Sushila Ghimire'
    ),
    (
        'parent03@gmail.com',
        @PWD,
        'PARENT',
        'Ramesh Adhikari'
    ),
    (
        'parent04@gmail.com',
        @PWD,
        'PARENT',
        'Rajendra Karki'
    ),
    (
        'parent05@gmail.com',
        @PWD,
        'PARENT',
        'Bhuwan Thapa'
    ),
    (
        'parent06@gmail.com',
        @PWD,
        'PARENT',
        'Mina Khadka'
    ),
    (
        'parent07@gmail.com',
        @PWD,
        'PARENT',
        'Krishna Bista'
    ),
    (
        'parent08@gmail.com',
        @PWD,
        'PARENT',
        'Bimala Poudel'
    ),
    (
        'parent09@gmail.com',
        @PWD,
        'PARENT',
        'Narayan Pandey'
    ),
    (
        'parent10@gmail.com',
        @PWD,
        'PARENT',
        'Gita Shah'
    ),
    (
        'parent11@gmail.com',
        @PWD,
        'PARENT',
        'Sunil Koirala'
    ),
    (
        'parent12@gmail.com',
        @PWD,
        'PARENT',
        'Saraswati Shrestha'
    ),
    (
        'parent13@gmail.com',
        @PWD,
        'PARENT',
        'Kamal Gurung'
    ),
    (
        'parent14@gmail.com',
        @PWD,
        'PARENT',
        'Sujata Rai'
    ),
    (
        'parent15@gmail.com',
        @PWD,
        'PARENT',
        'Dipak Panta'
    ),
    (
        'parent16@gmail.com',
        @PWD,
        'PARENT',
        'Rita Tamang'
    ),
    (
        'parent17@gmail.com',
        @PWD,
        'PARENT',
        'Hari Neupane'
    ),
    ('parent18@gmail.com', @PWD, 'PARENT', 'Laxmi KC'),
    (
        'parent19@gmail.com',
        @PWD,
        'PARENT',
        'Bharat Shahi'
    ),
    (
        'parent20@gmail.com',
        @PWD,
        'PARENT',
        'Indira Lama'
    );
/* ==========================================
 STUDENT PROFILES — link user_id + parent_email
 Program: BIM, Roll: STU001..STU020, Semester: 1..8
 ========================================== */
INSERT INTO students (
        user_id,
        roll_no,
        program,
        semester,
        parent_email
    )
VALUES (
        (
            SELECT id
            FROM users
            WHERE email = 'student01@gmail.com'
        ),
        'STU001',
        'BIM',
        1,
        'parent01@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student02@gmail.com'
        ),
        'STU002',
        'BIM',
        2,
        'parent02@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student03@gmail.com'
        ),
        'STU003',
        'BIM',
        3,
        'parent03@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student04@gmail.com'
        ),
        'STU004',
        'BIM',
        4,
        'parent04@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student05@gmail.com'
        ),
        'STU005',
        'BIM',
        5,
        'parent05@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student06@gmail.com'
        ),
        'STU006',
        'BIM',
        6,
        'parent06@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student07@gmail.com'
        ),
        'STU007',
        'BIM',
        7,
        'parent07@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student08@gmail.com'
        ),
        'STU008',
        'BIM',
        8,
        'parent08@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student09@gmail.com'
        ),
        'STU009',
        'BIM',
        1,
        'parent09@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student10@gmail.com'
        ),
        'STU010',
        'BIM',
        2,
        'parent10@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student11@gmail.com'
        ),
        'STU011',
        'BIM',
        3,
        'parent11@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student12@gmail.com'
        ),
        'STU012',
        'BIM',
        4,
        'parent12@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student13@gmail.com'
        ),
        'STU013',
        'BIM',
        5,
        'parent13@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student14@gmail.com'
        ),
        'STU014',
        'BIM',
        6,
        'parent14@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student15@gmail.com'
        ),
        'STU015',
        'BIM',
        7,
        'parent15@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student16@gmail.com'
        ),
        'STU016',
        'BIM',
        8,
        'parent16@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student17@gmail.com'
        ),
        'STU017',
        'BIM',
        2,
        'parent17@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student18@gmail.com'
        ),
        'STU018',
        'BIM',
        4,
        'parent18@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student19@gmail.com'
        ),
        'STU019',
        'BIM',
        6,
        'parent19@gmail.com'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE email = 'student20@gmail.com'
        ),
        'STU020',
        'BIM',
        8,
        'parent20@gmail.com'
    );
/* ======================
 COURSES (6) — assign to faculty
 ====================== */
INSERT INTO courses (code, title, credit, faculty_id)
VALUES (
        'BIM101',
        'Principles of Management',
        3,
        (
            SELECT id
            FROM users
            WHERE email = 'faculty1@gmail.com'
        )
    ),
    (
        'BIM102',
        'Business Mathematics',
        3,
        (
            SELECT id
            FROM users
            WHERE email = 'faculty1@gmail.com'
        )
    ),
    (
        'BIM103',
        'Computer Programming',
        3,
        (
            SELECT id
            FROM users
            WHERE email = 'faculty2@gmail.com'
        )
    ),
    (
        'BIM104',
        'Database Management',
        3,
        (
            SELECT id
            FROM users
            WHERE email = 'faculty3@gmail.com'
        )
    ),
    (
        'BIM105',
        'Business Communication',
        3,
        (
            SELECT id
            FROM users
            WHERE email = 'faculty4@gmail.com'
        )
    ),
    (
        'BIM106',
        'Web Technology',
        3,
        (
            SELECT id
            FROM users
            WHERE email = 'faculty5@gmail.com'
        )
    );
/* ==========================================
 ENROLLMENTS — each student -> BIM101..BIM103
 ========================================== */
INSERT INTO enrollments (student_id, course_id)
SELECT s.id,
    c.id
FROM students s
    JOIN courses c ON c.code IN ('BIM101', 'BIM102', 'BIM103');
/* ==========================================
 ATTENDANCE — 3 recent days per enrollment
 ========================================== */
INSERT INTO attendance (enrollment_id, date, status)
SELECT e.id,
    CURDATE() - INTERVAL 2 DAY,
    CASE
        WHEN (e.id % 3) = 0 THEN 'ABSENT'
        ELSE 'PRESENT'
    END
FROM enrollments e;
INSERT INTO attendance (enrollment_id, date, status)
SELECT e.id,
    CURDATE() - INTERVAL 1 DAY,
    CASE
        WHEN (e.id % 4) = 0 THEN 'ABSENT'
        ELSE 'PRESENT'
    END
FROM enrollments e;
INSERT INTO attendance (enrollment_id, date, status)
SELECT e.id,
    CURDATE(),
    CASE
        WHEN (e.id % 5) = 0 THEN 'ABSENT'
        ELSE 'PRESENT'
    END
FROM enrollments e;
/* ==========================================
 MARKS — Midterm & Final per enrollment
 ========================================== */
INSERT INTO marks (enrollment_id, assessment, score, max_score)
SELECT e.id,
    'Midterm',
    45 + (e.id % 11),
    50
FROM enrollments e;
INSERT INTO marks (enrollment_id, assessment, score, max_score)
SELECT e.id,
    'Final',
    80 + (e.id % 21),
    100
FROM enrollments e;
/* ======================
 QUICK CHECKS (optional)
 ====================== */
/* SELECT role, COUNT(*) FROM users GROUP BY role;
 SELECT COUNT(*) AS students_ct FROM students;
 SELECT COUNT(*) AS courses_ct FROM courses;
 SELECT COUNT(*) AS enrollments_ct FROM enrollments;
 SELECT COUNT(*) AS attendance_ct FROM attendance;
 SELECT COUNT(*) AS marks_ct FROM marks; */