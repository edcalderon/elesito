const hbs = require('hbs');


hbs.registerHelper('sum', (productos) => {
	if (productos) {
		const total = productos.reduce((acum, producto) => acum + (producto.precio), 0);
		return total;
	}
	return 0;
});

hbs.registerHelper('listarArticulos', (articulos) => {
	let texto = '';
	articulos.forEach((art) => {
		texto += `
	<div class="col-lg-3 col-md-6">
                        <div class="card">
                            <div class="el-card-item">
									<div class="el-card-avatar el-overlay-1"> <img src="data:img/jpeg;base64,${art.imagen.toString('base64')}" alt="user" />
									</div>
										<div class="d-flex no-block align-items-center">
											<div class="m-l-15">
												<h4 class="m-b-0">${art.nombre}</h4>
												<span class="text-muted">${art.descripcion}</span>
											</div>
											<div class="ml-auto m-r-15">
													<button type="button" class="btn btn-dark btn-circle">$${art.precio}</button>
											</div>
								       </div>
                                 </div>
                        </div>
                    </div>
	
`;
	});
	return texto;
});

hbs.registerHelper('section', function (name, options) {
	if (!this._sections) this._sections = {};
	this._sections[name] = options.fn(this);
	return null;
});

hbs.registerHelper('listarProductosCart', (productos, cant) => {
	let texto = '';
	let i = 0;
	productos.forEach((art) => {
		texto += `
	<tr>
		<td width="150"><img src="data:img/jpeg;base64,${art.imagen.toString('base64')}" alt="iMac" width="80"></td>
		<td width="550">
			<h5 class="font-500">${art.nombre}</h5>
			<p>${art.descripcion}</p>
		</td>
		<td>${art.sede}</td>
		<td id="precio-${i}">$${art.precio}</td>
		<td width="70" onclick="total(${i});">
			<input type="text" id="input-${i}" onchange="total(${i});" class="input form-control" placeholder="1" value="${cant}">
		</td>
		<td width="150" align="center" id="total-${i}" class="font-500 totalItem">${art.precio}</td>
		<td align="center"><a href="javascript:void(0)" class="text-inverse" title="" data-toggle="tooltip" data-original-title="Delete"><i class="ti-trash text-dark"></i></a></td>
	</tr>
	`;
		i += 1;
	});
	return texto;
});

hbs.registerHelper('listarUsuarios', (usuarios) => {
	let texto = '';
	usuarios.forEach((usr) => {
		texto += `<tr role="row" class="odd">
			 <td class="sorting_1">${usr.firstname}</td>
			 <td>${usr.lastname}</td>
			 <td>${usr.cc}</td>
			 <td class="cell100 column4">   
			   <div class="inblock" >
			   <button type="button" class="btn btn-outline-primary"><i id="edit" data-id="${usr.cc}" class="fa fa-pencil" >Editar&nbsp;&nbsp;</i></button>
			   <button type="button" class="btn btn-outline-danger"><i id="delete" data-id="${usr.cc}" class="fa fa-trash">Eliminar&nbsp;&nbsp;</i></button>
				 <input type="checkbox" data-id="${usr.cc}" class="check"/> 
			   </div>
			 </td>
            </tr>`;
	});
	return texto;
});

hbs.registerHelper('listarProductos', (productos) => {
	let texto = '';
	if (productos) {
		productos.forEach((prod) => {
			prod.sede.forEach((city) => {
				texto += `
				<form action="/updatestock" method="get>
					<tr role="row" class="odd">
						<td class="sorting_1 col-6">${prod.nombre}</td>
						<td class="col-md-auto">${prod.precio}</td>
						<td>${city}</td>
						<td class="cell100 column4">   
							<div class="inblock" >
							<i id="edit" data-id="${prod._id}" class="fa fa-pencil" ></i>
							<i id="delete" data-id="${prod._id}" class="fa fa-trash"></i>
							<i id="shop" data-id="${prod.id}"  data-sede="${city}"class="fa fa-cart-plus cartshop"></i>
							<input type="checkbox" data-id="${prod._id}" class="check"/> 
							</div>
						</td>
					</tr>
				</form>
			`;
			});
		});
	}
	return texto;
});

hbs.registerHelper('listarProductosTienda', (productos) => {
	let texto = '';
	productos.forEach((prod) => {
		texto += `<tr role="row" class="odd">
		 <td class="sorting_1">${prod.nombre}</td>
		 <td>${prod.cantidad}</td>
		 <td>${prod.sede}</td>
		</tr>`;
	});
	return texto;
});

