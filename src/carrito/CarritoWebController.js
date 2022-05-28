const config = require("../config/config");
const containerProducto = config.CONTAINER ? "../productos/dao/" + config.CONTAINER : "../productos/dao/Archivo";
const productoDAO = require(containerProducto);
const containerCarrito = config.CONTAINER ? "../carrito/dao/" + config.CONTAINER : "../carrito/dao/Archivo";
const carritoDAO = require(containerCarrito);
const mailer = require("../config/mailer");
const logger = require("../config/logger");
const { twilio, myNumber, myWhatsapp} = require("../config/twilio");

exports.listaItems = async (req, res) => {
    const { carrito } = req.session;
    return carrito || [];
}

const NOT_FOUND = { error: 'producto no encontrado' };

// api.post("/:id/productos", carritoController.addItem);
exports.addItem = async (req, res) => {
    let { carrito } = req.session;
    if (!carrito) {
        carrito = []
    }
    const p = await productoDAO.getById(req.params.id);
    if (p) {
        let producto = carrito.find(x => (x.producto.id || x.producto._id) === req.params.id)
        if (producto) {
            const idp = carrito.indexOf(producto);
            carrito[idp] = { ...producto, cantidad: (producto.cantidad + 1) }
            req.session.carrito = carrito;
        } else {
            const nuevo = { producto: p, cantidad: 1 }
            carrito.push(nuevo);
            req.session.carrito = carrito;
        }
    }
    res.redirect("/");
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
                req.session.messages[0] = NOT_FOUND;
                res.redirect("/")
            }
        } else {
            req.session.messages[0] = NOT_FOUND;
            res.redirect("/")
        }
    } catch (ex) {
        logger.error(ex)
        req.session.messages[0] = ex.message
        res.redirect("/")
    }

}

exports.guardar = async (req, res) => {
    try {
        let { carrito, email, username } = req.session;
        if (!carrito || carrito.length < 1) {
            req.session.messages[0] = "No puede terminar con el carrito vacío."

        } else {
            const compra = {}
            compra.timestamp = new Date();
            compra.productos = carrito;
            const saved = await carritoDAO.save(compra);
            req.session.carrito = [];
            try {
                await enviarEmail(username, email, compra.productos);
                textToBuyer(null, username, email);
            } catch (ex1) {
                req.session.messages[0] = ex1.message
            }
        }
        res.redirect("/")
    } catch (ex) {
        req.session.messages[0] = ex.message
        res.redirect("/")
    }
}

async function enviarEmail(username, email, productos) {
    let msg = "<div><h2>Felicidades! Compraste:</h2><ul>";
    msg = msg + productos.map(x => {
        return `<li>${x.producto.nombre}: ${x.cantidad}</li>`
    });
    msg = msg + "</ul></div>";
    const mailOptions = {
        from: 'no-reply@mistore.com',
        to: email,
        subject: `Nuevo pedido de ${username} - ${email}`,
        html: msg
    };

    const responseMailer = await mailer.sendMail(mailOptions);
    logger.info("mailer", responseMailer);
}

function textToBuyer(phoneNumer, username, email) {
    twilio.messages.create({
        from: myNumber,
        to: "+543764658709",
        body: `${username} hemos recibido su pedido y lo estamos procesando!`
    }).then(r => {
        logger.info("El mensaje se ha enviado correctamente.")
        logger.info(r)
    }).catch(e => logger.error(e));
    twilio.messages.create({
        from: "whatsapp:" + myWhatsapp,
        to: "whatsapp:+5493764658709",
        body: `Nuevo pedido de ${username} - ${email}`
    }).then(r => {
        logger.info("El whatsapp se ha enviado correctamente.")
        logger.info(r)
    }).catch(e => logger.error(e));
}








