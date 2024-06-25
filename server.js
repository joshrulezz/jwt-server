const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware functions - app.use()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require the data
const users = require("./users.json");
const cars = require("./cars.json");

function checkToken(req, res, next) {
    const token = req.headers["authorization"];
    if (token) {
        jwt.verify(token, "secret", (err, decoded) => {
            if (err) {
                res.status(401).send({ message: "Access denied" });
                return;
            } else {
                req.userid = decoded.userID; // getting the userid from the jwt token that we have signed in login
                next();
            }
        });
    } else {
        res.status(401).send({ message: "Access denied" });
    }
}

app.get("/data", checkToken, (req, res) => {
    const mycars = cars.filter((car) => car.userid === req.userid);
    res.status(200).send(mycars);
});

app.post("/login", (req, res) => {
    const user = users.find((usr) => usr.username === req.body.username);
    if (user) {
        if (user.password === req.body.password) {
            const token = jwt.sign({ userID: user.id }, "secret"); // Creating jwt with secret key with respective user id
            res.status(200).send({ token: token });
        } else {
            res.status(404).send({ message: "Incorrect Password." });
        }
    } else {
        res.status(404).send({ message: "Access Denied for your login." });
    }
});


// Running on a server to run this code and access the values written in this code
app.listen(5000, () => {
    console.log("Server has started at 5000");
});




// app.use((err, req, res, next) => {
//     if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
//         console.error('Bad JSON received:', req.body);
//         res.status(400).send({ message: "Invalid JSON" });
//     } else {
//         next();
//     }
// });