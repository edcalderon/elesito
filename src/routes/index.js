//Requires
require('.././config/config');
const{APIKEY} = require('.././config/config');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(APIKEY);
var $ = require("jquery");
require('./../helpers/helpers');

// Directory Paths
const directorio_partials = path.join(__dirname, './../../templates/partials');
const directorio_views = path.join(__dirname, './../../templates/views');

// HBS
hbs.registerPartials(directorio_partials);
app.set('views',directorio_views);
app.set('view engine', 'hbs');//Le configuramos el motor de templates o de vistas

// Models mongodb
const User = require('./../models/user');
const Product = require('../models/product');

// Session
app.use(session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true
}))

// Paths
app.get('/', (req, res) =>{
	res.render ('indexdashboard',{})
});

app.get('/indexdashboard', (req, res) =>{
	res.render ('indexdashboard',{})
});

app.get('/loginregister', (req, res) =>{
  	res.render('loginregister',{})
});

app.post('/loginregister', (req, res) =>{
    User.findOne({email : req.body.inputEmail}, (err,result)=>{
			if(err){
				console.log(err)
				res.render('loginregister', {
								registro: req.body.registro,
								show: "Error"
				})
			}
			if(!result){
				res.render('loginregister', {
					login: req.body.login,
					show: "Usuario o contraseña incorrectas",
					path: "/loginregister",
					button: "danger"
				})
			}
			if(result && !bcrypt.compareSync(req.body.inputPassword, result.password)){
				res.render('loginregister', {
					login: req.body.login,
					show: "Usuario o contraseña incorrectas",
					path: "/loginregister",
					button: "danger"
				})
			}
			if(result && bcrypt.compareSync(req.body.inputPassword, result.password) && result.roll == "administrador"){

				// session variables
				req.session.user = result._id
				req.session.roll = result.roll
				req.session.firstname = result.firstname
				req.session.lastname = result.lastname
				req.session.email = result.email
				req.session.cc = result.cc
				req.session.phone = result.phone
				req.session.coordinador = true
				if(result.avatar){
					req.session.avatar = result.avatar.toString('base64')
				}
				res.render('loginregister', {
					login: req.body.login,
					show: "Bienvenido.",
					path: "/dashboardadmin",
					button: "success",
				})
			}
			if(result && bcrypt.compareSync(req.body.inputPassword, result.password) && result.roll == "cajero"){
				// session variables
				req.session.user = result._id
				req.session.roll = result.roll
				req.session.firstname = result.firstname
				req.session.lastname = result.lastname
				req.session.email = result.email
				req.session.cc = result.cc
				req.session.phone = result.phone
				if(result.avatar){
					req.session.avatar = result.avatar.toString('base64')
				}

				 res.render('loginregister', {
					login: req.body.login,
					show: "Usuario y Contraseña correctas! ya puedes continuar.",
					path: "/dashboarduser",
					button: "success",
				})
			}

			if(result && bcrypt.compareSync(req.body.inputPassword, result.password) && result.roll == "supervisor"){
				// session variables
				req.session.user = result._id
				req.session.roll = result.roll
				req.session.firstname = result.firstname
				req.session.lastname = result.lastname
				req.session.email = result.email
				req.session.cc = result.cc
				req.session.phone = result.phone
				if(result.avatar){
					req.session.avatar = result.avatar.toString('base64')
				}

				 res.render('loginregister', {
					login: req.body.login,
					show: "Bienvenido supervisor",
					path: "/dashboardteacher",
					button: "success",
				})
			}
		})
});

app.get('/dashboarduser', (req, res) =>{
	Product.find({}, (err,result)=>{
		if(err){
			console.log(err)
		}	
		res.render ('dashboarduser',{
			listarproductos: req.query.listarproductos,
			articulos: result
		})
	})
});


app.get('/register', (req, res) =>{
  	res.render('register', {})
});

app.post('/register', (req, res) =>{
	let user = new User({
		firstname: req.body.firstName,
		lastname: req.body.lastName,
		email: req.body.inputEmail,
		password: bcrypt.hashSync(req.body.inputPassword, 10),
		phone: req.body.phone,
		cc: req.body.cedula,
		roll: "cajero"
	})
	user.save((err,result)=>{
		if(err){
			console.log(err);
						res.render('register', {
							registro: req.body.registro,
							show: "Upss! el usuario con ese email o cedula ya existe"
						})
		}
		const mailmsg = {
		  to: req.body.inputEmail,
		  from: 'edwardca12@gmail.com',
		  subject: 'Bienvenido a mi app!',
		  text: 'Hola, bienvenido a mi aplicacion web, estamos en construccion.',
		  html: `<h1> Hola ${req.body.firstName}!, bienvenido a mi aplicación web, estamos en construcción.<h1> <br> <strong>pronto mucho más! esperanos.</strong>`,
		};
    // send mail
		sgMail.send(mailmsg)

		res.render('register',{
			  registro: req.body.registro,
				show: "<a href='/loginregister' >Registro exitoso! ya puedes ingresar </a>"
		})
	})
});

