const express = require("express");
const carritoController = require("../CarritoController");
const api = express.Router();
const soloAdmin = require("../../middlewares/SoloAdmin")

//deberia estar deprecado... solo para testing
api.get("/", carritoController.listaCarritos);
//rutas
api.post("/", carritoController.newCarrito);
api.delete("/:id", soloAdmin, carritoController.deleteCarrito);
api.get("/:id/productos", carritoController.getCarrito);
api.post("/:id/productos", carritoController.addItem);
api.delete("/:id/productos/:prodId", carritoController.deleteItem);


module.exports = api;
