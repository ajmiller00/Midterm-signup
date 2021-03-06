var http = require('http');
var fs = require('fs');
var qs = require('querystring');
const express = require('express');
const app = express();
const {runInContext } = require('vm');
//var auth = require('https://ajmiller00.github.io/Midterm-signup/logIn.js');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://amille26:cs20final@cluster0.ktqrs.mongodb.net/reveauchocolat?retryWrites=true&w=majority";
var crypto = require('crypto');

var port = process.env.PORT || 3000;
// var port = 8080;

exports.addUser = async (pdata) => {

    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, async (err, db) => {
          if (err) return reject(err)

          const collection = await (db.db("reveauchocolat").collection('users'));
          const collc = await (db.db("reveauchocolat").collection('current'));


          try {
           const items = await (await collection.find({"email" : pdata['email']})).toArray()
           if (items.length > 0) {
               console.log("Email already exists");
               await collc.updateOne({ "current" : "current" }, {$set: {"email" : "FAILURE"}});
               result = "FAILURE"
           } else {
               let salt = (Math.random() + 1).toString(36).substring(7);
               var password = crypto.createHash('md5').update(salt + pdata['pass']).digest('hex');
               console.log(password);
               var newData = {"fname":pdata['fname'], "lname":pdata['lname'], "email":pdata['email'], "phone":{"$numberLong":pdata['phone']},"street":pdata['street'], "city":pdata['city'], "state":pdata['state'], "zip":pdata['zip'], "password": password, "cart":[""], "salt":salt};

               await collection.insertOne(newData, function(err, res) {
                   if(err) { console.log("Insert Error: " + err); return; }
                   console.log("New document inserted!");
               });
               await collc.updateOne({ "current" : "current" }, {$set: {"email" : pdata['email']}});
               result =  pdata['email'];
           }
          } catch (e) {
            return reject(e)
          }

          console.log("Success!");
          db.close();
          console.log("Print " + result);

          return resolve(result)

        });
      });

};




app.use(express.static('public'));

app.get('/', async (req, res) => {
	file = 'signup.html';
	fs.readFile(file, function(err, txt) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(txt);
		res.end();
	});
	//res.writeHead(200, {'Content-Type': 'text/html'});
	//res.write("hello");
	//res.end();
});

