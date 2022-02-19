// const { carritos } = require("../store/store")
const { contenedorCompras: contenedor } = require("./ContenedorController")

let nextId = 1;

const nextID = () => {
    return nextId++;
}
//@deprecated
exports.listaCarritos = (req, res) => {
    res.json(contenedor.getAll())
}

const NOT_FOUND = { error: 'producto no encontrado' };
// api.post("/", carritoController.newCarrito);

exports.newCarrito = (req, res) => {
    const compra = {}
    compra.timestamp = new Date();
    compra.productos = [];
    contenedor.save(compra)
    res.json(compra)
}


// api.delete("/:id", carritoController.deleteCarrito);
exports.deleteCarrito = (req, res) => {
    if (contenedor.getById(parseInt(req.params.id))) {
        contenedor.deleteById(parseInt(req.params.id));
        res.json({ mensaje: "Objeto eliminado" });
    }
    res.status(404).json(NOT_FOUND);
}

// api.get("/:id/productos", carritoController.getCarrito);
exports.getCarrito = (req, res) => {
    const result = contenedor.getById(parseInt(req.params.id));
    if (result) {
        res.json(result.productos);
    } else {
        res.status(404).json(NOT_FOUND)
    }
}



// api.post("/:id/productos", carritoController.addItem);
exports.addItem = (req, res) => {
    const { body } = req;
    const result = contenedor.getById(parseInt(req.params.id));
    if (result) {
        const { productos } = result;
        let producto = productos.find(x => x.id === parseInt(body.id))
        if (producto) {
            const idp = productos.indexOf(producto);
            productos[idp] = { ...producto, cantidad: (producto.cantidad + 1) }
            contenedor.save(result);
            res.json(productos[idp]);
        } else {
            const nuevo = { ...body, cantidad: 1 }
            productos.push(nuevo);
            contenedor.save(result);
            res.json(nuevo);
        }

    } else {
        res.status(404).json(NOT_FOUND)
    }
}

// api.delete("/:id/productos/:prodId", carritoController.deleteProducto);
exports.deleteItem = (req, res) => {
    let result = contenedor.getById(parseInt(req.params.id));
    if (result) {
        const { productos } = result;
        let producto = productos.find(x => x.id === parseInt(req.params.prodId))
        if (producto) {
            const idx = productos.indexOf(producto);
            productos.splice(idx, 1);
            contenedor.save(result);
            return res.json({ mensaje: "Objeto eliminado" });
        }
    }
    res.status(404).json(NOT_FOUND);
}







