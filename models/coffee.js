const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coffeeSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    location: String
});

module.exports = mongoose.model('coffee', coffeeSchema)