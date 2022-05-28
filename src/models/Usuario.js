const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        nombre: {
            type: String,
            trim: true,
            required: [true, "El nombre es requerido"]
        },
        telefono: {
            type: String,
            trim: true,
            required: [true, "El teléfono es requerido"]
        },
        direccion: {
            type: String,
            trim: true,
            required: [true, "La dirección es requerido"]
        },
        edad: {
            type: Number,
            trim: true,
            required: [true, "Edad requerida"]
        },
        email: {
            type: String,
            trim: true,
            required: [true, "El email es requerido"],
            unique: true,
            match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
        },
        password: {
            type: String,
            required: [true, "El password es requerido"]
        },
        avatar: {
            type: String,
            trim: true
        },
    }
)

const Usuario = mongoose.model("usuarios", UserSchema);
module.exports = Usuario
