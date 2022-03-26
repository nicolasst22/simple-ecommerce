const mongoose = require('mongoose');
require('dotenv').config();
const { Compra } = require("../models/Carrito")

const connectionString = process.env.MONGO_URI
const connector = mongoose.connect(connectionString, {})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

class Contenedor {
    constructor() {
        console.log("mongo carrito");
    }
    save = async (objeto) => {
        const obj = await this.getById(objeto._id || objeto.id);
        if (obj) {
            await Compra.updateOne({ "_id": (objeto._id || objeto.id) }, objeto)
            return objeto;
        } else {
            return await Compra.create(objeto);
        }
    }

    async getById(id) {
        const p = await Compra.findById(mongoose.Types.ObjectId(id))
        return p;
    }

    async getAll() {
        console.log("getall")
        return await Compra.find({});
    }

    async deleteById(id) {
        return await Compra.findByIdAndDelete({ "_id": id });
    }

    async deleteAll() {
        await Compra.deleteMany({});
    }
}

module.exports = {
    Contenedor,
};