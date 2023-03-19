const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`\nConnected to the employee_db database\n`)
)

class EmployeeQuery {

    viewAllDepartments() {
        const sql = `SELECT * FROM department ORDER BY name ASC`;
        return db.promise().query(sql)
            .then( ([rows]) => rows )
            .catch( err => console.log(err) );
    }

    viewAllRoles() {
        const sql = `
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        JOIN department ON role.department_id = department.id
        ORDER BY role.id ASC`;
        return db.promise().query(sql)
            .then( ([rows]) => rows )
            .catch( err => console.log(err) );
    }

    viewAllEmployees() {
        const sql = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
        ORDER BY employee.id ASC`;
        return db.promise().query(sql)
            .then( ([rows]) => rows )
            .catch( err => console.log(err) );
    }

    viewAllManagers() {
        const sql = `SELECT employee. *, role. *
        FROM employee
        JOIN role
        ON employee.role_id = role.id
        WHERE employee.manager_id IS NULL;`;
        return db.promise().query(sql)
            .then( ([rows]) => rows )
            .catch( err => console.log(err) );
    }

    addDepartment(aptName) {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        db.promise().query(sql, aptName)
        .then( ([rows]) => rows)
        .catch( err => console.log(err) )
    }

    addRole(newRole) {
        let id;
        const getIdSql = `SELECT id FROM department WHERE name = ?`;
        const insertSql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

        return db.promise().query(getIdSql, newRole.department)
        .then( ([rows]) => {
            id = rows[0].id
            return db.promise().query(insertSql, [newRole.title, newRole.salary, id])
                .then( ([rows]) => rows)
                .catch( err => console.log(err) );
        })
        .catch( err => console.log(err) );
    }

    addEmployee(newEmployee) {
        let roleId;
        let managerId;
        const getRoleIdSql = `SELECT id FROM role WHERE title = ?`;
        const getManagerIdSql = `SELECT id FROM Employee WHERE CONCAT(first_name, ' ', last_name) = ?`;
        const insertSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

        return db.promise().query(getRoleIdSql, newEmployee.role)
            .then( ([rows]) => {
                roleId = rows[0].id;
                return db.promise().query(getManagerIdSql, newEmployee.manager)
                .then( ([rows]) => {
                    managerId = rows.length === 0 ? null : rows[0].id;
                    return db.promise().query(insertSql, [newEmployee.first_name, newEmployee.last_name, roleId, managerId])
                        .then( ([rows]) => rows )
                        .catch( err => console.log(err) );
                    })
                .catch( err => console.log(err) );
            })
            .catch( err => console.log(err) );
    }

    updateEmployee(employee) {
        console.log(employee)
        let roleId;
        const employeeId = employee.employee;
        const getRoleIdSql = `SELECT id FROM role WHERE title = ?`;
        const updateSql = `
        UPDATE employee
        SET role_id = ?
        WHERE id = ?`;
        return db.promise().query(getRoleIdSql, employee.role)
            .then( ([rows]) => {
                roleId = rows[0].id;
                return db.promise().query(updateSql, [roleId, employeeId])
                    .then( ([rows]) => rows)
                    .catch( err => console.log(err) )
            })
            .catch( err => console.log(err) )
    }
}


module.exports = EmployeeQuery;