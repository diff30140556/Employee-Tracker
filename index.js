// import needed packages
const cTable = require('console.table');
const inquirer = require('inquirer');
const figlet = require('figlet');
const EmployeeQuery = require('./lib/EmployeeQuery');
const employeeQuery = new EmployeeQuery;

// Name validation
function validateName(name) {
    // input can not be blank
    if (name.trim() === '') {
        return 'The name can not be blank';
    }
    // Return true if input is valid
    return true;
}

// Number validation
function validateNum(num) {
    if (isNaN(num)) {
        return 'Please enter a valid number';
    } 
    // Return true if input is valid
    return true;
}

// display main menu function
function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'function',
                message: `What would you like to do?`,
                choices: ["View All Departments", "Add Department", "View All Roles", "Add Role", "View All Employees", "Add Employee", "Update Employee Role","View Total Budget", "Quit"],
            }
        ])
        .then( ans => navigation(ans.function) )
        .catch( err => console.log(err) )
}

// function to determine what methods should be called per user's requirement
// using async and await to prevent the asynchronous issue
async function navigation(ans) {
    console.log('\n');
    switch (ans){
        case "View All Departments":
            try{
                const allDepartments = await employeeQuery.viewAllDepartments();
                console.table(allDepartments);
            } catch (err) {
                console.log(err);
            }
            break;
        case "View All Roles":
            try{
                const allRoles = await employeeQuery.viewAllRoles();
                console.table(allRoles);
            } catch (err) {
                console.log(err);
            }
            break;
        case "View All Employees":
            try{
                const allEmployees = await employeeQuery.viewAllEmployees();
                console.table(allEmployees);
            } catch (err) {
                console.log(err);
            }
            break;
        case "Add Department":
            await addDepartment();
            break;
        case "Add Role":
            await addRole();
            break;
        case "Add Employee":
            await addEmployee();
            break;
        case "Update Employee Role":
            await updateEmployee();
            break;
        case "View Total Budget":
            await viewTotalBudget();
            break;
        case "Quit":
            console.log('Bye!')
            process.exit(0);
    }
    console.log('\n')
    mainMenu();
}

// function of add a department
async function addDepartment() {
    await inquirer
        .prompt([
            {
                type: "input",
                name: "newDepartment",
                message: "What is the name of the department?",
                validate: name => validateName(name),
            }
        ])
        .then( async ans => {
            employeeQuery.addDepartment(ans.newDepartment)
        })
        .catch( err => console.log(err))
}

// function of add a role
async function addRole() {
    const allDepartments = await employeeQuery.viewAllDepartments();
    const allDepartmentsName = allDepartments.map(el => el.name);
    await inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "What is the name of the role?",
                validate: name => validateName(name),
            },
            {
                type: "input",
                name: "salary", 
                message: "What is the salary of the role?",
                validate: num => validateNum(num),
            },
            {
                type: 'list',
                name: 'department',
                message: `Which department does the role belong to?`,
                choices: allDepartmentsName, 
            }
        ])
        .then( ans => {
            employeeQuery.addRole(ans)
        })
        .catch( err => console.log(err))
}

// function of add an employee
async function addEmployee() {
    const allRoles = await employeeQuery.viewAllRoles();
    const allRolesName = allRoles.map( role => role.title );
    const allManagers = await employeeQuery.viewAllManagers();
    const allManagersName = allManagers.map(manager => manager.first_name +' '+ manager.last_name)
    allManagersName.splice(0, 0, "None");
    await inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?",
                validate: name => validateName(name),
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?",
                validate: name => validateName(name),
            },
            {
                type: "list",
                name: "role", 
                message: "What is the employee's role?",
                choices: allRolesName,
            },
            {
                type: 'list',
                name: 'manager',
                message: `Who is the employee's manager?`,
                choices: allManagersName, 
            }
        ])
        .then( ans => {
            employeeQuery.addEmployee(ans)
        })
        .catch( err => console.log(err))
}

// function of update an existing employee
async function updateEmployee() {
    const allRoles = await employeeQuery.viewAllRoles();
    const allRolesName = allRoles.map( role => role.title );
    const allEmployees = await employeeQuery.viewAllEmployees();
    const allEmployeesName = allEmployees.map(employee => ({
            name: employee.first_name +' '+ employee.last_name,
            value: employee.id
    }))
    await inquirer
        .prompt([
            {
                type: "list",
                name: "employee", 
                message: "Which employee's role do you want to update?",
                choices: allEmployeesName,
            },
            {
                type: 'list',
                name: 'role',
                message: `Which role do you want to assign to the selected employee?`,
                choices: allRolesName, 
            }   
        ])
        .then( ans => {
            employeeQuery.updateEmployee(ans)
        })
        .catch( err => console.log(err))
}

// function of view the total budget of a department
async function viewTotalBudget() {
    const allDepartments = await employeeQuery.viewAllDepartments();
    const allDepartmentsName = allDepartments.map(el => el.name);
    await inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: `Which department's budget you want to review?`,
                choices: allDepartmentsName, 
            }
        ])
        .then( async ans => {
            const budget = await employeeQuery.viewTotalBudget(ans)
            console.log('\n');
            console.table(budget);
        })
        .catch( err => console.log(err))
}

// initial function
function init() {
    console.log(`Welcome to the system!!`);
    // ASCII Art
    console.log(figlet.textSync('Employee Manager', {
        font: 'Big',
    }))
    console.log('\n')
    mainMenu();
}

init();