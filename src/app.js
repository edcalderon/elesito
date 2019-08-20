// Requires
const { PORT } = require('./config/config');
const { URLDB } = require('./config/config');
const express = require('express');

const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const server = require('http').createServer(app);
const { LocalStorage } = require('node-localstorage');

let localStorage;
// Local localstorage
if (typeof localStorage === 'undefined' || localStorage === null) {
	localStorage = new LocalStorage('./scratch');
}

// Session
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
}));

// Paths
const directoryPublic = path.join(__dirname, '../public');

// Static
app.use(express.static(directoryPublic));

// Middlewares
app.use((req, res, next) => {
	if (req.session._id) {
		res.locals.session = true;
		res.locals._id = req.session._id;
		res.locals.firstname = req.session.firstname;
		res.locals.lastname = req.session.lastname;
		res.locals.usuario = req.session.usuario;
		res.locals.roll = req.session.roll;
		res.locals.email = req.session.email;
		res.locals.cc = req.session.cc;
		res.locals.phone = req.session.phone;
		res.locals.esiPuntos= req.session.esiPuntos;
		res.locals.listado = req.session.listado;
		res.locals.courses = req.session.courses;
		res.locals.miscursos = req.session.miscursos;
		res.locals.misusuarios = req.session.misusuarios;
		res.locals.verCursosDisponibles = req.session.verCursosDisponibles;
		res.locals.verUsuarios = req.session.verUsuarios;
		res.locals.modificar = req.session.modificar;
		res.locals.teachers = req.session.teachers;
		res.locals.mismaterias = req.session.mismaterias;
		res.locals.cursosInscritos = req.session.cursosInscritos;
		res.locals.cursosDisponibles = req.session.cursosDisponibles;
		res.locals.cursosCerrados = req.session.cursosCerrados;
		res.locals.valorCursosInscritos = req.session.valorCursosInscritos;
		res.locals.ganancia = req.session.ganancia;
		res.locals.datos = req.session.datos;
		res.locals.shopingcart = req.session.shopingcart;
		// vars modify user by admin
		if (req.session.modificar) {
			res.locals.cursosUser = req.session.cursosUser;
			res.locals.fistnameUser = req.session.firstnameUser;
			res.locals.lastnameUser = req.session.lastnameUser;
			res.locals.emailUser = req.session.emailUser;
			res.locals.passwordUser = req.session.passwordUser;
			res.locals.phoneUser = req.session.phoneUser;
			res.locals.ccUser = req.session.ccUser;
			res.locals.rollUser = req.session.rollUser;
		}
		// vars change avatar
		const {
			avatar, administrador, gerente, bodeguero, cajero,
		} = req.session;
		res.locals.avatar = avatar || null;
		res.locals.administrador = administrador ? true : null;
		res.locals.gerente = gerente ? true : null;
		res.locals.bodeguero = bodeguero ? true : null;
		res.locals.cajero = cajero ? true : null;
		res.locals.active = administrador || gerente || bodeguero || cajero;
	}
	next();
});

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(require('./routes/index'));
// app.use(multer({dest:'./../routes/index'}).any());

// mongoose Conection
mongoose.connect(URLDB, { useNewUrlParser: true }, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('moongose conected');
	}
});

// var puerto = 3000
server.listen(PORT, () => {
	console.log(`Escuchando en el puerto ${PORT}`);
});
