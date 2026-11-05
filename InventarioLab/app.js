const CLAVE_STORAGE = 'labstock-v3';
const seleccionar = selector => document.querySelector(selector);
const mostrarMensaje = texto => { seleccionar('#mensaje').textContent = texto; };

let inventario = new Inventario();
try {
  const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
  if (datosGuardados !== null) inventario = Inventario.desdeJSON(JSON.parse(datosGuardados));
} catch (error) { mostrarMensaje('Error al cargar los datos: ' + error.message); }

function persistir() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(inventario));
    return 'Cambios guardados exitosamente.';
  } catch {
    return 'Cambios en memoria. No se pudo guardar en el navegador.';
  }
}

function renderizar() {
  const listaEquipos = inventario.buscar();
  const totalDisponibles = listaEquipos.reduce((acumulador, eq) => acumulador + eq.disponibles, 0);
  
  seleccionar('#resumen').textContent = `${listaEquipos.length} referencias registradas / ${totalDisponibles} unidades disponibles en total`;
  
  const contenedorFilas = seleccionar('#filas');
  contenedorFilas.replaceChildren();
  
  for (const eq of inventario.buscar(seleccionar('#busqueda').value)) {
    const fila = document.createElement('tr');

    for (const valorCelda of [eq.codigo, eq.nombre, eq.ubicacionFisica, eq.total]) {
      const celda = document.createElement('td');
      celda.textContent = valorCelda;
      fila.append(celda);
    }
    
    const celdaDisponibles = document.createElement('td');
    if (eq.disponibles <= 2) {
      celdaDisponibles.innerHTML = `${eq.disponibles} <span style="color: #c0392b; font-weight: bold;">¡Stock bajo!</span>`;
    } else {
      celdaDisponibles.textContent = eq.disponibles;
    }
    fila.append(celdaDisponibles);

    const celdaPrestados = document.createElement('td');
    celdaPrestados.textContent = eq.prestados;
    fila.append(celdaPrestados);

    const celdaAcciones = document.createElement('td');
    ['prestar', 'devolver'].forEach(accion => {
      const boton = document.createElement('button');
      boton.textContent = accion === 'prestar' ? 'Prestar' : 'Devolver';
      boton.dataset.codigo = eq.codigo;
      boton.dataset.accion = accion;
      boton.disabled = accion === 'prestar' ? eq.disponibles === 0 : eq.prestados === 0;
      celdaAcciones.append(boton);
    });
    
    fila.append(celdaAcciones);
    contenedorFilas.append(fila);
  }
  
  if (!contenedorFilas.children.length) {
    const filaVacia = contenedorFilas.insertRow();
    const celdaVacia = filaVacia.insertCell();
    celdaVacia.colSpan = 7;
    celdaVacia.textContent = 'No se encontraron equipos registrados.';
  }
}

seleccionar('#registro').addEventListener('submit', evento => {
  evento.preventDefault();
  try {
    const formularioDatos = new FormData(evento.currentTarget);
    inventario.agregar(new Equipo(
      formularioDatos.get('codigo'),
      formularioDatos.get('nombre'),
      Number(formularioDatos.get('total')),
      0,
      formularioDatos.get('ubicacion')
    ));
    mostrarMensaje(persistir());
    evento.currentTarget.reset();
    seleccionar('#registro [name="ubicacion"]').value = 'Laboratorio Central';
    renderizar();
  } catch (err) { mostrarMensaje(err.message); }
});

seleccionar('#busqueda').addEventListener('input', renderizar);

seleccionar('#filas').addEventListener('click', evento => {
  const botonPresionado = evento.target.closest('button[data-accion]');
  if (!botonPresionado) return;
  try {
    inventario.mover(botonPresionado.dataset.codigo, botonPresionado.dataset.accion);
    mostrarMensaje(persistir());
    renderizar();
  } catch (err) { mostrarMensaje(err.message); }
});

renderizar();