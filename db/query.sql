SELECT employee. *, e2.first_name AS manager_first_name, e2.last_name AS manager_last_name
FROM employee
JOIN employee AS e2
ON employee.manager_id = e2.id
WHERE employee.manager_id IS NOT NULL;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id
ORDER BY employee.id ASC;

SELECT employee. *, role. *
FROM employee
JOIN role
ON employee.role_id = role.id
WHERE employee.manager_id IS NULL;


SELECT role.id, role.title, role.salary, department.name AS department
FROM role
JOIN department ON role.department_id = department.id
ORDER BY role.id ASC;

SELECT id 
FROM Employee 
WHERE CONCAT(first_name, ' ', last_name) = "Martin Ho";