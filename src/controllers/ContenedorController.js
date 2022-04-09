const {Contenedor} = require('../store/contenedor')
const contenedorProductos = new Contenedor('productos.json');
const contenedorCompras = new Contenedor('compras.json');
exports.contenedorProductos = contenedorProductos;
exports.contenedorCompras = contenedorCompras;