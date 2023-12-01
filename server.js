const express = require('express');
const jwt = require("jsonwebtoken");
const mariadb = require('mariadb');
const cors = require('cors');

const port = 3000;
const secret_key = "123";

let tokenGral;

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.static(__dirname));

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '2307',
    database: 'actividad20',
});

function verificarToken(req, res, next) {
    let tokenEntrada = req.headers.authorization;
    if (tokenGral) {
        jwt.verify(tokenGral, secret_key, (err, decoded) => {
            if (err) {
                console.log("Token inválido");
                res.sendStatus(401).json({ message: "Token inválido" });

            } else {
                console.log("Token válido: ", decoded);
                next();
            }
        })
    } else {
        console.log("No se mando un token");
        res.status(403).json({ message: "Token no enviado." });
    }
}

app.post("/login", async (req, res) => {
    const mail = req.body.mail;
    const pass = req.body.pass;

    if (mail && pass) {
        const conn = await pool.getConnection();

        try {
            const token = jwt.sign({ mail }, secret_key, { expiresIn: "1h" });
            tokenGral = token;
            console.log("Token generado: ", token);
            res.status(200).json({ token });

            await conn.query(
                "TRUNCATE TABLE api"
            );

            await conn.query(
                "INSERT INTO api(email, pass) VALUES (?, ?)",
                [mail, pass]
            );

        } catch (err) {
            console.log("aaaa ", err);
            res.status(500).json({ message: "Error al guardar carrito" })

        } finally {
            if (conn) conn.release();
        }
    } else {
        res.status(401).json({ message: "Usuario no encontrado" });
        console.log("token no generado");
    }
})

app.get("/api", verificarToken, (req, res) => {
    res.sendFile(__dirname + "/phrase.html");
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
})

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
})