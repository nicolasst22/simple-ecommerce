const express = require("express");
const productoController = require("../controllers/ProductoController");
const api = express.Router();
const soloAdmin = require("../middlewares/SoloAdmin")

api.get("/", productoController.listaProductos);
api.get("/:id", productoController.getProducto);
api.post("/", productoController.newProducto);
api.put("/:id", productoController.updateProducto);
api.delete("/:id", soloAdmin, productoController.deleteProducto);

module.exports = api;