app.post('/addUser', async (req, res) => {
	file = 'signup.html';

	pdata = "";
	req.on('data', data => {
	  pdata += data.toString();
	});

   // when complete POST data is received
   req.on('end', async () => {
	   pdata = qs.parse(pdata);
	   // res.write ("The email is: " + pdata['email'] + "<br>");
	   // res.write ("The password is: " + pdata['password'] + "<br>");
	   const result = await exports.addUser(pdata);   
	   res.writeHead(200, {'Content-Type':'text/html'});
		res.write("<!DOCTYPE html><html lang='en'><head><script src='https://code.jquery.com/jquery-3.6.0.min.js' integrity='sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=' crossorigin='anonymous'>");
		res.write("</script><meta charset='UTF-8'><meta name='viewpor' content='width=device-width, initial-scale=1.0'><link rel='preconnect' href='https://fonts.googleapis.com'>");
		res.write("<link rel='preconnect' href='https://fonts.gstatic.com' crossorigin><link href='https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600;700&display=swap' rel='stylesheet'>");
		res.write("<link rel='preconnect' href='https://fonts.googleapis.com'><link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>");
		res.write("<link href='https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600;700&display=swap' rel='stylesheet'><link href='https://fonts.googleapis.com/css2?family=Amaranth&display=swap' rel='stylesheet'>");

		res.write("<title>Gifts</title><link rel = 'stylesheet' type = 'text/css' href = 'https://ajmiller00.github.io/Midterm/style.css'>");
		res.write("<link rel = 'stylesheet' type = 'text/css' href = 'https://ajmiller00.github.io/Midterm/style_haijun.css'>");
		res.write("<style type = 'text/css'> body { font-family: 'Amaranth', sans-serif; } .img { max-width: 290px; max-height: 330px; background-size: cover; }");
		res.write(".column { float: left; width: 25%; padding: 10px; height: 600px; border-right: 2px solid #003267; border-left: 2px solid #003267; font-weight: 600pt; font-size: 24pt; text-align:center; box-sizing: border-box;}");
		res.write("h2 { text-align: left; font-size: 25pt; font-weight: 900; } h4 { font-size:  25px; color: #003267; } p { font-size: 15px; font-weight:300; }");
		res.write("#products { background-color: #FCECC8; } #message { text-align:center; } #submit { text-align:center; }");
		res.write("@media (max-width: 991px) { .column { width: 50%; } } @media (max-width:767px) { .img { max-width:200px; } }");
		res.write("@media (max-width:479px) { h4 { font-size:20px; } .img { max-width: 150px; } } </style></head>");

		res.write("<header><div class='a' style='text-align:center; position: relative;'><div class='loginburger' style='position:absolute;'>");
		res.write("<img src='https://ajmiller00.github.io/Midterm/acc_icon.png' width='30px'><a class = 'burger' href='https://reveauchocolat-myaccount.herokuapp.com/'>Profile</a>");
		res.write("<a class = 'burger' href='https://reveauchocolat-login.herokuapp.com/'>Log In</a></div>");
		res.write("<div class='logo' style='display: inline-block;'><a href='https://ajmiller00.github.io/Midterm/index.html'><img src='https://ajmiller00.github.io/Midterm/logo-06.png' class='header'/></a></div></div>");
		res.write("<nav><ul><li><a href='https://ajmiller00.github.io/Midterm/about_us.html'>About Us</a> </li><li><a href='https://reveauchocolat-products.herokuapp.com/'>Shop</a> </li>");
		res.write("<li><a href='https://ajmiller00.github.io/Midterm/catering.html'>Catering</a> </li>");
		res.write("<li><a href='https://reveauchocolat-gifts.herokuapp.com/'>Gifts</a> </li>");
		res.write("<li><a href='https://ajmiller00.github.io/Midterm/workshops_events.html'>Events</a> </li><li><a href='https://ajmiller00.github.io/Midterm/contact.html' >Contact Us</a> </li>");
		res.write("<li><a href='https://reveauchocolat-cart.herokuapp.com/' style='padding:10px 20px; background-color: #ff9933; color: #003267;border: none;margin-top:  10px;cursor:pointer;-webkit-border-radius: 5px;border-radius: 4px;'>My Cart</a> </li>");
		res.write("</ul></nav>");

		res.write("<div class='burger' id = 'bur'><img src='https://ajmiller00.github.io/Midterm/burger.png' class='burger' onclick='show()'></div>");
		res.write("<div class='oBurger' id = 'burger'><ul id = 'burgerUl'>");
		res.write("<li><a class = 'burger' href='https://ajmiller00.github.io/Midterm/about_us.html'>About Us</a> </li><li><a href='https://reveauchocolat-products.herokuapp.com/'>Shop</a> </li>");
		res.write("<li><a class = 'burger' href='https://ajmiller00.github.io/Midterm/catering.html'>Catering</a> </li>");
		res.write("<li><a class = 'burger' href='https://reveauchocolat-gifts.herokuapp.com/'>Gifts</a> </li>");
		res.write("<li><a class = 'burger' href='https://ajmiller00.github.io/Midterm/workshops_events.html'>Events</a> </li><li><a href='https://ajmiller00.github.io/Midterm/contact.html' >Contact Us</a> </li>");
		res.write("<li></li><li></li><li><a class = 'burger' href='https://reveauchocolat-cart.herokuapp.com/'>My Cart</a></li></ul></div></header>");
		res.write("<body>");
	   if (result != "FAILURE") {
		   res.write("<div id = 'add'> <br><br><br> Successful Sign Up! <br><br><br><br><br><br>");
		   res.write("</div>");
		   console.log("The result " + result);
	   } else {
		   res.write("<div id = 'add'> <br><br><br> Sign Up Failed, Please Try Another Email <br><br><br><br><br><br>");
		   res.write("</div>");
	   }
	   res.write("<footer>&copy; 2021 Rêve au Chocolat – 23 Fausse Street, Cambridge, MA – (617) 555 0113</footer>")
	   res.end();
   });



});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
