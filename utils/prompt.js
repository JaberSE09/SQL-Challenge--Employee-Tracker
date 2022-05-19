//global 
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const db = require("../db/connection");

//prompts to run the application
class Prompt {
  //display the employees
  displayEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee2.first_name AS Manager FROM employee, role, department, employee AS employee2  WHERE department.id=role.department_id AND role.id = employee.role_id AND employee.manager_id= employee2.id`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }

      console.table(rows);
    });
  }

  //gets the departments
  getDepartments() {
    let departmentArray = [];
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }

      rows.forEach((row) => departmentArray.push(row.name));
    });
    return departmentArray;
  }
//displays the departments
  displayDepartment() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }

      console.table(rows);
    });
  }
//display the roles
  displayRole() {
    const sql = `SELECT role.title, role.salary, department.name FROM role  INNER JOIN department ON department_id = department.id;`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }

      console.table(rows);
    });
  }

  //gets the roles
  getRole() {
    let roleArray = [];
    const sql = `SELECT title FROM role`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => roleArray.push(row.title));
    });
    return roleArray;
  }
  //add a department
  addADepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of department?",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log("Please enter department name!");
              return false;
            }
          },
        },
      ])
      .then((response) => {
        db.query(
          `INSERT INTO department (name) VALUES (?)`,
          response.name,
          (err, data) => {
            if (err) throw err;
            console.log(`${response.name} Department Created`);
            this.startPrompt();
          }
        );
      });
  }

  //adds a role
  addARole() {
    let departmentsArray = [];
    const sqlSelect = `SELECT * FROM department`;
    db.query(sqlSelect, (err, rows) => {
      if (err) {
        throw err;
      }

      rows.forEach((row) => departmentsArray.push(row.name));
    });

    inquirer
      .prompt([
        {
          type: "input",
          name: "role",
          message: "What is the Role?",
          validate: (roleInput) => {
            if (roleInput) {
              return true;
            } else {
              console.log("Please enter your role!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary?",
          validate: (numInput) => {
            if  (numInput) {
              return true;
            } else {
              console.log("Please enter salary!");
              return false;
            }
          },
        },
        {
          type: "list",
          name: "department",
          message: "What is the department?",
          choices: this.getDepartments(),
        },
      ])
      .then((response) => {
        const sql = `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`;

        let indexDepartment;
        for (let i = 0; i < departmentsArray.length; i++) {
          if (departmentsArray[i] == response.department) {
            indexDepartment = i + 1;
            break;
          }
        }

        const params = [response.role, response.salary, indexDepartment];

        db.query(sql, params, (err, data) => {
          if (err) throw err;

          console.log(`${response.role} Created`);
          this.startPrompt();
        });
      });
  }

  //gets the employees
  getEmployees() {
    let managerArray = [];
    const sql = `SELECT first_name FROM employee`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => managerArray.push(row.first_name));
    });
    return managerArray;
  }

  //adds a new employee
  addAEmployee() {
    const roles = this.getRole();
    const managers = this.getEmployees();
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee first name?",
          validate: nameInput => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter your first name!');
              return false;
            }
          }
        },

        {
          type: "input",
          name: "last_name",
          message: "What is the employee last name?",
          validate: nameInput => {
            if (nameInput) {
              return true;
            } else {
              console.log('Please enter your name!');
              return false;
            }
          }
        },
        {
          type: "list",
          name: "role",
          message: "What is the employee role?",
          choices: this.getRole(),
        },
        {
          type: "list",
          name: "manager",
          message: "What is the employee role?",
          choices: this.getEmployees(),
        },
      ])
      .then((response) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`;

        let indexRole;
        for (let i = 0; i < roles.length; i++) {
          if (roles[i] == response.role) {
            indexRole = i + 1;
            break;
          }
        }

        let indexManager;
        for (let i = 0; i < managers.length; i++) {
          if (managers[i] == response.manager) {
            indexManager = i + 1;
            break;
          }
        }

        const params = [
          response.first_name,
          response.last_name,
          indexRole,
          indexManager,
        ];

        db.query(sql, params, (err, rows) => {
          if (err) {
            throw err;
          }

          console.log(`${response.first_name} Created`);
          this.startPrompt();
        });
      });
  }
  Employees = this.getEmployees();
  Roles = this.getRole();
  //updates a employees
  updateEmployee() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "What is the employee?",
          choices: this.Employees,
        },
        {
          type: "list",
          name: "role",
          message: "What is the employee role?",
          choices: this.Roles,
        },
      ])
      .then((response) => {
        let indexRole;
        for (let i = 0; i < this.Roles.length; i++) {
          if (this.Roles[i] == response.role) {
            indexRole = i + 1;
            break;
          }
        }

        const sql = `UPDATE employee SET role_id = ? WHERE first_name = ?`;
        const params = [indexRole, response.employee];

        db.query(sql, params, (err, rows) => {
          if (err) throw err;

          console.log(`${response.employee} role updated`);
          this.startPrompt();
        });
      });
  }

 
//Starts the prompt
  startPrompt() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "choice",
          message: "What would you like to do?",
          choices: [
            "View All Employees",
            "View All Employee's By Roles",
            "View all employee's By Departments",
            "Add A Department",
            "Add A Role",
            "Add A Employee",
            "Update A Employee",
            "Exit",
          ],
        },
      ])
      .then((response) => {
        switch (response.choice) {
          case "View All Employees":
            this.displayEmployees();
            this.startPrompt();
            break;
          case "View All Employee's By Roles":
            this.displayRole();
            this.startPrompt();
            break;
          case "View all employee's By Departments":
            this.displayDepartment();
            this.startPrompt();
            break;
          case "Add A Department":
            this.addADepartment();
            break;
          case "Add A Role":
            this.addARole();
            break;
          case "Add A Employee":
            this.addAEmployee();
            break;
          case "Update A Employee":
            //this.updateAEmployee();
            this.updateEmployee();
            break;
          case "Exit":
            db.end();
            console.log("Exited Thank You");

            break;
        }
      });
  }
}

module.exports = Prompt;
