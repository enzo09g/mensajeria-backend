const fs = require('fs');
const jwt = require('jsonwebtoken')
const secretKey = "Mi clave super ultra secreta"

const register = (req, res) => {
    console.log(req.body)
    let data = req.body;
    data.mensajes = { "enviados": [], "recibidos": [] };
    fs.readFile('./json/usuarios.json', 'utf8', (err, archivo) => {
        const archivoUsuarios = JSON.parse(archivo)
        archivoUsuarios.push(data);
        const jsonArchivos = JSON.stringify(archivoUsuarios, null, 2);

        fs.writeFile('./json/usuarios.json', jsonArchivos, () => {
            console.log("Logrado")
            res.status(200).json({ "Data": "Logrado" })
        })
    })
}

const login = (req, res) => {
    let usuarioEncontrado = false;
    fs.readFile('./json/usuarios.json', 'utf8', (err, archivo) => {

        try {
            const archivoUsuarios = JSON.parse(archivo);
            const data = req.body;

            archivoUsuarios.forEach(element => {
                const { email, contraseña } = element;
                if (email == data.email && contraseña == data.contraseña) {
                    const token = jwt.sign({ email }, secretKey, { expiresIn: '30m' });
                    const datos = { ...element, token: token }

                    console.log("Logrado");
                    usuarioEncontrado = true;
                    res.status(200).json(datos)
                }
            })

            if (!usuarioEncontrado) {
                res.status(401).json({ "mensaje": "No se encontro ningun usuario" })
            }
        } catch (err) {
            res.status(400).json({ "Mensaje": err })
        }
    })
}

const middleCheck = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers['access-token'], secretKey)
        next()
    } catch (err) {
        res.status(401).json({ "Error": "Usuario no autorizado" })
    }
}

const check = (req, res) => {
    res.status(200).json({ "Mensaje": "Acceso autorizado" })
}

const send = (req, res) => {
    const { receptor, ...mensaje } = req.body;
    const nuevoMensajeRecibido = { ...mensaje, leido: false }
    const { emisor, ...nuevoMensajeEnviado } = req.body
    const rutaJsonUsuarios = './json/usuarios.json'
    let mensajeAgregado = false;
    

    fs.readFile(rutaJsonUsuarios, 'utf-8', (err, archivo) => {
        const jsonArchivo = JSON.parse(archivo);

        for (usuario of jsonArchivo) {
            if (usuario.email == receptor) {
                usuario.mensajes.recibidos.push(nuevoMensajeRecibido);
                mensajeAgregado = true;
                const aGuardar = JSON.stringify(jsonArchivo, null, 2)
                fs.writeFile(rutaJsonUsuarios, aGuardar, (err) => {
                    if (err) {
                        console.log("linea 83Error:" + err)
                        return res.status(500).json({ "Mensaje": "Error al guardar el archivo" })
                    }
                    console.log("Mensaje agregado")
                    return res.status(200).json({ "Mensaje": "Mensaje agregado" });
                })
            }
            if (usuario.email == mensaje.emisor) {
                usuario.mensajes.enviados.push(nuevoMensajeEnviado);
                const aGuardar2 = JSON.stringify(jsonArchivo, null, 2)
                fs.writeFile(rutaJsonUsuarios, aGuardar2, (err) => {
                    if (err) {
                        console.log({ "Error": err })
                    }
                })
            }
        }

        if (!mensajeAgregado) {
            res.status(400).json({ "Mensaje": "Receptor no encontrado" })
        }
    })

}

const getChats = (req, res) => {
    fs.readFile('./json/usuarios.json', 'utf8', (err, archivo) => {
        let contactos = []
        const arrayArchivo = JSON.parse(archivo)
        arrayArchivo.forEach(element => {
            const { mensajes, contraseña, ...nuevoObjeto } = element;
            contactos.push(nuevoObjeto)
        })
        contactos.sort((a, b) => a.nombre.localeCompare(b.nombre))
        const contactosFiltrado = contactos.filter(element => element.email != req.body.email)
        res.json(contactosFiltrado)
    })
}

const unreadMessages = (req, res) => {
    const ruta = './json/usuarios.json';
    const { email } = req.body;
    fs.readFile(ruta, 'utf8', (err, archivo) => {
        let emailEncontrado = false;
        let contador = 0
        const jsonArchivo = JSON.parse(archivo)
        for (let usuario of jsonArchivo) {
            if (usuario.email == email) {
                emailEncontrado = true;
                for (let mensaje of usuario.mensajes.recibidos) {
                    if (mensaje.leido == false) {
                        contador++
                    }
                }
                res.status(200).json({ "mensajesNoLeidos": contador })
            }
        }

        if (!emailEncontrado) {
            res.status(400).json({ "Mensaje": "Email no coincide" })
        }
    })
}


module.exports = {
    register,
    login,
    middleCheck,
    check,
    send,
    getChats,
    unreadMessages
}