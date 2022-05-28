//[{"timestamp":"2022-02-19T17:53:41.112Z",
//"productos":[{"nombre":"Globo Terráqueo","descripcion":"Globo Terráqueo miniatura para estudiar geografía","codigo":"GlobTerr","precio":346,"foto":"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png","stock":3,"id":2,"cantidad":1}],"id":1}]

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//[{"stock":5,"id":2}]

const CompraSchema = new Schema(
    {
        productos: [],
        timestamp: Date

    }
)

const Compra = mongoose.model("compras", CompraSchema);
module.exports = {
    Compra
}