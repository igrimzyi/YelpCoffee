const mongoose = require('mongoose');
const cities = require('./cities');
const {brewName, descriptors} = require('./shopHelpers');
const coffeeShop = require('../models/coffee');

mongoose.connect('mongodb://localhost:27017/coffee-rate', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once('open', () =>{
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() *array.length)]

const shopDB = async () =>{
    await coffeeShop.deleteMany({});
    for(let i = 0; i<50;i++){
        const random1000= Math.floor(Math.random() * 1000);
        const shop = new coffeeShop({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(brewName)}`
        })
        await shop.save();
    }
}
shopDB();