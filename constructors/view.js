var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  user: "root",
  password: "Theoffice92",
  database: "employees"
})




class Display{
  constructor(name){
    this.name = name; 
  }
  async viewEmployees(){
    try {
      const dataCall = await 
      connection.query("SELECT  FROM role", function(err, res) {
        if (err) throw err;
        console.log(res);
      })
    }catch (err) {
      console.log(err); 
    }
  }

  async viewRole(){
    try {
      const dataCall = await connection.connect(function(err) {
        if (err) throw err;
          console.log("connected as id " + connection.threadId + "\n");
      }) 
      connection.query("SELECT title FROM role", function(err, res) {
        if (err) throw err;
        console.log(res);
      })
    }catch (err) {
      console.log(err); 
    }
  }
}

module.exports = Display; 