const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongoose connected');
    })
    .catch((err) => {
        console.log('connection failed', err.message);
    });

const phoneBookEntrySchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        minlength: 8
    }
});
phoneBookEntrySchema.plugin(uniqueValidator);

phoneBookEntrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('PhoneBookEntry', phoneBookEntrySchema);
