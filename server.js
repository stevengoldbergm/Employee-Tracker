// Requirements
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password', // Other users will likely need to change this value
        database: 'departments_db'
    },
    console.log('Connected to the departments_db database.')
)

// Create the main menu
async function mainMenu() {
    // Create an inquirer promise prompt
    const menu = await inquirer.prompt(
        {
            type: 'list',
            name: 'selection',
            message: '\nWhat would you like to do?',
            choices: [
                'View All Departments', 
                'Add New Department', 
                'View All Roles', 
                'Add New Role', 
                'View All Employees', 
                'Add Employee', 
                'Update Employee Role', 
                'Quit'
            ]
        }
    )
    
        // console.info(menu); Working
        // console.info(menu.selection); Working

    // Use inquirer prompt results to determine next steps:
    switch(menu.selection) {
        case 'View All Departments':
            // Call query to view all departments
            const allDepts = await viewAllDepartments();
                // console.log(allDepts[0]) // Working
                // console.log('\nAll Departments', allDepts) // Working
            console.table('\nAll Departments', allDepts)
            break;

        case 'Add New Department':
            // Add a new question regarding the new department name
            const departmentQuestion = await inquirer.prompt(
                {
                    type: 'input',
                    name: 'name',
                    message: '\nWhat is the name of the new department?'
                }
            )
            // Call query to add a new department
            const newDepartment = await addDepartment(departmentQuestion.name)
            console.log("New Department Added!");
            break;            

        case 'View All Roles':
            // Call query to view all roles
            const allRoles = await viewAllRoles();
                // console.log(allRoles[0]) // Working
            console.table('\nAll Roles', allRoles)
            break;  

        case 'Add New Role':
            // Add a new question line regarding the new role
            const roleQuestions = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: '\nWhat is the name of the new role?'
                    
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: "\nWhat is the new role's base salary?"
                },
                {
                    type: 'list',
                    name: 'department',
                    message: "\nWhich department does the new role fall under?",
                    choices: await roleDepartmentList()
                }],
            )
            // Generate the department ID using the roleQuestions.department value
                // console.log(roleQuestions.department) // Working
            const roleId = await findRoleByDepartment(roleQuestions.department)

            // Call query to add role
            const newRole = await addRole(roleQuestions.name, roleQuestions.salary, roleId)
            console.log("New Role Added!"); // Working
            break;

        case 'View All Employees':
            // Call query to view all employees
            const allEmployees = await viewAllEmployees();
                // console.log(allRoles[0]) // Working
            console.table('\nAll Employees', allEmployees);
            break;

        case 'Add Employee':
            // Add a new question line regarding the new employee
            const employeeQuestions = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: '\nWhat is the first name of the new Employee?'
                    
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: '\nAnd the last name?'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "\nWhat is their role?",
                    choices: await employeeRoleList()
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "\nAnd which manager are they under?",
                    choices: await employeeManagerList()
                }],
            )
            // Testing question results to ensure they're working
                // console.log(employeeQuestions); // Working

            // Call queries to find role and manager IDs
            const foundRoleId = await findRoleId(employeeQuestions.role);
                // console.log(foundRoleId); // Working

            const foundManagerId = await findManagerId(employeeQuestions.manager);
                // console.log(foundManagerId); // Working

            // Call query to add employee
            const newEmployee = await addEmployee(employeeQuestions.firstName, employeeQuestions.lastName, foundRoleId, foundManagerId)
            console.log("New Employee Added!");
            break;            

        case 'Update Employee Role':
            const updateRoleQuestion = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: '\nWhich employee is changing roles?',
                    choices: await employeeList()
                },
                {
                    type: 'list',
                    name: 'role',
                    message: '\nWhich role are they moving into?',
                    choices: await employeeRoleList()
                },
            ])
            // Use question results to find employee and role names 
                // console.log(updateRoleQuestion.employee, updateRoleQuestion.role); // working

            // Call queries to find employee and role IDs
            const foundEmployeeId = await findEmployeeId(updateRoleQuestion.employee)
                // console.log(foundEmployeeId) // working
            const foundEmployeeRoleId = await findRoleId(updateRoleQuestion.role)
                // console.log(foundEmployeeRoleId) // working

            const updatedRole = await updateRole(foundEmployeeId, foundEmployeeRoleId)
            console.log("Role Updated!"); // Working
            break;  

        case 'Quit':
            quit();
        }

    init();

}

