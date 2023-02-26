const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser');
const app = express()
const mysql = require('mysql')
const cors = require('cors');


app.use(bodyParser.json())
app.use(cors({
    origin: "https://maturita-31a87.web.app"
}));

app.set('Access-Control-Allow-Origin', 'https://maturita-31a87.web.app');
app.set('Access-Control-Allow-Methods', 'POST');
app.set('Access-Control-Allow-Headers', 'Content-Type');
app.set('Content-Type', 'application/json',)


// Create a connection to the database
const connection = mysql.createConnection({
  host: 'sql8.freemysqlhosting.net',
  user: 'sql8601216',
  password: 'divJ98MQm8',
  database: 'sql8601216'
})
//app.use(express.json());

app.post('/register', (req, res) => {
    //custom header
    res.set('Access-Control-Allow-Origin', 'https://maturita-31a87.web.app');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Content-Type', 'application/json',)

    const data = req.body;

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)'
    connection.query(query, [data.email, data.password], (error, response) => {
        if (error) throw error;
        console.log(`Inserted ${response.affectedRows} row(s)`)
    })
    res.status(200).send({ message: 'OK' });
  });

app.post("/changeContent", (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://maturita-31a87.web.app');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Content-Type', 'application/json',)

    console.log(req.body.text)
    const content = req.body.text;

    const query = 'UPDATE content SET about_content = (?) WHERE id = 1'

    connection.query(query, [content], (error, response) => {
        if (error) throw error;
        res.status(200).send({message: "Updated"})
    })
})

app.post("/changeAdmin", (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://maturita-31a87.web.app');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Content-Type', 'application/json',)

    const user = req.body.email;
    const admin = req.body.isAdmin;

    const query = 'UPDATE users SET isAdmin = (?) WHERE username = (?)';

    connection.query(query, [Boolean(!admin), user], (error, response) => {
        if (error) {throw error;}
        else {
            console.log("Admin "+ user +" updated")
            console.log(response)
        }

        res.status(200).send({ message: "User updated"})
    })
})

app.post("/placeOrder", (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://maturita-31a87.web.app');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Content-Type', 'application/json')

    const email = req.body.email;
    const products = JSON.stringify(req.body.products);
    const cost = req.body.cost;

    var userID = null;

    //get user id from database
    const getID_query = 'SELECT id FROM users WHERE username = ?';

    connection.query(getID_query, email, (error, response) => {
        if (error) {
            res.status(400).send({error: error})
        } else {
            if(response.length > 0) {
                userID = response[0].id;
            } else {
                userID = null;
            }
            const query = 'INSERT INTO products (user_id, product_info, cost) VALUES (?, ?, ?)'
            const params = [userID, products, cost]
            connection.query(query, params, (error, response) => {
                if(error) {
                    console.log(error);
                } else {
                console.log("Place order")
                res.status(200).send({
                    status: "OK"
                }) 
        }
    })
        }
        console.log(userID)
    })
})
/*
app.post("/addProduct", upload.single("image"), (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://maturita-31a87.web.app');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Content-Type', 'application/json',)

    const image = req.file;
    const name = req.body.name;
    const cost = req.body.price;

    const query = 'INSERT INTO product_info (name, cost, image) VALUES (?,?,?)'
    const values = [name, cost, image.buffer]

    connection.query(query, values, (error, response) => {
        if (error) {
            console.log(error)
        } else {

        }
    })


    //console.log(image.buffer, name, cost)
})
*/

app.get("/getProducts", (req, res) => {
    const query = 'SELECT * FROM product_info'

    connection.query(query, (error, results) => {
        if (error) throw error;
    
        res.send(results);
      });
})

app.get("/content", (req, res) => {
    const query = 'SELECT * FROM content'
    
    connection.query(query, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.send(results)
        } else {
            res.send({results: "No content available"})
        }
    })
})


app.post("/login", (req, res) => {
    //custom header
    res.set('Access-Control-Allow-Origin', 'https://maturita-31a87.web.app');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Content-Type', 'application/json',)

    const email = req.body.email;
    const password = req.body.password;
    
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

    const params = [email, password];
    connection.query(query, params, (error, response) => {
        if (error) {
            res.send({ error: 'Error'});
        } else {
            console.log(`===LOGIN===`)
            if (response.length == 1) {
                console.log(response[0].isAdmin);
                res.status(200).send({ 
                    message: 'OK',
                    isAdmin: Boolean(response[0].isAdmin)})
            } else {
                res.send({ error: "Invalid password or email" })
            }
        }
    })
  });

app.get("/getusers", (req, res) => {
    const query = 'SELECT `id`, `username`, `isAdmin` FROM `users` ORDER BY isAdmin DESC';
    
    connection.query(query, (error, response) => {
        if (error) {
            res.send({ error: 'Unable to get users',
                        jous: error});
        } else {
            console.log("Get users")
            if (response.length > 0) {
                res.status(200).send(
                    response
                )
            }
        }
    })
})

app.post("/getorders", (req, res) => {
    // get user id
    const email = req.body.email;
    const getID_query = 'SELECT id FROM users WHERE username = ?';

    connection.query(getID_query, email, (error, response) => {
        if (error){
            res.send({ error: "Unable to get users",
                        jo: error});
        } else if(response.length > 0) {
            var userID = response[0].id;
            console.log(userID)

            const query = 'SELECT product_info, cost, date FROM `products` WHERE user_id = ?';
            connection.query(query, userID, (error, response) => {
                if (error) {
                    res.send({ error })
                } else {
                    if (response.length > 0) {
                        console.log("Odesláno")
                        console.log(typeof response)
                        res.status(200).send({
                            response
                        })
                    } else {
                        res.status(200).send({no: "orders"})
                    }
                }
            })
        } else {
            res.status(200).send({error:"No user with that email"});
        }
    })
    
})
app.listen(process.env.PORT || 3000)
