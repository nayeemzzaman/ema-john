const express = require('express');
const bodyParser = require('body-parser');
const cors= require('cors');
const app = express()
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yuvpr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 4000;
app.get('/', (req, res) =>{
    res.send("Hello form Database. It's under construction");
})
app.use(bodyParser.json());
app.use(cors());



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("emaJohnStore").collection("products");
    const orderCollection = client.db("emaJohnStore").collection("orders");

    app.post('/addProduct' , (req, res) => {
        const products = req.body;
        
        productCollection.insertMany(products)
        .then(result => {
            res.send(result.insertedCount);
        })
    })
    app.get('/products' , (req, res) => {
        productCollection.find({}).limit(20)
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get('/products/:key' , (req, res) => {
        productCollection.find({key: req.params.key}).limit(20)
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys' , (req, res) => {
        const productKeys = req.body;
        productCollection.find({key: {$in: productKeys}})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })


    app.post('/addOrder' , (req, res) => {
        const order = req.body;
        
        orderCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })
});

app.listen(process.env.PORT || port);