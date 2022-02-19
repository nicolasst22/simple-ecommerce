const { admin } = require("../config/config");

const soloAdmin = (req, res, next) => {
    if (!admin) {
        res.status(401).json({
            error: -1,
            descripcion: `ruta '${req.baseUrl}' método '${req.method}' no autorizada`,
            solution: "Cambie la variable admin  dentro de /config/config.js a trusy"
        })
    } else {
        next();
    }
}

module.exports = soloAdmin;