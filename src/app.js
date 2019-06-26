//Requires
const {PORT} = require('./config/config')
const {URLDB} = require('./config/config');
const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const data = require('./data');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const server = require('http').createServer(app);
const io = require('socket.io')(server);


// Models mongodb
const User = require('./models/user');

// Local localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

// Session
app.use(session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true
}))

// Paths
const directory_public = path.join(__dirname, '../public');
const directory_templates = path.join(__dirname, '../templates');   //There is the folder with all the views in html and the partials footer and header

// Static
app.use(express.static(directory_public));

// Middlewares
app.use((req,res,next) => {

  if(req.session.user){
    res.locals.session = true
    res.locals.user  = req.session.user
    res.locals.firstname = req.session.firstname
    res.locals.lastname = req.session.lastname
    res.locals.roll = req.session.roll
    res.locals.email = req.session.email
    res.locals.cc = req.session.cc
    res.locals.phone = req.session.phone
    res.locals.listado = req.session.listado
    res.locals.courses = req.session.courses
    res.locals.miscursos = req.session.miscursos
    res.locals.misusuarios = req.session.misusuarios
    res.locals.verCursosDisponibles = req.session.verCursosDisponibles
    res.locals.verUsuarios = req.session.verUsuarios
    res.locals.modificar = req.session.modificar
    res.locals.teachers = req.session.teachers
    res.locals.mismaterias = req.session.mismaterias
    res.locals.cursosInscritos = req.session.cursosInscritos
    res.locals.cursosDisponibles = req.session.cursosDisponibles
    res.locals.cursosCerrados = req.session.cursosCerrados
    res.locals.valorCursosInscritos = req.session.valorCursosInscritos
    res.locals.ganancia = req.session.ganancia
    res.locals.datos = req.session.datos
    //vars modify user by admin
    if(req.session.modificar){
      res.locals.cursosUser = req.session.cursosUser
      res.locals.fistnameUser =  req.session.firstnameUser
      res.locals.lastnameUser  =  req.session.lastnameUser
      res.locals.emailUser =  req.session.emailUser
      res.locals.passwordUser =  req.session.passwordUser
      res.locals.phoneUser =  req.session.phoneUser
      res.locals.ccUser = req.session.ccUser
      res.locals.rollUser =  req.session.rollUser
    }
    //vars change avatar
    if(req.session.avatar){
      res.locals.avatar = req.session.avatar
    }
    if(req.session.coordinador){
      res.locals.coordinador = true
    }
  }
  next()
});

// BodyParser
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use(require('./routes/index'));
//app.use(multer({dest:'./../routes/index'}).any());

//mongoose Conection
mongoose.connect(URLDB, {useNewUrlParser:true},(err, result) =>{
  if(err){
    return console.log(err)
  }
  console.log("moongose conected")
})

//var puerto = 3000
server.listen(PORT, ()=>{
	console.log('Escuchando en el puerto ' + PORT)
});
