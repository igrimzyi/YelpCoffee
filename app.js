const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose');
const ejsMate= require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash')
const {coffeeShopSchema, reviewSchema} = require('./schemas.js'); 
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');


const coffeeShops = require('./routes/coffeeShops');
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/coffee-rate', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
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
app.use(express.static(path.join(__dirname , 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

const validateCoffeeShop = (req,res,next)=>{
     
    const {error} =coffeeShopSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
const validateReview = (req,res,next) =>{
    const {error} =reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

app.use("/coffeeShops", coffeeShops)
app.use("/coffeeShops/:id/reviews", reviews)
app.get('/', (req,res)=>{
    res.render('home')
});

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