hbs.registerHelper('listProdUp', (productos) => {
	let contenido = '';
	productos.forEach((prod) => {
		prod.sede.forEach((city) => {
			contenido += `
				<form action="/updatestock" method="get>
					<tr role="row" class="odd">
						<td>${prod.codigo}</td>
						<td>${prod.nombre}</td>
						<td>${prod.categoria}</td>
						<td>
							<div class="d-flex justify-content-around">
								<span>${prod.cantidad[city]}</span>
								<input type="number" placeholder="0" class="text-center" name="cantidad">
								<input type="texto" name="sede" value="${city}" hidden>
								<input type="texto" name="nombre" value="${prod.nombre}" hidden>
								<button type="submit" class="btn btn-primary">Agregar</button>
							</div>
						</td>
						<td>${city}</td>
					</tr>
				</form>
			`;
		});
	});
	return contenido;
});

hbs.registerHelper('listarProductosTiendaUpdate', (productos) => {
	let texto = '';
	productos.forEach((prod) => {
		prod.sede.forEach((city) => {
			texto += `<form action="/updatestock" method="GET">
		 <tr role="row" class="odd">
		 <td class="sorting_1">${prod.nombre}</td>
		 <td>${prod.codigo}</td>
		 <td>${prod.categoria}</td>
		 <td>
			<div class="input-group mb-3" style="display: flex; justify-content: space-between">
				<span>${prod.cantidad[city]}</span>
				<input type="number" name="cantidad">
				<input type="text" name="sede" value="${city}" hidden>
				<input type="text" name="nombre" value="${prod.nombre}" hidden>
				<button class="btn btn-primary" type="submit">Agregar</button>
			</div>
		 </td>
		 <td>${city}</td>
		</tr></form>`;
		});
	});
	return texto;
});

hbs.registerHelper('disponibleCourses', (listado) => {
	let texto = ' ';
	let count = 1;
	listado.forEach((curso) => {
		console.log(curso.nombre);
		texto += `<div id='accordion'>
				 <div class="card mb-2">
				     <div class="card-header" id="heading${count}">
				       <h5 class="mb-0">
				         <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${count}" aria-expanded="false" aria-controls="collapse${count}">
				          CURSO: ${curso.name} VALOR: ${curso.value} DESCRIPCION: ${curso.description}
				         </button>
				       </h5>
				     </div>
				     <div id="collapse${count}" class="collapse " aria-labelledby="heading${count}" data-parent="#accordion">
				       <div class="card-body">
				         <p>Descripción: ${curso.description}</p>
								 <p>MODALIDAD: ${curso.modality}</p>
								 <p>INTENSIDAD HORARIA: ${curso.intensity}</p>
				       </div>
				     </div>
				  </div>
					</div>`;
		console.log(count);
		count += 1;
	});
	console.log(texto);
	return texto;
});

// Incribir cursos con mongodb y listarlos mongo

hbs.registerHelper('inscription', (listado) => {
	let texto = `	<form action="/dashboarduser" method="post">
			<table class='table table-striped table-hover'>
					<thead class='thead-dark'>
					<th>Nombre</th>
					<th>Valor</th>
					<th>Intensidad</th>
					<th>Modalidad</th>
					<th></th>
					<th></th>
					</thead>
					<tbody>`;
	listado.forEach((materia) => {
		texto +=
			`<tr>
					<td> ${materia.name} </td>
					<td> ${materia.value} </td>
					<td> ${materia.intensity}</td>
					<td> ${materia.modality} </td>
					<td><button class="btn btn-primary" name="ver" id="informacion">Ver</button></td>
					<td><button class="btn btn-primary" name="inscribir" value="${materia.name}">Inscribir</button></td>
					</tr> `;
	});
	texto += '</tbody> </table></form>';
	return texto;
});

// Cerrar cursos y listarlos mongo

hbs.registerHelper('closeCourse', (courses) => {
	let texto = `	<form action="/dashboardadmin" method="post">
			<table class='table table-striped table-hover'>
					<thead class='thead-dark'>
					<th>Nombre</th>
					<th>Valor</th>
					<th>Intensidad</th>
					<th>Modalidad</th>
					<th>Estado</th>
					<th></th>
					<th></th>
					</thead>
					<tbody>`;
	courses.forEach((course) => {
		// switch
		let switchVal = 'cerrar';
		if (course.state === 'Cerrado') {
			switchVal = 'abrir';
		}
		console.log(course.students);
		const myJSON = JSON.stringify(course.students);

		texto +=
			`<tr>
					<td> ${course.name} </td>
					<td> ${course.value} </td>
					<td> ${course.intensity}</td>
					<td> ${course.modality} </td>
					<td> ${course.state}</td>
					<td>
						<p>
						  <button class="btn btn-primary" type="submit" data-toggle="collapse" data-target="#collapseExample${course.name}" aria-expanded="false" aria-controls="collapseExample${course.name}" name="inscritos" value="${course.name}">
						    Inscritos
						  </button>
						</p>
						<div class="collapse" id="collapseExample${course.name}">
						  <div class="card card-body">
						     ${myJSON}
						  </div>
						</div>
					</td>
					<td><button class="btn btn-primary" type="submit" name=${switchVal} value="${course.name}">${switchVal}</button></td>
					</tr> `;
	});
	texto += "</tbody> </table><input type='hidden' name='asigna'  value='asigna'></form>";
	return texto;
});

