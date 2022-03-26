require('dotenv').config();
const container = process.env.CONTAINER ? "./store/" + process.env.CONTAINER : "./store/contenedor";
var { Contenedor } = require(container);
const contenedor = new Contenedor("compras");

let nextId = 1;

const nextID = () => {
    return nextId++;
}
//@deprecated
exports.listaCarritos = async (req, res) => {
    res.json(await contenedor.getAll())
}

const NOT_FOUND = { error: 'producto no encontrado' };
// api.post("/", carritoController.newCarrito);

exports.newCarrito = async (req, res) => {
    const compra = {}
    compra.timestamp = new Date();
    compra.productos = [];
    const saved = await contenedor.save(compra)
    res.json(saved)
}


// api.delete("/:id", carritoController.deleteCarrito);
exports.deleteCarrito = async (req, res) => {
    if (await contenedor.getById(parseId(req.params.id))) {
        await contenedor.deleteById(parseId(req.params.id));
        res.json({ mensaje: "Objeto eliminado" });
    }
    res.status(404).json(NOT_FOUND);
}

// api.get("/:id/productos", carritoController.getCarrito);
exports.getCarrito = async (req, res) => {
    const result = await contenedor.getById(parseId(req.params.id));
    if (result) {
        res.json(result.productos);
    } else {
        res.status(404).json(NOT_FOUND)
    }
}



// api.post("/:id/productos", carritoController.addItem);
exports.addItem = async (req, res) => {
    const { body } = req;
    const result = await contenedor.getById(parseId(req.params.id));
    if (result) {
        const { productos } = result;
        let producto = productos.find(x => x.id === parseId(body.id))
        if (producto) {
            const idp = productos.indexOf(producto);
            productos[idp] = { ...producto, cantidad: (producto.cantidad + 1) }
            contenedor.save(result);
            res.json(productos[idp]);
        } else {
            const nuevo = { ...body, cantidad: 1 }
            productos.push(nuevo);
            const a = await contenedor.save(result);
            console.log("a", a);
            res.json(nuevo);
        }

    } else {
        res.status(404).json(NOT_FOUND)
    }
}

const parseId = (id) => {
    return isNaN(id) ? id : parseInt(id)
}

// api.delete("/:id/productos/:prodId", carritoController.deleteProducto);
exports.deleteItem = async (req, res) => {
    try {
        let result = await contenedor.getById(parseId(req.params.id));
        if (result) {
            const { productos } = result;
            let producto = productos.find(x => x.id === parseId(req.params.prodId))
            if (producto) {
                const idx = productos.indexOf(producto);
                productos.splice(idx, 1);
                contenedor.save(result);
                return res.json({ mensaje: "Objeto eliminado" });
            } else {
                res.status(404).json(NOT_FOUND);
            }
        } else {
            res.status(404).json(NOT_FOUND);
        }
    } catch (ex) {
        console.error(ex)
        res.status(500).json(ex.message)
    }

}







