const fs = require('fs');
const jwt = require('jsonwebtoken')
const secretKey = "Mi clave super ultra secreta"

const register = (req, res) => {
    const data = req.body;
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

                    console.log("Logrado");
                    usuarioEncontrado = true;
                    res.status(200).json({ token })
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
        console.log(req.headers)
        const decoded = jwt.verify(req.headers['access-token'], secretKey)
        console.log(decoded)
        console.log("Llego aca y lo acepte")
        next()
    } catch (err) {
        console.log("Llego aca y lo rechace")
        res.status(401).json({ "Error": "Usuario no autorizado" })
    }
}

const check = (req, res) => {
    res.status(200).json({ "Mensaje": "Acceso autorizado" })
}


module.exports = {
    register,
    login,
    middleCheck,
    check
}