-- View all Departments
SELECT 
    name department_name,
    id department_id 
FROM department
ORDER BY id ASC;

-- View all Roles
SELECT 
    r.title job_title,
    r.id, 
    d.name department, 
    r.salary
FROM role r
JOIN department d ON d.id =  r.department_id
ORDER BY r.id ASC;

-- View all Employees 
SELECT 
    e.id employee_id,
    e.first_name, 
    e.last_name, 
    r.title job_title,
    d.name department, 
    r.salary, 
    CONCAT(m.first_name, " ", m.last_name) manager
    -- m.first_name manager_fn,
    -- m.last_name manager_ln
FROM department d
JOIN role r on d.id = r.department_id
JOIN employee e on r.id = e. role_id
LEFT JOIN employee m on m.id = e.manager_id
ORDER BY e.id ASC;

-- Insert new Department
    -- What is the name of the new department?
INSERT INTO department (name)
VALUES (`${name}`);

-- Add new Role
    -- What is the name of the new role you wish to add?
    -- And what is the base salary?
    -- Which department will the new role fall under? Please enter the appropriate department ID.
INSERT INTO role (title, salary, department_id)
VALUES ("${title}", "${salary}", "${departmentId}");

-- Add new Employee
    -- What is the new employee's first name?
    -- And their last name?
    -- What is their role ID?
    -- And what is their manager's Employee ID?
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES (`"${firstName}", "${lastName}", "${roleId}", "${managerId}"`);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steve", "GOOB", "9", NULL)

-- Update Employee Role
    -- Which employee is changing roles? Please enter their employee ID number. (SELECT FROM LIST)
    -- What is the role ID for the employee's new position? (SELECT FROM LIST)
UPDATE employee
SET role_id = `${roleId}`
WHERE id = `${employeeId}`;

-- Most of the prompts are intended to be selected from a list. 
-- Experiment with Inquirer to define a list object with a query before asking the question.