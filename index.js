const express = require('express');
const morgan = require('morgan');

const app = express();

let data = {
    "persons": [
        {
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
        },
        {
            "name": "Dan Abramov",
            "number": "343556677",
            "id": 3
        },
        {
            "name": "Ada Lovelace",
            "number": "34234234",
            "id": 4
        },
        {
            "name": "Adam Smith",
            "number": "354434",
            "id": 6
        }
    ]
}

app.use(express.json());
app.use(morgan(function (tokens, req, res) {
        const reply = [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ];
        if(req.method === 'POST') {
            reply.push(JSON.stringify(req.body));
        }
        return reply.join(' ');
}));

app.get('/info', function (req, res) {
    const reply = `
        <p>Phonebook has info for ${data.persons.length} people.</p>
        <p>${new Date().toString()}</p>
    `;
    res.send(reply);
});

app.get('/api/persons', function (req, res) {
    res.json(data);
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post('/api/persons', function (req, res) {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({ error: 'name or number missing' });
    } else if (data.persons.find(p => p.name === req.body.name)) {
        return res.status(400).json({ error: 'name must be unique' });
    }
    const nextPerson = {
        name: req.body.name,
        number: req.body.number,
        id: getRandomInt(10000000, 99999999)
    };
    data.persons.push(nextPerson);
    res.status(204).end();
});

app.get('/api/persons/:id', function (req, res) {
    const ident = Number(req.params.id);
    const person = data.persons.find(p => p.id === ident);
    if (person) {
        return res.json(person);
    } else {
        return res.status(404).end();
    }
});

app.delete('/api/persons/:id', function (req, res) {
    const ident = Number(req.params.id);
    data.persons = data.persons.filter(p => p.id !== ident);
    res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, 'localhost', () => {
    console.log(`Server running at port ${PORT}`);
});