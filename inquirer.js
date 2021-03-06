const mysql = require("mysql");
const inquirer = require("inquirer");
const { MySQL } = require('mysql-promisify'); 
const ctable = require('console.table'); 
//============================================================================

const questions = [
  'Would you like to add a department','Would you like to add a role','Would you like to add an Employee',
  'Would you like view departments','Would you like to view roles','Would you like view employees',
  'Would you like to update an employees role', 'End Program'
]
//============================================================================

var db = new MySQL({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  user: "root",
  password: "Theoffice92",
  database: "employees"
})

//============================================================================
//INITIATE THE PROMPT FOR USER INPUT 
//============================================================================

const userInput = async function(){
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do with your database',
      name: 'action',
      choices: questions 
    }
  ])
  switch(action){
    case questions[0]:  
      adddepartment(); 
    break;
    case questions[1]: 
      addRole(); 
    break;
    case questions[2]: 
      addEmployee(); 
    break;
    case questions[3]: 
      viewDep(); 
    break;
    case questions[4]: 
      viewRoles(); 
    break; 
    case questions[5]: 
      viewEmployees(); 
    break;
    case questions[6]: 
      updateEmpRole(); 
    break; 
    case questions[7]: 
      endConnection(); 
    break; 
  }
}

//ADD DEPARTMENT
//============================================================================
async function adddepartment(){
  const { department } = await inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the department you would like to add?',
      name: 'department',
    }
  ])
  const { results } = await db.query({
    sql:
      `INSERT INTO department(dep_name) VALUES ('${department}')` 
  })
 // console.log(results); 
  userInput(); 
} 
//ADD ROLE
//==========================================================================
async function addRole(){
  const { role, salary, depID } = await inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the role you would like to add',
      name: 'role',
    }, {
      type: 'input',
      message: 'What is the salary for this role',
      name: 'salary',
    }, {
      type: 'input',
      message: 'What is the department ID for the role',
      name: 'depID',
    }, 
  ])
  const { results } = await db.query({
    sql:
    `INSERT INTO role(title, salary, department_id) VALUES ('${role}', '${salary}', '${depID}')`
  })
  userInput(); 
}
//ADD EMPLOYEE 
//==========================================================================
async function addEmployee(){
  //GRAB THE LIST OF ROLES FROM DATABASE
  const queryRoles  = await db.query({
    sql:  "SELECT title FROM role"
  })
  const queryManagers = await db.query({
    sql: "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL"
  })
  let managers = [];

  queryManagers.results.forEach(({ first_name, last_name }) => {
    managers.push(first_name + " " + last_name); 
  })
  //console.log(managers); 
  //console.log(queryRoles.results); 
  let roles = []; 
  queryRoles.results.forEach(name=> {
    roles.push(name.title)
  })
  //PROMPT USER FOR INPUT 
  const { firstName, lastName, role, manager } = await inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the employee you would like to add',
      name: 'firstName',
    }, {
      type: 'input',
      message: 'What is the last name',
      name: 'lastName',
    }, {
      type: 'list',
      message: 'What is the role',
      choices: roles,
      name: 'role',
    }, {
      type: 'list',
      message: 'Who is the manager',
      name: 'manager',
      choices: managers
    }
  ])
  managerName = manager.split(' '); 
  //FIND THE MANAGER ID FOR THE FIRST,LAST NAME OF MANAGER CHOSEN 
  const queryID = await db.query({
    sql:
      `SELECT id FROM employee WHERE first_name ="${managerName[0]}" AND last_name="${managerName[1]}"` 
    })
  let managerid = queryID.results[0].id
  //FIND THE ROLEID FOR THE NEW ROLE 
  const { results } = await db.query({
    sql:
      `SELECT id FROM role WHERE title = "${role}"` 
    })
    let id = results[0].id
   //INSERT INTO DATABASE THE NEW EMPLOYEE INFORMATION
  const query = await db.query({
    sql: 
     `INSERT INTO employee(first_name, last_name, role_id, manager_id ) VALUES ('${firstName}', '${lastName}', ${id},  '${managerid}')`
  })
  userInput(); 
}
//VIEW FUNCTIONS
//VIEW EMPLOYEE
//===========================================================================
async function viewEmployees(){
  const { results } = await db.query({
    sql:
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dep_name FROM employee LEFT JOIN role ON employee.role_id = role.id JOIN department ON role.id = department.id"
  })
  console.table(results); 
  userInput(); 
}
//VIEW DEPARTMENT 
//============================================================================
async function viewDep(){
  const {results } = await db.query({
    sql:   "SELECT id, dep_name FROM department"

  })
  console.table(results); 
  userInput(); 
}
//VIEW ALL ROLES 
//============================================================================

async function viewRoles(){
  const { results } = await db.query({
    sql:
      "SELECT id, title, salary FROM role"
  })  

  console.table(results); 
  userInput(); 
}
//UPDATE EMPLOYEES 
//============================================================================
async function updateEmpRole(){
  //Gather a LIST OF ROLES
  const result = await db.query({
    sql: "SELECT role.title FROM role;",
  }); 
  const rolesArray = result.results
  const roles= []; 
  rolesArray.forEach(({  title }) => {
    roles.push(`${title}`)
  })
  //GATHER A LIST OF EMPLOYEES
  const { results } = await db.query({
    sql: "SELECT employee.first_name, employee.last_name FROM employee",
  }); 
  const employees = []; 
  results.forEach(({  id, first_name, last_name }) => {
    employees.push(`${first_name} ${last_name}`)
  })
  //PROMPT THE USER FOR THE EMPLOYEE THEY WOULD LIKE TO UPDATE
  //PROMPT USER FOR WHICH NEW ROLE THEY WOULD LIKE TO ASSIGN 
  const { employeeName, role } = await inquirer.prompt([
      {
        type: 'list',
        message: 'Select an employee to update',
        choices: employees, 
        name: 'employeeName',
      }, 
      {
        type: 'list',
        message: 'Select a role you like to give the employee ',
        choices: roles, 
        name: 'role',
      }, 
    ])
    //SPLIT THE NAME OF THE EMPLOYEE INTO AN ARRAY 
    const employeeNameArray = employeeName.split(' ');
    //FIND THE ROLE ID FOR THE UPDATED ROLE 
    const roleIDObject = await db.query({
      sql: `SELECT role.id FROM role WHERE title="${role}"`
    }); 
    const roleID = roleIDObject.results[0].id 
    //INSERT THE UPDATED ROLEID INTO WHERE IT MATCHES THE EMPLOYEEID
    const update = await db.query({
      sql: `UPDATE employee SET role_id= '${roleID}' WHERE first_name ='${employeeNameArray[0]}' AND last_name ='${employeeNameArray[1]}';`
    });
  userInput(); 
}
 //END CONNECTION 
 //============================================================================
function endConnection(){
  db.end(); 
}

//START THE PROMPT
userInput(); 