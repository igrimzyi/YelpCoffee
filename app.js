const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose');
const ejsMate= require('ejs-mate'); 
const catchAsync = require('./utils/catchAsync');
const {coffeeShopSchema} = require('./schemas.js'); 
const methodOverride = require('method-override');
const coffeeShop = require('./models/coffee');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review')

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

const validateCoffeeShop = (req,res,next)=>{
     
    const {error} =coffeeShopSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
app.get('/', (req,res)=>{
    res.render('home')
});
app.get('/coffeeShops', catchAsync(async(req,res) => {
    const coffeeShops = await coffeeShop.find({});
    res.render('coffeeShops/index', {coffeeShops})
}));
app.get('/coffeeShops/new', (req,res)=>{
    res.render('coffeeShops/new')
})

app.post('/coffeeShops', validateCoffeeShop, catchAsync(async(req,res,next)=>{
    // if(!req.body.coffee) throw new ExpressError('Invalid Data', 400);
    const coffee = new coffeeShop(req.body.coffeeShop);
    await coffee.save(); 
    res.redirect(`/coffeeShops/${coffee._id}`)
   }))

app.get('/coffeeShops/:id', catchAsync(async(req, res)=>{
    const coffee = await coffeeShop.findById(req.params.id)
    res.render('coffeeShops/show', {coffee})
}));

app.get('/coffeeShops/:id/edit', catchAsync(async(req, res)=>{
    const coffee = await coffeeShop.findById(req.params.id)
    res.render('coffeeShops/edit', {coffee})

}));

app.put('/coffeeShops/:id', validateCoffeeShop, async(req, res) =>{
    const {id} = req.params;
    const coffee = await coffeeShop.findByIdAndUpdate(id,{...req.body.coffeeShop})
    res.redirect(`/coffeeShops/${coffee._id}`)
})
app.delete('/coffeeShops/:id', catchAsync(async(req,res)=>{
    const{id} = req.params; 
    await coffeeShop.findByIdAndDelete(id); 
    res.redirect('/coffeeShops')
}));
app.post('/coffeeShops/:id/reviews', catchAsync(async (req,res)=>{
    const coffee = await coffeeShop.findById(req.params.id);
    const review = new Review(req.body.review); 
    coffee.reviews.push(review);
    await review.save()
    await coffee.save()
    res.redirect(`/coffeeShops/${coffee._id}`)
}))
app.all('*',(req,res,next)=>{    
    next(new ExpressError('Page Not Found', 404))
})
app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something Went Wrong'
    res.status(statusCode).render('error' , {err});
})


app.listen(3000, ()=>{
    console.log("serving on port 3000")
});