const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const Pusher = require('pusher');

const pusher = new Pusher({
    appId: '697782',
    key: '1f0c380b2e3d3e2d30a5',
    secret: '9500dffbc295f1049cf6',
    cluster: 'eu',
    useTLS: true
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

let personArray = [];
let idCounter = 0;

function Person(params) {
    for (var param in params) {
        this[param] = params[param];
    }
}

app.get('/', (req, res) => {
    res.send('This is the index page of the API.');
});

app.get('/frontend.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile('frontend.css', { root: __dirname });
})

app.get('/frontend.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile('frontend.js', { root: __dirname });
})

app.get('/person', (req, res) => {
    res.send(JSON.stringify(personArray));
});

app.get('/person/:id', (req, res) => {
    let person = personArray.find((element) => {
        return element.id == req.params.id;
    });

    if (person) {
        res.send(JSON.stringify(person));
    } else {
        res.status(404).send("404 not found");
    }
});

app.post('/person', (req, res) => {
    idCounter++;

    let person = new Person({
        id: idCounter,
        name: req.body.name,
        age: req.body.age,
        eye_color: req.body.eye_color
    });

    personArray.push(person);

    pusher.trigger('person-channel', 'person-created', person);

    res.send(JSON.stringify(person));
});

app.put('/person/:id', (req, res) => {
    let person = personArray.find((element) => {
        return element.id == req.params.id;
    });

    if (person) {
        let name = req.body.name;
        let age = req.body.age;
        let eye_color = req.body.eye_color;

        name = (name) ? name : "No name entered";
        age = (age) ? age : -1;
        eye_color = (eye_color) ? eye_color : "blue";
        
        person.name = (name) ? name : person.name;
        person.age = (age) ? age : person.age;
        person.eye_color = (eye_color) ? eye_color : person.eye_color;

        pusher.trigger('person-channel', 'person-updated', person);

        res.send(JSON.stringify(person));
    } else {
        res.status(404).send("404 not found");
    }
});

app.delete('/person/:id', (req, res) => {
    var person = personArray.find((element) => {
        return element.id == req.params.id;
    });

    if (person) {
        personArray = personArray.filter(function(value, index, array) {
            return value.id != person.id;
        });
    
        pusher.trigger('person-channel', 'person-deleted', person);
    
        res.send(person);
    } else {
        res.status(404).send("Person not found");
    }
    
});

app.listen(port, () => console.log(`Started express server on port ${port}`));