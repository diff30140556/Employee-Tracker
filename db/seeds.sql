INSERT INTO
    department (name)
VALUES
    ("Design"),
    ("Engineering"),
    ("Legal"),
    ("Marketing");

INSERT INTO
    role (title, salary, department_id)
VALUES
    ("Lead Designer", 100000, 1),
    ("Designer", 75000, 1),
    ("Lead Engineer", 160000, 2),
    ("Full Stack Engineer", 100000, 2),
    ("Legal Team Lead", 170000, 3),
    ("Lawyer", 120000, 3),
    ("Marketing Manager", 100000, 4),
    ("Marketing", 70000, 4);

INSERT INTO
    employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, "Ben", "Hu", 3, NULL),
    (2, "Shun", "Wei", 4, 1),
    (3, "James", "Wong", 1, NULL),
    (4, "Helen", "Li", 2, 3),
    (5, "Martin", "Ho", 5, NULL),
    (6, "Ashi", "Kim", 6, 5),
    (7, "Peter", "Lau", 7, NULL),
    (8, "Mary", "Ann", 8, 7);