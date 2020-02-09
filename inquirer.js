const mysql = require("mysql");
const inquirer = require("inquirer");
const { MySQL } = require('mysql-promisify'); 
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
//OUTPUT DATABASE
//============================================================================

outPut();  
async function outPut(){
  const { results } = await db.query({
    sql:
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dep_name FROM employee LEFT JOIN role ON employee.role_id = role.id JOIN department ON role.id = department.id"
  })
  results.forEach(({  id, first_name, last_name, title, salary, dep_name }) => {
    console.log(`id: ${id} || FirstName: ${first_name} || lastName: ${last_name} || title: ${title} || salary: ${salary} || department: ${dep_name}`);
  })
  userInput(); 
}
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
  console.log(results); 
  outPut(); 
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
}
//ADD EMPLOYEE 
//==========================================================================
async function addEmployee(){
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
      type: 'input',
      message: 'What is the role',
      name: 'role',
    }, {
      type: 'input',
      message: 'Who is the manager',
      name: 'manager',
    }
  ])
  const { results } = await db.query({
    sql:
      `SELECT id FROM role WHERE title = "${role}"` 
    })
    let id = results[0].id
   // console.log(results[0].id);
  const query = await db.query({
    sql: 
     `INSERT INTO employee(first_name, last_name, role_id, manager ) VALUES ('${firstName}', '${lastName}', ${id},  '${manager}')`
  })
  outPut(); 
}
//VIEW FUNCTIONS
//VIEW EMPLOYEE
//===========================================================================
async function viewEmployees(){
  const {results } = await db.query({
    sql: "SELECT employee.id, employee.first_name, employee.last_name FROM employee"

  })
  results.forEach(({  id, first_name, last_name }) => {
    console.log(`id: ${id} || FirstName: ${first_name} || LastName: ${last_name}`)
  })
  userInput(); 
}
//VIEW DEPARTMENT 
//============================================================================
async function viewDep(){
  const {results } = await db.query({
    sql:   "SELECT id, dep_name FROM department"

  })
  results.forEach(({ id, dep_name}) => {
    console.log(`id: ${id} || Department: ${dep_name}`)
  })
  userInput(); 
}
//VIEW ALL ROLES 
//============================================================================

async function viewRoles(){
  const { results } = await db.query({
    sql:
      "SELECT id, title, salary FROM role"
  })  
    console.log('id   ','Role:          ',  'salary        ')
      console.log('____','______________', '____________')
    results.forEach(({  id, title, salary}) => {
      console.log(`${id} | ${title}       | ${salary}    `)
    })
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
}
 //END CONNECTION 
 //============================================================================
function endConnection(){
  db.end(); 
}

// const { results } = await db.query({
//   sql:
  
// })