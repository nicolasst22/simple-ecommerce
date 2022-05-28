const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//[{"stock":5,"id":2}]
const ProductoSchema = new Schema(
    {
        nombre: String,
        descripcion: String,
        codigo: String,
        precio: Number,
        foto: String,
        stock: Number,
    }
)

const Producto = mongoose.model("productos", ProductoSchema);
module.exports = {
    Producto
}