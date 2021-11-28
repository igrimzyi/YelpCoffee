const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose');
const ejsMate= require('ejs-mate'); 
const methodOverride = require('method-override');
const coffeeShop = require('./models/coffee');

mongoose.connect('mongodb://localhost:27017/coffee-rate', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once('open', () =>{
    console.log("Database connected");
})
const app = express(); 

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views' , path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req,res)=>{
    res.render('home')
});
app.get('/coffeeShops', async(req,res) => {
    const coffeeShops = await coffeeShop.find({});
    res.render('coffeeShops/index', {coffeeShops})
});
app.get('/coffeeShops/new', (req,res)=>{
    res.render('coffeeShops/new')
})
app.post('/coffeeShops', async(req,res)=>{
    const coffee = new coffeeShop(req.body.coffeeShop);
    await coffee.save(); 
    res.redirect(`/coffeeShops/${coffee._id}`)
})

app.get('/coffeeShops/:id', async(req, res)=>{
    const coffee = await coffeeShop.findById(req.params.id)
    res.render('coffeeShops/show', {coffee})
})

app.get('/coffeeShops/:id/edit', async(req, res)=>{
    const coffee = await coffeeShop.findById(req.params.id)
    res.render('coffeeShops/edit', {coffee})

})

app.put('/coffeeShops/:id', async(req, res) =>{
    const {id} = req.params;
    const coffee = await coffeeShop.findByIdAndUpdate(id,{...req.body.coffeeShop})
    res.redirect(`/coffeeShops/${coffee._id}`)
})
app.delete('/coffeeShops/:id', async(req,res)=>{
    const{id} = req.params; 
    await coffeeShop.findByIdAndDelete(id); 
    res.redirect('/coffeeShops')
})


app.listen(3000, ()=>{
    console.log("serving on port 3000")
});