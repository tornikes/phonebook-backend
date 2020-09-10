require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const PhoneBookEntry = require('./models/phoneBookEntry');

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(function (tokens, req, res) {
    const reply = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ];
    if (req.method === 'POST') {
        reply.push(JSON.stringify(req.body));
    }
    return reply.join(' ');
}));

// app.get('/info', function (req, res) {
//     const reply = `
//         <p>Phonebook has info for ${data.persons.length} people.</p>
//         <p>${new Date().toString()}</p>
//     `;
//     res.send(reply);
// });

app.get('/api/persons', function (req, res) {
    PhoneBookEntry.find({})
        .then(entries => {
            res.json({ persons: entries });
        });
});

app.post('/api/persons', function (req, res, next) {
    // if (!req.body.name || !req.body.number) {
    //     return res.status(400).json({ error: 'name or number missing' });
    // } else if (data.persons.find(p => p.name === req.body.name)) {
    //     return res.status(400).json({ error: 'name must be unique' });
    // }
    const nextPerson = {
        name: req.body.name,
        number: req.body.number
    };
    const entry = new PhoneBookEntry(nextPerson);
    entry.save()
        .then(nextp => {
            res.json(nextp);
        })
        .catch(err => {
            next(err);
        });
});

app.get('/api/persons/:id', function (req, res, next) {
    PhoneBookEntry.findById(req.params.id)
        .then(data => res.json(data))
        .catch(err => next(err));
});

app.delete('/api/persons/:id', function (req, res, next) {
    PhoneBookEntry.findByIdAndDelete(req.params.id)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            next(err);
        });
});

app.put('/api/persons/:id', function (req, res, next) {
    console.log(req.body);
    PhoneBookEntry.findByIdAndUpdate(req.params.id, { name: req.body.name, number: req.body.number }, { new: true, runValidators: true, context: 'query' })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

const PORT = 3001;
app.listen(PORT, 'localhost', () => {
    console.log(`Server running at port ${PORT}`);
});