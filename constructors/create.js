var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  user: "root",
  password: "Theoffice92",
  database: "employees"
})
//Needs to

connection.connect(function(err) 
  if (err) throw err;
  console.log('hell')
  promptUser(); 
})
class Add{
  constructor(name){
    this.name = name; 
  }
  async updateDepartment(department){
    try {
      const dataCall = await connection.connect(function(err) {
        if (err) throw err;
          console.log("connected as id " + connection.threadId + "\n");
        }) 
        connection.query("INSERT INTO department SET ?", 
          {
            name: department 
          }
        )
    }catch (err) {
      console.log(err); 
    }
  }
}




module.exports = Add;




