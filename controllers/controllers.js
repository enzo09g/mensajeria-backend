const fs = require('fs');
const jwt = require('jsonwebtoken')
const secretKey = "Mi clave super ultra secreta"

const register = (req, res) => {
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
                    const token = jwt.sign({ email }, secretKey, { expiresIn: '3m' });
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
                        return res.status(500).json({ "Mensaje": "Error al guardar el archivo" })
                    }
                    return res.status(200).json({ "Mensaje": "Mensaje agregado" });
                })
                break;
            }
            if (usuario.email == mensaje.emisor) {
                usuario.mensajes.enviados.push(nuevoMensajeEnviado);
                const aGuardar2 = JSON.stringify(jsonArchivo, null, 2)
                fs.writeFile(rutaJsonUsuarios, aGuardar2, (err) => {
                    console.log({ "Error": err })
                })
            }
        }

        if (!mensajeAgregado) {
            res.status(400).json({ "Mensaje": "Receptor no encontrado" })
        }
    })

}


module.exports = {
    register,
    login,
    middleCheck,
    check,
    send
}