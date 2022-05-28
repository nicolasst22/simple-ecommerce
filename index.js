const express = require("express");
const path = require("path")
const productosAPI = require("./src/productos/api/productosAPI")
const carritoAPI = require("./src/carrito/api/carritoAPI")
const carritoWEB = require("./src/routes/web");
const config = require("./src/config/config")
const expressSession = require("express-session")
const cookieParser = require("cookie-parser");
const PORT = config.PORT;
const { Server: HttpServer } = require("http");
const MongoStore = require("connect-mongo")
const passport = require('./src/usuarios/passport');
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatars//')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname) //Appending .jpg
    }
})

var upload = multer({ storage: storage });

const yargs = require('yargs/yargs')(process.argv.slice(2))
const args = yargs
    .default({
        port: config.PORT || 8080,
        modo: "FORK",
    }).alias({
        p: 'port',
        m: "modo"
    })
    .argv

const logger = require("./src/config/logger");

const mongoStoreConfig = {
    mongoUrl: config.MONGO_URI
}

const MINUTOS = 10;
const app = express();
const http = new HttpServer(app);
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(expressSession({
    secret: config.SECRET,
    secure: false,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreConfig),
    cookie: {
        maxAge: 1000 * 60 * MINUTOS,
        secure: false,
    }
}))
app.use(passport.initialize());
app.use(passport.session());

//vistas para todos
app.set("views", path.join(__dirname, "src", "views"))

//SET EJS
app.set("view engine", "ejs")

//middleware que contra si esta logueado
const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.use((req, res, next) => {
    logger.info(`${req.method}: ${req.path}`);
    next();
})

app.use("/public", express.static(path.join(__dirname, "public")))
app.use("/api/productos", productosAPI)
app.use("/api/carrito", carritoAPI)
app.use("/carrito", auth, carritoWEB)


app.get("/", auth, (req, res) => {
    const { username, carrito } = req.session;
    res.render("index", { username, items: (carrito) ? carrito.length : 0 })
})

app.get("/carrito", auth, (req, res) => {
    const { carrito } = req.session;
    res.render("carrito", { productos: carrito })
})


app.get("/login", (req, res,) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        const msg = { error: req.session.messages ? req.session.messages[0] : undefined }
        req.session.messages = []
        res.render("login", msg)
    }
})

app.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "login",
    failureMessage: "Invalid username or password"
}))

app.get("/logout", auth, (req, res) => {
    const { username } = req.session;
    req.session.destroy(err => {
        if (err) {
            res.send("Ha ocurrido un error")
        } else {
            req.logout();
            res.render("logout", { username })
        }
    })
})

app.get("/registro", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        const msg = { error: req.session.messages ? req.session.messages[0] : undefined }
        req.session.messages = []
        res.render("registro", msg)
    }
})

app.post("/registro", upload.array("avatar"), passport.authenticate("register", {
    successRedirect: "/",
    failureRedirect: "/registro",
    failWithError: true
}))

// app.post("/registro", upload.array("avatar"), (req, res) => {
//     //console.log(req.files[0].filename);

//     res.json(req.body);
// })


//otras rutas
app.use("*", (req, res) => {
    const msg = `${req.method}: ${req.path} not found`;
    logger.warn(msg);
    res.send(
        { error: -2, descripcion: `ruta '${req.baseUrl}' método '${req.method}' no implementada` }
    )
})

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    logger.error("error", err);
    res.status(err.status || 500);
    res.render('error');
});


const numCPUs = require("os").cpus().length;

if (args.modo.toUpperCase() === "CLUSTER") {
    const cluster = require("cluster");
    if (cluster.isMaster) {
        logger.info(`Master con pid ${process.pid}`);
        for (i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on("exit", (worker, code, signal) => {
            logger.info(`el worker pid ${worker} termino con exit ${code}`);
            cluster.fork();
        })
    } else {
        logger.info(`Worker con pid ${process.pid}`);
        http.listen(args.port, err => {
            //console.log(`Server iniciado ${PORT} `)
        })
    }
} else {
    http.listen(args.port, err => {
        logger.info(`Server iniciado ${args.port} `)
    })
}


