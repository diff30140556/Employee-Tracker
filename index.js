const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const fs = require('fs');
const EmployeeQuery = require('./lib/EmployeeQuery');
const employeeQuery = new EmployeeQuery;
require('dotenv').config();

// const db = mysql.createConnection(
//     {
//         host: 'localhost',
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME
//     },
//     console.log(`\nConnected to the employee_db database\n`)
// )



function mainMenu() {
    console.log(`Welcome to the system`);
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'function',
                message: `What would you like to do?`,
                choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Quit"],
            }
        ])
        .then( ans => navigation(ans.function) )
        .catch( err => console.log(err) )
}

async function navigation(ans) {
    console.log('\n');
    switch (ans){
        case "View All Departments":
            try{
                const allDepartments = await employeeQuery.viewAllDepartments();
                console.table(allDepartments);
                console.log('\n');
                mainMenu()
            } catch (err) {
                console.log(err);
            }
            break;
        case "View All Roles":
            try{
                const allRoles = await employeeQuery.viewAllRoles();
                console.table(allRoles);
                console.log('\n');
                mainMenu()
            } catch (err) {
                console.log(err);
            }
            break;
        case "View All Employees":
            try{
                const allEmployees = await employeeQuery.viewAllEmployees();
                console.table(allEmployees);
                console.log('\n');
                mainMenu()
            } catch (err) {
                console.log(err);
            }
            break;
        case "Add Department":
            addDepartment();
            break;
        case "Add Role":
            addRole();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Update Employee Role":
            updateEmployee();
            break;
        case "Quit":
            console.log('Bye!')
            process.exit(0);
    }
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "newDepartment",
                message: "What is the name of the department?",
            }
        ])
        .then( async ans => {
            await employeeQuery.addDepartment(ans.newDepartment)
            console.log('\n');
            console.log('done');
            mainMenu();
        })
        .catch( err => console.log(err))
}

async function addRole() {
    const allDepartments = await employeeQuery.viewAllDepartments();
    const allDepartmentsName = allDepartments.map(el => el.name);
    inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "What is the name of the role?",
            },
            {
                type: "number",
                name: "salary", 
                message: "What is the salary of the role?",
            },
            {
                type: 'list',
                name: 'department',
                message: `Which department does the role belong to?`,
                choices: allDepartmentsName, 
            }
        ])
        .then( async ans => {
            await employeeQuery.addRole(ans)
            console.log('\n');
            mainMenu();
        })
        .catch( err => console.log(err))
}

async function addEmployee() {
    const allRoles = await employeeQuery.viewAllRoles();
    const allRolesName = allRoles.map( role => role.title );
    const allManagers = await employeeQuery.viewAllManagers();
    const allManagersName = allManagers.map(manager => manager.first_name +' '+ manager.last_name)
    allManagersName.splice(0, 0, "None");
    inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?",
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
        .then( async ans => {
            await employeeQuery.addEmployee(ans)
            console.log('\n');
            mainMenu();
        })
        .catch( err => console.log(err))
}

async function updateEmployee() {
    const allRoles = await employeeQuery.viewAllRoles();
    const allRolesName = allRoles.map( role => role.title );
    const allEmployees = await employeeQuery.viewAllEmployees();
    const allEmployeesName = allEmployees.map(employee => ({
            name: employee.first_name +' '+ employee.last_name,
            value: employee.id
    }))
    inquirer
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
        .then( async ans => {
            await employeeQuery.updateEmployee(ans)
            console.log('\n');
            mainMenu();
        })
        .catch( err => console.log(err))
}

// db.query(`SELECT * FROM employee`, (err, res) => {
//     console.table(res);
// })

mainMenu();