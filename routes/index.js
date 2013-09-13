 //Exportar modulos para formularios y base de datos
 var reg_form = require('../models/form')
 var Proveedorblog = require('../models/prvblog').Proveedorblog;
 var CT = require('../models/country-list');
 var AM = require('../models/account-manager');
 var EM = require('../models/email-dispatcher');
 var SX = require('../models/sexo');
 var NV = require('../models/nivel');
 //Convertir en modulo exportable de node.js
 module.exports = function(app) {

 	var employeeProvider = new Proveedorblog('localhost', 27017);

 	//Routes

 	//vista para el blog
 	app.get('/vista_blog', function(req, res) {
 		employeeProvider.findAll(function(error, emps) {
 			res.render('blog', {
 				title: 'Blog',
 				employees: emps
 			});
 		});
 	});

 	//nueva entrada
 	app.get('/employee/new', function(req, res) {
 		res.render('employee_new', {
 			title: 'New Employee'
 		});
 	});

 	//gusrdar nueva entrada
 	app.post('/employee/new', function(req, res) {
 		employeeProvider.save({
 			title: req.param('title'),
 			name: req.param('name')
 		}, function(error, docs) {
 			res.redirect('/vista_blog')
 		});
 	});

 	//modificar entrada
 	app.get('/employee/:id/edit', function(req, res) {
 		employeeProvider.findById(req.param('_id'), function(error, employee) {
 			res.render('employee_edit', {
 				title: employee.title,
 				employee: employee
 			});
 		});
 	});

 	//editar entrada
 	app.post('/employee/:id/edit', function(req, res) {
 		employeeProvider.update(req.param('_id'), {
 			title: req.param('title'),
 			name: req.param('name')
 		}, function(error, docs) {
 			res.redirect('/vista_panelx')
 		});
 	});

 	//eliminar entrada
 	app.post('/employee/:id/delete', function(req, res) {
 		employeeProvider.delete(req.param('_id'), function(error, docs) {
 			res.redirect('/vista_panelx')
 		});
 	});


 	app.get('/', function(req, res) {
 		res.render('index', {
 			title: 'Inicio'
 		});
 	})
 	// entrar//

 	app.get('/login', function(req, res) {
 		// verifica si el usuario no tiene cookies ya guardadas//
 		if (req.cookies.user == undefined || req.cookies.pass == undefined) {
 			res.render('login', {
 				title: 'Favor de ingresar sus datos'
 			});
 		} else {
 			// en caso de login automatico //
 			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o) {
 				if (o != null) {
 					req.session.user = o;
 					res.redirect('/vista_imprimir');
 				} else {
 					res.render('imprimir', {
 						title: 'Por favor ingrese con su cuenta'
 					});
 				}
 			});
 		}
 	});
 	//que hacer con el metodo post
 	app.post('/login', function(req, res) {
 		AM.manualLogin(req.param('user'), req.param('pass'), function(e, o) {
 			if (!o) {
 				res.send(e, 400);
 			} else {
 				req.session.user = o;
 				if (req.param('remember-me') == 'true') {
 					res.cookie('user', o.user, {
 						maxAge: 900000
 					});
 					res.cookie('pass', o.pass, {
 						maxAge: 900000
 					});
 				}
 				res.send(o, 200);
 			}
 		});
 	});
 	//vistas sencillas petodo get
 	app.get('/vista_valores', function(req, res) {
 		res.render('valores', {
 			title: 'Valores'
 		});
 	})
 	app.get('/vista_works', function(req, res) {
 		res.render('works', {
 			title: 'Trabajos'
 		})
 	})
 	app.get('/vista_ponentes', function(req, res) {
 		res.render('ponentes', {
 			title: 'Ponentes'
 		});
 	})
 	//elimanar usuario
 	app.post('/delete', function(req, res) {
 		AM.deleteAccount(req.body.id, function(e, obj) {
 			if (!e) {
 				res.clearCookie('user');
 				res.clearCookie('pass');
 				req.session.destroy(function(e) {
 					res.send('ok', 200);
 				});
 			} else {
 				res.send('record not found', 400);
 			}
 		});
 	});
 	//Crear nuevos registros
 	app.get('/vista_inscripcion', function(req, res) {
 		res.render('inscripcion', {
 			title: 'Incripcion',
 			countries: CT,
 			sexo: SX,
 			nivel: NV
 		});
 	});
 	app.post('/vista_inscripcion', function(req, res) {
 		AM.addNewAccount({
 			name: req.param('name'),
 			email: req.param('email'),
 			user: req.param('user'),
 			pass: req.param('pass'),
 			country: req.param('country'),
 			sexo: req.param('sexo'),
 			nivel: req.param('nivel'),
 			universidad: req.param('universidad'),
 			matricula: req.param('matricula'),
 			telefono: req.param('telefono'),
 		}, function(e) {
 			if (e) {
 				res.send(e, 400);
 			} else {
 				res.send('ok', 200);
 			}
 		});
 	});
 	//vistas sencillas metodo post
 	app.get('/vista_tecnicas', function(req, res) {
 		res.render('tecnicas', {
 			title: 'Tecnicas'
 		});
 	})
 	app.get('/vista_about', function(req, res) {
 		res.render('about', {
 			title: 'Quienes somos'
 		});
 	})
 	app.get('/vista_hospedaje', function(req, res) {
 		res.render('hospedaje', {
 			title: 'hospedaje'
 		});
 	})
 	// pagina de imprimir //

 	app.get('/vista_imprimir', function(req, res) {
 		if (req.session.user == null) {
 			// si el usuario no esta logeado llevar a login //
 			res.redirect('/login');
 		} else {
 			res.render('imprimir', {
 				//datos de usuario
 				title: 'Imprimir documento',
 				name: name,
 				email: email,
 				user: user,
 				pass: pass,
 				country: country,
 				sexo: sexo,
 				nivel: nivel,
 				universidad: universidad,
 				matricula: matricula,
 				telefono: telefono,
 				countries: CT,
 				udata: req.session.user

 			});
 		}
 	});

 	app.get('/vista_programa', function(req, res) {
 		res.render('programa', {
 			title: 'Programa'
 		});
 	})
 	app.get('/vista_precios', function(req, res) {
 		res.render('precios', {
 			title: 'Precios'
 		});
 	})
 	//lista de usuarios registrados
 	app.get('/print', function(req, res) {
 		AM.getAllRecords(function(e, accounts) {
 			res.render('print', {
 				title: 'Account List',
 				accts: accounts
 			});
 		})
 	});
 	// eliminar usuarios	
 	app.post('/delete', function(req, res) {
 		AM.deleteAccount(req.body.id, function(e, obj) {
 			if (!e) {
 				res.clearCookie('user');
 				res.clearCookie('pass');
 				req.session.destroy(function(e) {
 					res.send('ok', 200);
 				});
 			} else {
 				res.send('record not found', 400);
 			}
 		});
 	});
 	app.get('/vista_hospedaje', function(req, res) {
 		res.render('hospedaje', {
 			title: 'hospedaje'
 		});
 	})
 	app.get('/vista_turismo', function(req, res) {
 		res.render('turismo', {
 			title: 'turismo'
 		});
 	})


 	//lista y opciones para entradas
 	app.get('/vista_entradas', function(req, res) {
 		employeeProvider.findAll(function(error, emps) {
 			res.render('entradas', {
 				title: 'Entradas',
 				employees: emps
 			});
 		});
 	});
 	//panel de control
 	app.get('/vista_panelx', function(req, res) {
 		res.render('panel', {
 			title: 'Preguntas Frecuentes'
 		});
 	})
 	//preguntas frecuantes
 	app.get('/vista_faq', function(req, res) {
 		res.render('faq', {
 			title: 'Preguntas Frecuentes'
 		});
 	})

 	//app.post('/vista_entradas', function (req, res){
 	//contact_form.handle(req, {
 	//success: function(form) {
 	//res.render('contact',{title:'tu comentario fue enviado exitosamente'});
 	//},
 	//other: function(form) {
 	//	res.render('contact', {title:'Operacion fallida', contact: contact_form.toHTML()});
 	//	}
 	//	});	
 	//})
 	//app.get('/vista_inscripcion', function (req, res){
 	//	res.render('inscripcion', {title: 'Favor de llenar los campos del formulario',form: reg_form.toHTML()});
 	//});
 	//tomar los parametrosde reg_form 
 	//app.post('/vista_inscripcion', function (req, res){
 	//	reg_form.handle(req, {
 	//		success: function(form) {
 	//			res.render('inscripcion', {title: 'Formulario guardado exitosamente'});
 	//		},
 	//		other: function (form) {
 	//			res.render('inscripcion', {title: 'Operacion fallida', form: reg_form.toHTML()});
 	//		}
 	//	});
 	//	});
 }