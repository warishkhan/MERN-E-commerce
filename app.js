const dotenv = require("dotenv");
const express = require("express");

//REST OBJECT
const app = express();
const path = require("path");
//DOTENV
dotenv.config({ path: "./.env" });

//middlewares
app.use(express.json());

//database connection
require("./database/conn");


//static files access
app.use(express.static(path.join(__dirname,'./client/build')))

// routes
app.use(require("./router/auth"));
app.get('*',function(req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'));
});


//Port
const port = process.env.PORT || 6010;

app.get("/", (req, res) => {
  res.send("hello I m the best in the world");
});

//listen
app.listen(port, () => {
  console.log(`ser is running on the port ${port}`);
});
