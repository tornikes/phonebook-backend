const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const url =
    `mongodb+srv://new_user239:${password}@cluster0.l59ba.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const phoneBookEntrySchema = mongoose.Schema({
    name: String,
    number: String
});

const PhoneBookEntry = mongoose.model('PhoneBookEntry', phoneBookEntrySchema);

const entry = new PhoneBookEntry({
    name: process.argv[3],
    number: process.argv[4]
});

entry.save().then(() => {
    console.log("Saved!");
    mongoose.connection.close();
});