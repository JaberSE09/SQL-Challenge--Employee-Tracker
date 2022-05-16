INSERT INTO department 
(name)
VALUES 
("Sales"),
("Engineer"),
("Legal");


INSERT INTO role (title , salary , department_id)
VALUES 
("Manager" , 30000 , 1),
("Lead Enginereer" , 30000 , 2),
("Lawyer" , 30000 , 3);

INSERT INTO employee (first_name , last_name , manager_id, role_id)
VALUES
("bob" , "Smith" , 1 , 1),
("bob" , "carlos" , 2, 2),
("carlos" , "Smith" , 3, 2),
("hernandez" , "Smith", 1, 3);


-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;
