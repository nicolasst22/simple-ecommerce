require('dotenv').config();
const container = process.env.CONTAINER ? "./store/" + process.env.CONTAINER : "./store/contenedor";
var { Contenedor } = require(container);
const contenedor = new Contenedor("productos");

exports.listaProductos = async (req, res) => {
    res.json(await contenedor.getAll())
}

const NOT_FOUND = { error: 'producto no encontrado' };
exports.getProducto = async (req, res) => {
    try {
        const result = await contenedor.getById(req.params.id);
        if (result) {
            res.json(result);
        } else {
            res.status(404).json(NOT_FOUND)
        }
    } catch (ex) {
        console.error(ex)
        res.status(500).json({ error: "error" });
    }
}

exports.newProducto = async (req, res) => {
    const body = req.body;
    const nuevo = await contenedor.save(body)
    res.json(nuevo || body)
}

exports.updateProducto = async (req, res) => {
    const body = req.body;
    if (await contenedor.getById(req.params.id)) {
        body.id = req.params.id
        const nuevo = await contenedor.save(body)
        res.json(nuevo || body)
    } else {
        res.status(404).json(NOT_FOUND);
    }
}

exports.deleteProducto = async (req, res) => {
    if (await contenedor.getById(req.params.id)) {
        await contenedor.deleteById(req.params.id);
        res.json({ mensaje: "Objeto eliminado" });
    }
    res.status(404).json(NOT_FOUND);
}


