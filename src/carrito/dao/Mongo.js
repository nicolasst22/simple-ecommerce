const mongoose = require('mongoose');
const config = require("../../config/config");
const connectionString = config.MONGO_URI
const connector = mongoose.connect(connectionString, {})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
const {ContenedorMongo} = require('../../contenedores/ContenedorMongo');
const {Compra}  = require('../../models/Carrito');

class CarritoMongo extends ContenedorMongo {
    constructor() {
        super(Compra)
    }
    
}

module.exports = new CarritoMongo();