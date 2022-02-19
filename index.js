const express = require("express");
const path = require("path")
const productosAPI = require("./src/routes/productosAPI")
const carritoAPI = require("./src/routes/carritoAPI")

const app = express();
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const PORT = process.env.PORT

//vistas para todos
//app.set("views", path.join(__dirname, "src", "views"))

//SET EJS
//app.set("view engine", "ejs")

app.use("/public", express.static(path.join(__dirname, "public")))
app.use("/api/productos", productosAPI)
app.use("/api/carrito", carritoAPI)

app.get("/", (req, res) => {
    res.send("Carrito v0.1")
})

//otras rutas
app.use("*", (req, res) =>{
    res.send(
        { error : -2, descripcion: `ruta '${req.baseUrl}' método '${req.method}' no implementada`}
    )
   
})

// // Middleware manejo de errores
// app.use((error, req, res, next) => {
//     res.send("Error:", error.message || error);
// });


app.listen(PORT, () => {
    console.log(`Escuchando en puerto ${PORT}`)
})

