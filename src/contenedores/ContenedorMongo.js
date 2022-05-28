const mongoose = require('mongoose');
const config = require("../config/config");
const connectionString = config.MONGO_URI
const connector = mongoose.connect(connectionString, {})
const db = mongoose.connection;
const logger = require("../config/logger")
db.on("error", console.error.bind(console, "MongoDB connection error"));

class ContenedorMongo {

    constructor(Model) {
        this.model = Model
    }
    
    save = async (objeto) => {
        const Model = this.model;
        const obj = await this.getById(objeto._id || objeto.id);
        if (obj) {
            await Model.updateOne({ "_id": (objeto._id || objeto.id) }, objeto)
        } else {
            await Model.create(objeto);
        }
    }

    async getById(id) {
        const Model = this.model;
        const p = await Model.findById(mongoose.Types.ObjectId(id))
        return p;
    }

    async getAll() {
        const Model = this.model;
        return await Model.find({});
    }

    async deleteById(id) {
        const Model = this.model;
        return await Model.findByIdAndDelete({ "_id": id });
    }

    async deleteAll() {
        const Model = this.model;
        await Model.deleteMany({});
    }
}

module.exports = {
    ContenedorMongo
};