const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const db = require("../db/connection");
class Prompt {
  displayEmployees() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }

      console.table(rows);
    });
  }

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

  displayDepartment() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }

      console.table(rows);
    });
  }

  displayRole() {
    const sql = `SELECT role.title, role.salary, department.name FROM role  INNER JOIN department ON department_id = department.id;`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }

      console.table(rows);
    });
  }

  addADepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of department?",
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
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary?",
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
        }
      });
  }
}

module.exports = Prompt;
