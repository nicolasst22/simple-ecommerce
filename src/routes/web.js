const express = require("express");
const carritoController = require("../carrito/CarritoWebController");
const api = express.Router();

api.get("/productos", carritoController.listaItems);
api.get("/add/:id", carritoController.addItem);
api.get("/del/:prodId", carritoController.deleteItem);
api.post("/terminar", carritoController.guardar);


module.exports = api;