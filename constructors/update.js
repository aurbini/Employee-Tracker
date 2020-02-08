var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  user: "root",
  password: "Theoffice92",
  database: "employees"
})



class Update{
  constructor(name){
    this.name = name; 
  }
  async updateRole(){
    try {
      
      connection.query("UPDATE role SET ",
      [
        {
          title: 
        }
      ]
      })
    }catch (err) {
      console.log(err); 
    }
  }
}

module.exports = Display; 