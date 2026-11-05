class Equipo {
  #unidadesPrestadas;
  constructor(codigo, nombre, total, prestadas = 0, ubicacionFisica = 'Laboratorio Central') {
    if (!codigo.trim() || !nombre.trim() || !ubicacionFisica.trim())
      throw new Error('Debe completar el código, el nombre y la ubicación.');
    if (!Number.isInteger(total) || total < 1 ||
        !Number.isInteger(prestadas) || prestadas < 0 || prestadas > total)
      throw new Error('Las cantidades ingresadas no son válidas.');
    this.codigo = codigo.trim().toUpperCase();
    this.nombre = nombre.trim();
    this.total = total;
    this.#unidadesPrestadas = prestadas;
    this.ubicacionFisica = ubicacionFisica.trim();
  }
  get disponibles() { return this.total - this.#unidadesPrestadas; }
  get prestados() { return this.#unidadesPrestadas; }
  prestar() {
    if (this.disponibles === 0) throw new Error('No hay unidades disponibles para prestar.');
    this.#unidadesPrestadas++;
  }
  devolver() {
    if (this.#unidadesPrestadas === 0) throw new Error('No hay préstamos activos para este equipo.');
    this.#unidadesPrestadas--;
  }
  toJSON() {
    return { 
      codigo: this.codigo, 
      nombre: this.nombre,
      total: this.total, 
      prestadas: this.#unidadesPrestadas, 
      ubicacionFisica: this.ubicacionFisica 
    };
  }
}

class Inventario {
  #coleccionEquipos = new Map();
  agregar(equipo) {
    if (!(equipo instanceof Equipo)) throw new Error('El objeto debe ser una instancia de Equipo.');
    if (this.#coleccionEquipos.has(equipo.codigo)) throw new Error('Ya existe un equipo registrado con este código.');
    this.#coleccionEquipos.set(equipo.codigo, equipo);
  }
  buscar(criterio = '') {
    const textoBusqueda = criterio.trim().toLowerCase();
    return [...this.#coleccionEquipos.values()].filter(e =>
      (e.codigo + ' ' + e.nombre + ' ' + e.ubicacionFisica).toLowerCase().includes(textoBusqueda));
  }
  mover(codigo, accion) {
    const equipo = this.#coleccionEquipos.get(codigo);
    if (!equipo) throw new Error('El equipo especificado no existe.');
    if (accion === 'prestar') equipo.prestar();
    else if (accion === 'devolver') equipo.devolver();
    else throw new Error('Acción no reconocida.');
  }
  toJSON() { return [...this.#coleccionEquipos.values()]; }
  static desdeJSON(datos) {
    if (!Array.isArray(datos)) throw new Error('Formato de datos inválido.');
    const inventario = new Inventario();
    datos.forEach(d => inventario.agregar(
      new Equipo(d.codigo, d.nombre, d.total, d.prestadas, d.ubicacionFisica || 'Laboratorio Central')));
    return inventario;
  }
}