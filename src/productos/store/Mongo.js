const mongoose = require('mongoose');
require('dotenv').config();
const { Producto } = require("../models/Producto")

const connectionString = process.env.MONGO_URI
const connector = mongoose.connect(connectionString, {})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

(() => {
    Producto.insertMany([
        {
            "nombre": "Escuadra",
            "descripcion": "Escuadra",
            "precio": 120.0,
            "foto": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
            "stock": 10
        },
        {
            "nombre": "Calculadora",
            "descripcion": "Calculadora",
            "precio": 900,
            "foto": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
            "stock": 9
        },
        {
            "nombre": "Globo Terráqueo",
            "descripcion": "Globo Terráqueo",
            "precio": 1280,
            "foto": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
            "stock": 8
        },
        {
            "nombre": "Tablet",
            "descripcion": "Tablet",
            "precio": 4990,
            "foto": "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_tablet_mac_48px-256.png",
            "stock": 1
        },
        {
            "nombre": "Engrapadora",
            "descripcion": "Engrapadora",
            "precio": 1280,
            "foto": "https://cdn4.iconfinder.com/data/icons/basic-office-1/300/stapler-256.png",
            "stock": 6
        },
        {
            "nombre": "Regla Ultra matic",
            "descripcion": "Regla Ultra matic",
            "precio": 580,
            "foto": "https://cdn2.iconfinder.com/data/icons/lined-office-and-school-supplies/512/ruler-128.png",
            "stock": 5
        },
        {
            "nombre": "Libro 1",
            "descripcion": "Libro 1",
            "precio": 1700,
            "foto": "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/book-128.png",
            "stock": 4
        },
        {
            "nombre": "Libro 2",
            "descripcion": "descripcion",
            "precio": 2300,
            "foto": "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/book-128.png",
            "stock": 3
        },
        {
            "nombre": "Libro 3",
            "descripcion": "descripcion",
            "precio": 3350,
            "foto": "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/book-128.png",
            "stock": 2
        },
        {
            "nombre": "Libro 4",
            "descripcion": "descripcion",
            "precio": 4320,
            "foto": "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/book-128.png",
            "stock": 1
        },
    ])
})

class Contenedor {
    constructor() {
    }
    save = async (objeto) => {
        const obj = await this.getById(objeto._id || objeto.id);
        if (obj) {
            await Producto.updateOne({ "_id": (objeto._id || objeto.id) }, objeto)
        } else {
            await Producto.create(objeto);
        }
    }

    async getById(id) {
        const p = await Producto.findById(mongoose.Types.ObjectId(id))
        return p;
    }

    async getAll() {
        return await Producto.find({});
    }

    async deleteById(id) {
        return await Producto.findByIdAndDelete({ "_id": id });
    }

    async deleteAll() {
        await Producto.deleteMany({});
    }
}

module.exports = {
    Contenedor,
};