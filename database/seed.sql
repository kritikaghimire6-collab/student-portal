USE student_portal;
-- Admin & Faculty & Student & Parent dummy accounts (passwords will be set via backend signup or manual hashes)
INSERT INTO users (email, password_hash, role, full_name)
VALUES (
        'admin@example.com',
        '$2a$10$QFZ1n1j1Y5xCw1m5H2v4WeZ7mN0m4Zr6jO0sE3qvF0R2pH3G8x1nW',
        'ADMIN',
        'System Admin'
    ),
    (
        'faculty1@example.com',
        '$2a$10$QFZ1n1j1Y5xCw1m5H2v4WeZ7mN0m4Zr6jO0sE3qvF0R2pH3G8x1nW',
        'FACULTY',
        'Prof. Sharma'
    ),
    (
        'student1@example.com',
        '$2a$10$QFZ1n1j1Y5xCw1m5H2v4WeZ7mN0m4Zr6jO0sE3qvF0R2pH3G8x1nW',
        'STUDENT',
        'Aarav K.'
    ),
    (
        'parent1@example.com',
        '$2a$10$QFZ1n1j1Y5xCw1m5H2v4WeZ7mN0m4Zr6jO0sE3qvF0R2pH3G8x1nW',
        'PARENT',
        'Mr. Karki'
    );
-- The above bcrypt hash corresponds to password: Password@123
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
            WHERE email = 'student1@example.com'
        ),
        'BTCS23001',
        'B.Tech CSE',
        3,
        'parent1@example.com'
    );
INSERT INTO courses (code, title, credit, faculty_id)
VALUES (
        'CS201',
        'Data Structures',
        3,
        (
            SELECT id
            FROM users
            WHERE email = 'faculty1@example.com'
        )
    ),
    (
        'CS202',
        'Database Systems',
        3,
        (
            SELECT id
            FROM users
            WHERE email = 'faculty1@example.com'
        )
    );
INSERT INTO enrollments (student_id, course_id)
VALUES (
        (
            SELECT id
            FROM students
            WHERE roll_no = 'BTCS23001'
        ),
        (
            SELECT id
            FROM courses
            WHERE code = 'CS201'
        )
    ),
    (
        (
            SELECT id
            FROM students
            WHERE roll_no = 'BTCS23001'
        ),
        (
            SELECT id
            FROM courses
            WHERE code = 'CS202'
        )
    );