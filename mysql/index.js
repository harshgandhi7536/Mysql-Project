const { faker } = require('@faker-js/faker');

/// requiring mysql2 package as installed
const mysql=require('mysql2');
const express=require("express");
const app=express();
const path=require("path");
/// for using method override in patch
const methodOverride= require('method-override');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
    // let  getRandomUser = ()=> {
    // return {
    //     id: faker.string.uuid(),
    //     username: faker.internet.username(), // before version 9.1.0, use userName()
    //     email: faker.internet.email(),
    //     password: faker.internet.password(),
    //     };
    // }

/// /// console.log(getRandomUser());



//// mysql setting up---- BASICS

// const connection= mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     database:'delta_app',
//     password:'girishpg'
// });


// try{
//     connection.query("SHOW TABLES", (err, result)=>{
//     if (err) throw err;
//     console.log(result);
//     console.log(result.length)

// } )
//         connection.query("CREATE TABLE user (ID INT PRIMARY KEY,   username VARCHAR(40) UNIQUE,  email VARCHAR(40) UNIQUE NOT NULL,  password varchar(40) NOT NULL )", (err,result)=>{
//             if (err) throw err;
//             console.log(result);
//         })
// }
// catch(err){
//     console.log(err);
// }

// connection.end();



/// Advancing mysql
// const connection= mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     database:'delta_app',
//     password:'girishpg'
// });

// // Trying to insert dyanamic data     /// 8:25 pm 
//  // Passing array of users
// let q= "INSERT INTO user(ID, username, email, password) VALUES ?";
// let users = [["4566", "456_usernewa", "def@gmail.coma", "abca"],
//              ["4567", "456_usernewb", "def@gmail.comb", "abcb"]
//             ];
// try{
//     connection.query(q,[users], (err, result)=>{
//     if (err) throw err;
//     console.log(result);
// } )
// }
// catch(err){
//     console.log(err);
// }

// connection.end();

/// 3 } Inserting 100 users data

const connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'delta_app',
    password:'girishpg'
});

// Trying to insert dyanamic data     /// 8:25 pm 
 // Passing array of users


//  let data=[];
//  let  getRandomUser = ()=> {
//   return [
//      faker.string.uuid(),
//      faker.internet.username(), // before version 9.1.0, use userName()
//      faker.internet.email(),
//      faker.internet.password(),
//   ];
// }
// for(let i=1; i<101; i++){
//     data.push(getRandomUser()); //pushingg data of 100 fake users
// }
// let q= "INSERT INTO user(ID, username, email, password) VALUES ?";


// try{
//     connection.query(q,[data], (err, result)=>{
//     if (err) throw err;
//     console.log(result);
//      } )
//  }
//  catch(err){
//     console.log(err);
//  }

// connection.end();

/////////////////////////////////////////////////////////////////////////////////////
/// express 
app.listen("8080", (req,res)=>{
    console.log("listening at port 8080");
});

app.get("/home", (req,res)=>{


  console.log("GET / route hit");
 



    let q=`SELECT COUNT(*) FROM user`;
    console.log(q);
    try{
     connection.query(q, (err, result)=>{
    let count= result[0]["count(*)"];
    console.log(count);
   // res.render("home.ejs",{count});
   res.render("home.ejs", { totalUsers : count});  
 
   console.log("aftre b4");

      } );
    }
    catch(err){
     console.log(err);
     res.send("some error occured in db");
     }

 // connection.end();
});



/// Show route
app.get("/user", (req,res)=>{

    let q= `SELECT * FROM user`;
     try{
      connection.query(q, (err, users )=>{
      //  console.log(result);

      res.render("showusers.ejs", { users });

      } );
    }
    catch(err){
     console.log(err);
     res.send("some error occured in db");
     }
})

/// EDIT ROUTE
app.get("/user/:id/edit", (req,res)=>{
  let { id }=req.params;
  console.log(id);
  let q= `SELECT * FROM user WHERE ID='${id}'`;
    try{
      connection.query(q, (err, result )=>{
       let user= result[0];
      res.render("edit.ejs", {user});

      } );
    }
    catch(err){
     console.log(err);
     res.send("some error occured in db");
     }
});


/// Update Route
app.patch("/user/:id", (req,res)=>{
   let { id }=req.params;
   let { passsword: formPass, username: newUsername} = req.body;
  let q= `SELECT * FROM user WHERE ID='${id}'`;
   try{
      connection.query(q, (err, result )=>{
       let user= result[0];
        console.log("formpassword : ",formPass);
        console.log("userpassword : ",user.passsword);

     if(formPass != user.password){
         res.send(formPass);
         
       }
    else{
        let q2=`UPDATE USER SET username='${newUsername}' WHERE ID='${id}'`; 
        connection.query(q2, (err,result)=>{
          if(err) throw err;
          res.send(result);
        })
      }
      });
    }
    catch(err){
     console.log(err);
     res.send("some error occured in db");
     }

})
