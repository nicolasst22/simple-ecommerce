const passport = require('passport');
const LocalPassport = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');
const usuarioServices = require("./services")
const bcrypt = require("bcrypt");
const config = require("../config/config");


passport.use("login", new LocalPassport({ passReqToCallback: true }, (req, username, password, done) => {
    Usuario.findOne({ email: username }, (err, usuario) => {
        if (err) {
            return done(err);
        }
        if (!usuario) {
            return done(null, false);
        }
        if (!bcrypt.compareSync(password, usuario.password)) {
            return done(null, false, { message: 'Usuario o contraseña incorrectos' });
        }
        req.session.username = usuario.nombre;
        req.session.email = usuario.email;
        req.session.save()
        return done(null, usuario);
    });
}));

passport.use("register", new LocalPassport({ passReqToCallback: true },(req,username, password, done) => {
    const {nombre, edad, direccion, telefono} = req.body;
    const avatar = req.files[0].filename;
        usuarioServices.registrar(nombre, edad, direccion, telefono, avatar, username, password, (err, usuario) => {
        if(err){
            req.session.messages = [err]
            done(null, false)
        }else{
            req.session.username = nombre;
            done(null, usuario);
        }
    })
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (id, cb) {
    Usuario.findById(id, (err, user) => {
        cb(err, user);
    });
});

module.exports = passport;