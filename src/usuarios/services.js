
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const services = {};
const logger = require("../config/logger");
const mailer = require("../config/mailer");

services.registrar = async (nombre, edad, direccion, telefono, avatar, email, password, done) => {
    Usuario.findOne({ email }, (err, usuario) => {
        if (err) {
            return done(err.message);
        }
        if (usuario) {
            return done("Email ya está registrado");
        } else {
            Usuario.create({ nombre, edad, direccion, telefono, avatar, email, password: bcrypt.hashSync(password, 1033) }, async (err, newUsuario) => {
                if (err) {
                    done(err.message);
                }
                else {
                    await enviarEmail(newUsuario.nombre, newUsuario.email);
                    done(null, newUsuario)
                }
            });
        }
    })
}

services.registrarOLD = (req, res, done) => {
    const { nombre, apellido, email, password } = req.body;
    Usuario.findOne({ email }, (err, usuario) => {
        if (err)
            done(err);

        if (usuario) {
            res.render('registro', { email: "Email ya está registrado" });
        } else {
            Usuario.create({ nombre, apellido, email, password: bcrypt.hashSync(password, 1033) }, (err, newUsuario) => {
                if (err) {
                    res.render('registro', { error: "Ha ocurrido un error inesperdado." });
                }
                else {
                    res.redirect('/');
                }
            });
        }
    })
}

services.loginFB = (nombre, apellido, email, password, facebookId, cb) => {
    Usuario.findOne({ email }, (err, usuario) => {
        if (err)
            cb(err)

        if (usuario) {
            usuario.facebookId = facebookId;
            usuario.save();
            cb(null, usuario);
        } else {
            Usuario.create({ nombre, apellido, email, password, facebookId }, (err, newUsuario) => {
                if (err) {
                    cb(err)
                }
                else {
                    cb(null, newUsuario);
                }
            });
        }
    })
}

async function enviarEmail(username, email) {
    const mailOptions = {
        from: 'no-reply@mistore.com',
        to: email,
        subject: `Nuevo registro de usuario`,
        text: `Se registro ${username} con el mail ${email}`
    };
    const responseMailer = await mailer.sendMail(mailOptions);
    logger.info("mailer", responseMailer);
}




module.exports = services;