require('dotenv').config();
let admin = 1;
const PORT =  process.env.PORT;
const MONGO_URI =  process.env.MONGO_URI;
const SECRET = process.env.SECRET || "probando";
const CONTAINER = process.env.CONTAINER || "Archivo";


module.exports = { 
    admin, 
    PORT, 
    MONGO_URI,
    SECRET,
    CONTAINER
 };