// Ayuda para la visualización de imagenes
hbs.registerHelper('imagerSource', photo => (photo ?
	`data:img/jpeg;base64,${photo.toString('base64')}` :
	'../../assets/images/gallery/product_default.png'));


// Eliminar inscripcion mongo

hbs.registerHelper('cancelIncription', (miscursos) => {
	let texto = `	<form action="/dashboarduser" method="post">
			<table class='table table-striped table-hover'>
					<thead class='thead-dark'>
					<th>Nombre</th>
					<th>Valor</th>
					<th>Intensidad</th>
					<th>Modalidad</th>
					<th></th>
					</thead>
					<tbody>`;
	miscursos.forEach((materia) => {
		texto +=
			`<tr>
					<td> ${materia.name} </td>
					<td> ${materia.value} </td>
					<td> ${materia.intensity}</td>
					<td> ${materia.modality} </td>
					<td><button class="btn btn-danger" name="eliminar" value="${materia.name}">Cancelar</button></td>
					</tr> `;
	});
	texto += '</tbody> </table></form>';
	return texto;
});

// Modificar usuarios y listarlos mongo

hbs.registerHelper('modifyUser', (misusuarios) => {
	let texto = `	<form action="/dashboardadmin" method="post">
			<table class='table table-striped table-hover'>
					<thead class='thead-dark'>
					<th>Nombre</th>
					<th>Apellido</th>
					<th>Cédula</th>
					<th></th>
					</thead>
					<tbody>`;
	misusuarios.forEach((usuario) => {
		texto +=
			`<tr>
					<td> ${usuario.firstname} </td>
					<td> ${usuario.lastname} </td>
					<td> ${usuario.cc}</td>
					<td><button class="btn btn-info" name="modificar" value="${usuario._id}">Modificar</button></td>
					</tr> `;
	});
	texto += '</tbody> </table></form>';
	return texto;
});

// Listar y asignar docentes mongo

hbs.registerHelper('assignTeacher', (teachers) => {
	let texto = `	<form action="/dashboardadmin" method="post" name="myform">
					<select class="form-control" name='profesor' onchange="myform.submit()">
					<option selected="">Elija el profesor</option>`;
	teachers.forEach((teacher) => {
		texto +=
			`<option value="${teacher.cc}">${teacher.firstname}</option>`;
	});
	texto += '</select></form>';
	return texto;
});

// Informacion cursos y estudiantes (profesor) mongo

hbs.registerHelper('infoTeachers', (materias) => {
	let texto = `	<form action="/dashboardadmin" method="post">
			<table class='table table-striped table-hover'>
					<thead class='thead-dark'>
					<th>Nombre</th>
					<th>Valor</th>
					<th>Intensidad</th>
					<th>Modalidad</th>
					<th>Estado</th>
					<th></th>
					</thead>
					<tbody>`;
	materias.forEach((element) => {
		const { cursos } = element;
		cursos.forEach((curso) => {
			console.log(`estudiantes en curso ${curso.name}: ${curso.students}`);
			const students = JSON.stringify(curso.students);
			console.log(students);

			texto +=
				`<tr>
						<td> ${curso.name} </td>
						<td> ${curso.value} </td>
						<td> ${curso.intensity}</td>
						<td> ${curso.modality} </td>
						<td> ${curso.state}</td>
						<td>
							<p>
							  <button class="btn btn-primary" type="submit" data-toggle="collapse" data-target="#collapseExample${curso.name}" aria-expanded="false" aria-controls="collapseExample${curso.name}" name="inscritos" value="${curso.name}">
							    estudiantes
							  </button>
							</p>
							<div class="collapse" id="collapseExample${curso.name}">
							  <div class="card card-body">
							     ${students}
							  </div>
							</div>
						</td>
						</tr> `;
		});
	});
	texto += '</tbody></table></form>';
	return texto;
});
