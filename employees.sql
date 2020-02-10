DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
  id INTEGER(4) NOT NULL AUTO_INCREMENT,
  dep_name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);
CREATE TABLE role(
  id INTEGER(4) NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10) NOT NULL,
  department_id INTEGER(4) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE employee(
  id INTEGER(4) NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) NOT NULL,
  last_name VARCHAR(10) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER(4) DEFAULT NULL,
  PRIMARY KEY (id)
);

-- CREATE TABLE managers(
--   id INTEGER(4) NOT NULL AUTO_INCREMENT
-- )


INSERT INTO department (dep_name) 
VALUES ("warehouse"), ("accounting"), ("law"), ('engineering');

INSERT INTO role (title, salary, department_id)
VALUES('engineer', 90000,4), ('stock', 40000, 1),('accountant', 70000, 2), ('lawyer', 100000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager) 
VALUES('luke', 'skywalker', 3, 4), ('rick', 'dolton', 2, ), ('stacy', 'mathews', 1, 4) ('kim', 'smith', 5, 2 );

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee; 

