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
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }

      console.table(rows);
    });
  }


  addADepartment(){
    inquirer.prompt([
     { type: "input",
      name: "name",
      message: "What is the name of department?"
    }
    ]).then(response => {
      const department = db.query(`INSERT INTO department (name) VALUES (?)` , response.name , (err , data) =>{
        if(err) throw err;
        console.log(`${response.name} Department Created`);
        this.startPrompt();
      })
    })
  }


  startPrompt() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "choice",
          message: "What would you like to do?",
          choices: [
            "View All Employees?",
            "View All Employee's By Roles?",
            "View all employee's By Departments",
            "Add A Department",
          ],
        },
      ])
      .then((response) => {
        switch (response.choice) {
          case "View All Employees?":
            this.displayEmployees();
            this.startPrompt();
            break;
          case "View All Employee's By Roles?":
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
        }
      });
  }
}

module.exports = Prompt;
