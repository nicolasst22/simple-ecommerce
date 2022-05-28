const {ContenedorArchivo} = require('./ContenedorArchivo')
const contenedorProductos = new ContenedorArchivo('./productos.json');
const contenedorCompras = new ContenedorArchivo('./compras.json');
exports.contenedorProductos = contenedorProductos;
exports.contenedorCompras = contenedorCompras;