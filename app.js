const API_URL = "https://100.29.233.187/alumnos";

function mostrarSeccion(id, btn) {
  document.querySelectorAll(".seccion").forEach(function(s) {
    s.classList.add("oculto");
  });
  document.querySelectorAll(".nav-btn").forEach(function(b) {
    b.classList.remove("active");
  });
  document.getElementById("sec-" + id).classList.remove("oculto");
  if (btn) btn.classList.add("active");
  ocultarMensaje();
}

function mostrarMensaje(texto, tipo) {
  var div = document.getElementById("mensaje");
  div.textContent = texto;
  div.className = "mensaje " + tipo;
}

function ocultarMensaje() {
  var div = document.getElementById("mensaje");
  div.className = "mensaje oculto";
  div.textContent = "";
}

async function agregarAlumno() {
  var matricula = document.getElementById("ag-matricula").value;
  var nombre    = document.getElementById("ag-nombre").value;
  var domicilio = document.getElementById("ag-domicilio").value;
  var fechanac  = document.getElementById("ag-fechanac").value;
  var sexo      = document.getElementById("ag-sexo").value;
  var status    = document.getElementById("ag-status").value;

  if (!matricula || !nombre || !domicilio || !fechanac || !sexo) {
    mostrarMensaje("Por favor llena todos los campos.", "error");
    return;
  }

  var alumno = {
    matricula: matricula,
    nombre:    nombre,
    domicilio: domicilio,
    fechanac:  fechanac,
    sexo:      sexo,
    status:    Number(status)
  };

  try {
    var respuesta = await fetch(API + "/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumno)
    });
    var datos = await respuesta.json();

    if (respuesta.ok) {
      mostrarMensaje("Alumno agregado correctamente. ID asignado: " + datos.id, "ok");
    } else {
      mostrarMensaje("Error: " + datos.error, "error");
    }
  } catch (e) {
    mostrarMensaje("No se pudo conectar con la API.", "error");
  }
}

async function listarAlumnos() {
  var contenedor = document.getElementById("tabla-container");
  contenedor.innerHTML = "<p style='color:#9ca3af;'>Cargando...</p>";

  try {
    var respuesta = await fetch(API + "/todos");
    var alumnos   = await respuesta.json();

    if (!respuesta.ok) {
      contenedor.innerHTML = "<p style='color:red;'>Error al cargar los alumnos.</p>";
      return;
    }

    if (alumnos.length === 0) {
      contenedor.innerHTML = "<p style='color:#9ca3af;'>No hay alumnos registrados.</p>";
      return;
    }

    var tabla = "<table>";
    tabla += "<thead><tr><th>ID</th><th>Matrícula</th><th>Nombre</th><th>Domicilio</th><th>Fecha Nac.</th><th>Sexo</th><th>Status</th></tr></thead><tbody>";

    for (var i = 0; i < alumnos.length; i++) {
      var a = alumnos[i];
      var badge = a.status == 1
        ? '<span class="badge badge-activo">Activo</span>'
        : '<span class="badge badge-inactivo">Inactivo</span>';
      tabla += "<tr>";
      tabla += "<td><strong>" + a.id + "</strong></td>";
      tabla += "<td>" + a.matricula + "</td>";
      tabla += "<td>" + a.nombre + "</td>";
      tabla += "<td>" + a.domicilio + "</td>";
      tabla += "<td>" + a.fechanac.split("T")[0] + "</td>";
      tabla += "<td>" + a.sexo + "</td>";
      tabla += "<td>" + badge + "</td>";
      tabla += "</tr>";
    }

    tabla += "</tbody></table>";
    contenedor.innerHTML = tabla;

  } catch (e) {
    contenedor.innerHTML = "<p style='color:red;'>No se pudo conectar con la API.</p>";
  }
}