// Quit the program
function quit() {
    console.log('\nGoodbye!')
    process.exit();
}

// Initialize the program
function init() {
    mainMenu();
}

// ---------- Query functions ---------- //

// View All Departments
async function viewAllDepartments() {
    // console.log('function start:') // Works
    result = await db.promise().query(`
        SELECT 
            name department, 
            id 
        FROM department 
        ORDER BY id ASC;
    `)
    return result[0];
}

// View All Roles
async function viewAllRoles() {
    result = await db.promise().query(`
        SELECT 
            r.title job_title, 
            r.id, d.name department, 
            r.salary 
        FROM role r 
        JOIN department d ON d.id =  r.department_id 
        ORDER BY r.id ASC;
    `)
    return result[0];
}

// View All Employees
async function  viewAllEmployees() {
    result = await db.promise().query(`
        SELECT 
            e.id employee_id, 
            e.first_name, e.last_name, 
            r.title job_title, 
            d.name department, 
            r.salary, 
            CONCAT(m.first_name, " ", m.last_name) manager 
        FROM department d 
        JOIN role r on d.id = r.department_id 
        JOIN employee e on r.id = e. role_id 
        LEFT JOIN employee m on m.id = e.manager_id ORDER BY e.id ASC;
    `)
    return result[0];
}

// Add New Department
async function addDepartment(newDepartment) {
    result = await db.promise().query(`
        INSERT INTO department (name)
        VALUES ("${newDepartment}");
    `)
    return result;
}

// Generate Department List For Role Change Questions
async function roleDepartmentList() {
    let departmentList = await db.promise().query(`
        SELECT 
            name department 
        FROM department 
        ORDER BY id ASC;    
    `);
    departmentList = departmentList.shift();
    // console.log(departmentList); // Working
    departmentMap = departmentList.map(listItem => listItem.department)
    // console.log(departmentMap); // Working
    return departmentMap;
}

// Add New Role
async function addRole(title, salary, departmentId) {
    result = await db.promise().query(`
        INSERT INTO role (title, salary, department_id)
        VALUES ("${title}", "${salary}", "${departmentId}");
    `)
    return result;
}

// Find Department ID Using Role Department Value
async function findRoleByDepartment(departmentName) {
    // console.log('department name: ', departmentName)
    const departmentIdTable = await db.promise().query(`
    SELECT 
        id
    FROM department
    WHERE name = "${departmentName}";    
    `);
    departmentId = departmentIdTable.shift();
    // console.log(departmentId); // Working
    idMap = departmentId.map(object => object.id);
    finalId = Number(idMap.toString());
    // console.log(finalId); // Working
    return finalId;
}

// Generate Employee List For Role Update Questions
async function employeeList() {
    let fullEmployeeList = await db.promise().query(`
        SELECT 
            CONCAT(first_name, " ", last_name) employee_list
        FROM employee
        ORDER BY id ASC;    
    `);
    fullEmployeeList = fullEmployeeList.shift();
    // console.log(fullEmployeeList); // Working
    employeeMap = fullEmployeeList.map(listItem => listItem.employee_list)
    // console.log(employeeMap); // Working
    return employeeMap;
}

// Generate Role List For Role Change Questions
async function employeeRoleList() {
    let roleList = await db.promise().query(`
        SELECT 
            title role 
        FROM role 
        ORDER BY id ASC;    
    `);
    roleList = roleList.shift();
    // console.log(roleList); // Working
    roleMap = roleList.map(listItem => listItem.role)
    // console.log(roleMap); // Working
    return roleMap;
}

