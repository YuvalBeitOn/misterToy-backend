const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const toyService = require('./services/toy-service.js');

const port = process.env.PORT || 3000;


// Express App Config
const app = express()
app.use(cors());
app.use(express.static('public'))
app.use(bodyParser.json()) // get the toy from the body request


// toy CRUDL - REST API
// LIST - toys

app.get('/api/toy', (req, res) => {
    const filterBy = req.query;
    toyService.query(filterBy)
        .then(toys => {
            res.json(toys)
        })
})

// READ - single toy
app.get('/api/toy/:id', (req, res) => {
    const id = req.params.id;
    toyService.getById(id)
        .then(toy => {
            console.log('toy:', toy);
            res.json(toy)
        })
})

// DELETE - toy
app.delete('/api/toy/:id', (req, res) => {
    const toyId = req.params.id
    return toyService.remove(toyId)
        .then(toys => {
            // console.log('res from delete then', );
            res.json(toys)
        })
        .catch(err => {
            res.status(401).send(err)
        })

})

// CREATE - toy
app.post('/api/toy', (req, res) => {
    const toy = req.body;
    // console.log(req.body);
    return toyService.save(toy)
        .then((savedtoy) => {
            res.json(savedtoy)
        })
        .catch(err => console.error(err))
})


// UPDATE - toy
app.put('/api/toy/:id', (req, res) => {
    const toy = req.body;
    console.log('toy in ServerJS update:', toy);
    toyService.save(toy)
        .then((savedtoy) => {
            res.json(savedtoy)
        })
        .catch(err => {
            res.status(401).send(err)
        })
})

app.listen(port, () => {
    console.log(`App listening on port ${port} !`)
});