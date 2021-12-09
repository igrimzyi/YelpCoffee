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
        const price = Math.floor(Math.random()*7) +1;
        const shop = new coffeeShop({
            author: '61afedf5503989604e41b940',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(brewName)}`,
            images: [{
                filename: "Brewlicious/ipzzifgp3czmskflh0cm",  
                url : "https://res.cloudinary.com/duv85yhgr/image/upload/v1639085260/Brewlicious/urlx2owc5qeaf17ynx9m.jpg"
            },
            {
            url : "https://res.cloudinary.com/duv85yhgr/image/upload/v1639086518/Brewlicious/b6vzbnmsm7jxtafsequl.jpg", 
            filename: "Brewlicious/b6vzbnmsm7jxtafsequl"
            }
            ],
            description: 'best coffee shop in the world',
            price
        })
        await shop.save();
    }
}
shopDB();