// Generate Manager List For New Employee Question
async function employeeManagerList() {
    let managerList = await db.promise().query(`
        SELECT 
            CONCAT(first_name, " ", last_name) manager_list
        FROM employee
        WHERE manager_id IS NULL
        ORDER BY id ASC;    
    `);
    managerList = managerList.shift();
    // console.log(managerList); // Working
    managerMap = managerList.map(listItem => listItem.manager_list)
    managerMap.push('None')
    // console.log(managerMap); // Working
    return managerMap;
}

// Find Role ID From Role Title
async function findRoleId(roleName) {
    // console.log('role name: ', roleName) // working
    const roleIdTable = await db.promise().query(`
        SELECT 
            id
        FROM role
        WHERE title = "${roleName}";    
    `);
    roleId = roleIdTable.shift();
        // console.log(roleId); // Working
    idMap = roleId.map(object => object.id);
    finalId = Number(idMap.toString());
        // console.log(finalId); // Working
    return finalId;
}

// Find Employee ID From (concatenated) Employee Name
async function findEmployeeId(EmployeeName) {
        // console.log('Employee name: ', EmployeeName); // Working
    // Split the EmployeeName into an array with two values
    EmployeeName = EmployeeName.split(" ");
    eFirstName = EmployeeName[0];
    eLastName = EmployeeName[1];
        // console.log(eFirstName, eLastName); // Working
    const EmployeeIdTable = await db.promise().query(`
        SELECT 
            id
        FROM employee
        WHERE first_name = "${eFirstName}"
        AND last_name = "${eLastName}";    
    `);
    EmployeeId = EmployeeIdTable.shift();
        // console.log(EmployeeId); // Working
    idMap = EmployeeId.map(object => object.id);
    finalId = Number(idMap.toString());
        // console.log(finalId); // Working
    return finalId;
}

// Find Manager ID From (concatenated) Manager Name
async function findManagerId(managerName) {
        // console.log('manager name: ', managerName); // Working
    // Split the managerName into an array with two values
    managerName = managerName.split(" ");
    mFirstName = managerName[0];
    mLastName = managerName[1];
        // console.log(mFirstName, mLastName); // Working
    const managerIdTable = await db.promise().query(`
        SELECT 
            id
        FROM employee
        WHERE first_name = "${mFirstName}"
        AND last_name = "${mLastName}";    
    `);
    managerId = managerIdTable.shift();
        // console.log(managerId); // Working
    idMap = managerId.map(object => object.id);
    finalId = Number(idMap.toString());
        // console.log(finalId); // Working
    return finalId;
}

// Find Department ID From Role Department Name
async function findRoleByDepartment(departmentName) {
    // console.log('department name: ', departmentName)
    const departmentIdTable = await db.promise().query(`
        SELECT 
            id
        FROM department
        WHERE name = "${departmentName}";    
    `);
    departmentId = departmentIdTable.shift();
        // console.log(departmentId); // Working
    idMap = departmentId.map(object => object.id);
    finalId = Number(idMap.toString());
        // console.log(finalId); // Working
    return finalId;
}

// Add New Employee to Employee Table
async function addEmployee(firstName, lastName, roleId, managerId) {
        // console.log("managerid:", managerId); 
    if (managerId !== 0) {
        managerId = `"${managerId}"`
    } else {
        managerId = 'NULL'
    }
    result = await db.promise().query(`
        INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${firstName}", "${lastName}", "${roleId}", ${managerId});
    `)
    return result;
}

// Update Employee Role
async function updateRole(employeeId, roleId) {
    result = await db.promise().query(`
        UPDATE employee
        SET role_id = ${roleId}
        WHERE id = ${employeeId};
    `)
    return result;
}

// Start Program
console.info('\n\n***---- Employee Tracker ----***\n')
init();

