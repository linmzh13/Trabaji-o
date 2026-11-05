# LabStock: inventario de laboratorio

Ejemplo didáctico de HTML, CSS y JavaScript orientado a objetos.
Requiere un navegador actualizado y no usa librerías externas.

## Ejecución

En esta carpeta ejecute `python -m http.server 8000` y abra
http://localhost:8000. Python se usa únicamente para servir los archivos.

Registre MUL-01 / Multimetro / 5 y ARD-01 / Kit Arduino / 3.
Pruebe búsqueda, préstamo, devolución y recarga de la página.

`modelo.js`: Equipo e Inventario. `app.js`: eventos, DOM y persistencia.
`index.html`: estructura. `estilos.css`: presentación adaptable.

Cada registro agrupa unidades de la misma referencia. Cada movimiento
presta o devuelve una unidad. Los datos se conservan en localStorage del
navegador y origen actuales. No hay sincronización multiusuario ni registro
de responsables. Si falla el guardado, la aplicación lo comunica y el cambio
solo permanece en memoria. Los atributos codigo, nombre y total son públicos
por simplicidad didáctica: no los modifique directamente desde la interfaz.
