INSERT INTO department (name)
VALUES
    ("Human Resources"),
    ("Sales"),
    ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES
-- HR 
    ("Recruiter", 50000, 1),
    ("Analyst", 45500, 1),
    ("HR Manager", 85000, 1),
-- Sales
    ("Associate", 32000, 2),
    ("Representative", 38000, 2),
    ("Sales Manager", 45000, 2),
-- Marketing
    ("Marketing Analyst", 50000, 3),
    ("Specialist", 55000, 3),
    ("Marketing Manager", 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
-- Managers
    ("Cecelia", "Hussain", 3, NULL), -- manager
    ("Sam", "Wicks", 6, NULL), -- manger
    ("Kevin", "Green", 9, NULL), -- manager

-- HR
    ("Cienna", "Wu", 1, 1),
    ("Omar", "McMillan", 2, 1),
    ("Bianca", "Zamora", 2, 1),
    ("Amara", "Goodman", 1, 1),
-- Sales
    ("Keeva", "Churchill", 4, 2),
    ("Willa", "Snow", 4, 2),
    ("Aqib", "Mohammed", 4, 2),
    ("Saqlain", "Villarreal", 5, 2),
    ("Lily", "Herring", 5, 2),
-- Marketing
    ("Paige", "Frey", 7, 3),
    ("Saniya", "Bowers", 7, 3),
    ("Tommie", "Gamble", 8, 3);

