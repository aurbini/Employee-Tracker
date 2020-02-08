const mysql = require("mysql");
const inquirer = require("inquirer");


const questions = [
  'Would you like to add a department','Would you like to add a role','Would you like to add an Employee',
  'Would you like view departments','Would you like to view roles','Would you like view employees',
  'Would you like to update an employees role'
]

var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  user: "root",
  password: "Theoffice92",
  database: "employees"
})
connection.connect(function(err) {
  if (err) throw err;
  console.log('hell')
  userInput(); 
})

const userInput = async function(){
  const query = `SELECT id, first_name, last_name, manager FROM employee WHERE title = "${role}"` 
  connection.query(query, (err,res) => {
    

  }
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
    case questions[5]: 
      updateEmpRole(); 
    break; 
  }
}


async function adddepartment(){
  const { department } = await inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the department you would like to add?',
      name: 'department',
    }
  ])
  // console.log('department', department)
  const query = `INSERT INTO department(name) VALUES ('${department}')`
  connection.query( query, (err,res) => {
    console.log('department', department)
    console.log('response', res); 
  })
} 

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
  const query = `INSERT INTO role(title, salary, department_id) VALUES ('${role}', '${salary}', '${depID}')`
  connection.query(query, (err,res) => {
    console.log(err); 
  })
}



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
  const query = `SELECT id FROM role WHERE title = "${role}"` 
  connection.query(query, (err,res) => {
    let id; 
    //console.log(roleID)
    res.forEach(obj => id = obj.id)
    console.log(id);
    console.log(firstName, lastName, id, manager); 
    const query = `INSERT INTO employee(first_name, last_name, role_id, manager ) VALUES ('${firstName}', '${lastName}', ${id},  '${manager}')`
    connection.query(query, (err,res) => {
      console.log('insert employee', res)

    })
  })
}


function viewDep(){

}

function viewRoles(){

}

function viewEmployees(){

}

function updateEmpRole(){

}







// ]).then(function({ action }){
//   if(action === 'Would you like to add a department'){
//     inquirer
//       .prompt([
//       {
//       type: 'input',
//       message: 'What is the name of the department?',
//       name: 'department', 
//       }
//     ]).then({ department }){
//       const AddDepartments = new Add(department); 
//       console.log(AddDepartments); 
//       AddDepartments.updateDepartment(department); 
//     })
//   }else if(action === 'Would you like to view roles'){
//     const Roles = new Display();
//     Roles.viewRole()
//   }else if(action === 'Would you like to update an employees role'){
    
//   }
// })

  // switch(response.action){
  //   case "Post": 
  //     postItem(); 
  //   break;
  //   case "Bid": 
  //     bidItem(); 
  //   break;