async function buscarPorId() {
  var id     = document.getElementById("inp-bid").value;
  var resDiv = document.getElementById("res-bid");

  if (!id) { mostrarMensaje("Ingresa un ID.", "error"); return; }

  resDiv.className = "";
  resDiv.innerHTML = "";

  try {
    var respuesta = await fetch(API + "/" + id);
    var datos     = await respuesta.json();

    resDiv.classList.add("visible");
    if (respuesta.ok) {
      var statusTexto = datos.status == 1 ? "Activo" : "Inactivo";
      resDiv.innerHTML =
        "<strong>ID:</strong> " + datos.id + " &nbsp;|&nbsp; " +
        "<strong>Matrícula:</strong> " + datos.matricula + "<br>" +
        "<strong>Nombre:</strong> " + datos.nombre + "<br>" +
        "<strong>Domicilio:</strong> " + datos.domicilio + "<br>" +
        "<strong>Fecha Nac.:</strong> " + datos.fechanac.split("T")[0] + " &nbsp;|&nbsp; " +
        "<strong>Sexo:</strong> " + datos.sexo + " &nbsp;|&nbsp; " +
        "<strong>Status:</strong> " + statusTexto;
    } else {
      resDiv.innerHTML = datos.error;
    }
  } catch (e) {
    resDiv.classList.add("visible");
    resDiv.innerHTML = "No se pudo conectar con la API.";
  }
}

async function buscarPorMatricula() {
  var matricula = document.getElementById("inp-bmat").value;
  var resDiv    = document.getElementById("res-bmat");

  if (!matricula) { mostrarMensaje("Ingresa una matrícula.", "error"); return; }

  resDiv.className = "";
  resDiv.innerHTML = "";

  try {
    var respuesta = await fetch(API + "/matricula/" + matricula);
    var datos     = await respuesta.json();

    resDiv.classList.add("visible");
    if (respuesta.ok) {
      var statusTexto = datos.status == 1 ? "Activo" : "Inactivo";
      resDiv.innerHTML =
        "<strong>ID:</strong> " + datos.id + " &nbsp;|&nbsp; " +
        "<strong>Matrícula:</strong> " + datos.matricula + "<br>" +
        "<strong>Nombre:</strong> " + datos.nombre + "<br>" +
        "<strong>Domicilio:</strong> " + datos.domicilio + "<br>" +
        "<strong>Fecha Nac.:</strong> " + datos.fechanac.split("T")[0] + " &nbsp;|&nbsp; " +
        "<strong>Sexo:</strong> " + datos.sexo + " &nbsp;|&nbsp; " +
        "<strong>Status:</strong> " + statusTexto;
    } else {
      resDiv.innerHTML = datos.error;
    }
  } catch (e) {
    resDiv.classList.add("visible");
    resDiv.innerHTML = "No se pudo conectar con la API.";
  }
}

async function actualizarAlumno() {
  var id        = document.getElementById("up-id").value;
  var nombre    = document.getElementById("up-nombre").value;
  var domicilio = document.getElementById("up-domicilio").value;
  var fechanac  = document.getElementById("up-fechanac").value;
  var sexo      = document.getElementById("up-sexo").value;
  var status    = document.getElementById("up-status").value;

  if (!id) {
    mostrarMensaje("Ingresa el ID del alumno a actualizar.", "error");
    return;
  }

  var datos = {};
  if (nombre)    datos.nombre    = nombre;
  if (domicilio) datos.domicilio = domicilio;
  if (fechanac)  datos.fechanac  = fechanac;
  if (sexo)      datos.sexo      = sexo;
  if (status !== "") datos.status = Number(status);

  try {
    var respuesta = await fetch(API + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    var resultado = await respuesta.json();

    if (respuesta.ok) {
      mostrarMensaje("Alumno actualizado correctamente.", "ok");
    } else {
      mostrarMensaje("Error: " + resultado.error, "error");
    }
  } catch (e) {
    mostrarMensaje("No se pudo conectar con la API.", "error");
  }
}

async function borrarAlumno() {
  var id     = document.getElementById("inp-del").value;
  var resDiv = document.getElementById("res-del");

  if (!id) { mostrarMensaje("Ingresa un ID.", "error"); return; }

  var confirmar = confirm("¿Seguro que deseas borrar al alumno con ID " + id + "?");
  if (!confirmar) return;

  resDiv.className = "";
  resDiv.innerHTML = "";

  try {
    var respuesta = await fetch(API + "/" + id, { method: "DELETE" });
    var datos     = await respuesta.json();

    resDiv.classList.add("visible");
    if (respuesta.ok) {
      resDiv.innerHTML = datos.mensaje;
      mostrarMensaje("Alumno eliminado correctamente.", "ok");
    } else {
      resDiv.innerHTML = datos.error;
    }
  } catch (e) {
    resDiv.classList.add("visible");
    resDiv.innerHTML = "No se pudo conectar con la API.";
  }
}