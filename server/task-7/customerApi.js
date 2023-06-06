let express = require("express");
require('dotenv').config();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
let app = express();
app.use(express.json());

app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD");
    res.header("Access-Control-Allo-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.listen(PORT, () => console.log(`Listening on port http://localhost/${PORT}`))


let { customers } = require('./customersData.js');

app.get('/customers', (req, res) => {
    let { city, gender, payment, sortBy } = req.query;
    let originalCustomers = customers;
    if (city) {
        originalCustomers = originalCustomers.filter(customer => customer.city === city)
    }
    if (gender) {
        originalCustomers = originalCustomers.filter(customer => customer.gender === gender)
    }
    if (payment) {
        originalCustomers = originalCustomers.filter(customer => customer.payment === payment)
    }
    if (sortBy === 'age') {
        originalCustomers.sort((a, b) => a.age - b.age)
    }
    if (sortBy === 'city' || sortBy === 'payment') {
        originalCustomers.sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
    }
    res.send(originalCustomers)
})

app.get('/customers/:id', (req, res) => {
    let { id } = req.params;
    let customer = customers.find(customer => customer.id === id);
    res.send(customer)
})

app.post('/customers', (req, res) => {
    let newCustomer = req.body;
    customers.push(newCustomer)
    res.send(newCustomer)
})

app.put('/customers/:id', (req, res) => {
    let { id } = req.params;
    let index = customers.findIndex(customer => customer.id === id);
    if (index >= 0) {
        let newCustomer = { id, ...req.body }
        customers[index] = newCustomer;
        res.send(newCustomer)
    } else {
        res.status(404).send(`NO CUSTOMER FOUND WITH ID ${id}`)
    }
})

app.delete('/customers/:id', (req, res) => {
    let { id } = req.params;
    let index = customers.findIndex(customer => customer.id === id);
    if (index >= 0) {
        let deletedCustomer = customers.splice(index, 1);
        res.send(deletedCustomer)
    } else {
        res.status(404).send(`NO CUSTOMER FOUND WITH ID ${id}`)
    }
})