app.get('/dashboardadmin', (req, res) =>{
	Product.find({}, (err,result1)=>{
		if(err){
			console.log(err)
		}	
		User.find({}, (err,result2)=>{
			if(err){
				console.log(err)
			}
			res.render ('dashboardadmin',{
				listar: req.query.listar,
				listararticulos: req.query.listararticulos,
				registrar: req.query.registrar,
				usuarios: result2,
				articulos: result1
			})
		});
	});		
});	
app.get('/dashboardadmintable', (req, res) =>{
	User.find({}, (err,result)=>{
		console.log(result)
		if(err){
			console.log(err)
		}
		res.json(result)
	});	
});

// Multer destin folder
var upload = multer({
	limits:{
		fileSize: 10000000
	},
	fileFilter(req,file,cb){
		if(!file.originalname.match(/\.(jpg|png|jpeg|JPG|PNG|JPEG)$/)){
			cb(new Error("No es un archivo valido"))
		}
		cb(null,true)
	  }
})
app.post('/dashboardadmin', upload.single('imagenProducto'), (req, res) =>{
	if(req.query.listar){
		User.findOne({cc: req.body.busqueda},(err,results)=>{
			if (err){
				return console.log(err)
			}
			
			if(results){
				req.session.usuario = results
				res.render ('dashboardupdateuser',{
					firstnameUser: results.firstname,
					lastnameUser: results.lastname,
					phoneUser: results.phone,
					rollUser: results.roll,
					ccUser: results.cc,
					emailUser: results.email	
				})
			}
			else {
				res.render('dashboardadmin')
			}	
		})	
	}if(req.query.registrar){
		let producto = new Product({
			nombre: req.body.nombre,
			categoria: req.body.categoria,
			precio: req.body.precio,
			descripcion: req.body.descripcion,
			descuento: req.body.descuento,
			imagen: req.file.buffer
		})
		producto.save((err,result)=>{
			if(err){
				console.log(err);
							res.render('dashboardadmin', {
	  
							})
			}
	  
			res.render('dashboardadmin',{
	  
			})
		})
	}
});


app.get('/dashboardupdateuser', (req, res) =>{
	usuario = req.session.usuario
	res.render('dashboardupdateuser')
		
})

app.post('/dashboardupdateuser', (req, res) =>{

	var conditions = {};

		if(req.body.firstnameUser){
			Object.assign(conditions, {firstname : req.body.firstnameUser})
		}
		if(req.body.lastnameUser){
			Object.assign(conditions, {lastname : req.body.lastnameUser})
		}
		if(req.body.emailUser){
			Object.assign(conditions, {email : req.body.emailUser})
		}
		if(req.body.phoneUser){
			Object.assign(conditions, {phone : req.body.phoneUser})
		}
		if(req.body.rollUser){
			Object.assign(conditions, {roll : req.body.rollUser})
		}

		console.log('las condiciones ' +conditions)

		User.findOneAndUpdate({email: req.body.emailUser}, {$set: conditions}, {new: true},(err, resultado) => {
				if (err){
					 return console.log(err)
				 }
				 console.log("hola" + resultado)
				 res.render('dashboardupdateuser', {
					 firstnameUser :  resultado.firstname,
					 lastnameUser : resultado.lastname,
					 emailUser :  resultado.email,
					 phoneUser : resultado.phone,
					 ccUser : resultado.cc,
					 rollUser : resultado.roll,
					 resultshow: "Datos actualizados correctamente"
				 })
		})
});

app.get('/dashboardprofile', (req, res) =>{
  	res.render('dashboardprofile', {
		})
});




app.post('/dashboardprofile', upload.single('userPhoto') ,(req, res) =>{

	if(req.body.avatar){
			User.findOneAndUpdate({_id: req.session.user}, {$set: {avatar: req.file.buffer}},{new:true}, (err, resultado) => {
				if (err){
					 return;
				 }res.render('dashboardprofile', {
					avatar: resultado.avatar.toString('base64'),
					resultshow: "avatar cargado correctamente."
				  })
			})
	}
  if(req.body.infoprofile){
		var conditions = {};

		if(req.body.firstname){
			Object.assign(conditions, {firstname : req.body.firstname})
		}
		if(req.body.lastname){
			Object.assign(conditions, {lastname : req.body.lastname})
		}
		if(req.body.phone){
			Object.assign(conditions, {phone : req.body.phone})
		}
		if(req.body.password){
			Object.assign(conditions, {password : req.body.password})
		}

		User.findOneAndUpdate({_id: req.session.user}, {$set: conditions}, {new:true},(err, resultado) => {
				if (err){
					 return console.log(err);
				 }res.render('dashboardprofile', {
					 firstname :  resultado.firstname,
					 lastname : resultado.lastname,
					 email :  resultado.email,
					 phone : resultado.phone,
					 cc : resultado.cc,
					 roll : resultado.roll,
					 resultshow: "Datos actualizados correctamente."
				 })
		})
  }
});

app.get('/exit', (req, res) =>{
		//localStorage.setItem('token', ' ')
		res.locals.session = false
		req.session.destroy()
		res.render ('indexdashboard',{})

});

app.get('/dashboardchat', (req, res) =>{
  	res.render('dashboardchat', {
			chatusername : req.query.chatusername,
			idm: req.session.user
		})
});
app.get('/dashboardchat2', (req, res) =>{
  	res.render('dashboardchat2', {
			chatusername : req.query.chatusername,
		})
});

app.get('/dashboardteacher', (req, res)=>{
	res.render('dashboardteacher',{})
})

app.get('*',(req, res)=>{
	res.render('error', {});
});

module.exports = app;
