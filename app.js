if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose');
const ejsMate= require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash')
const {coffeeShopSchema, reviewSchema} = require('./schemas.js'); 
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize')
const MongoDBStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL;
const secret = process.env.SECRET;



const userRoutes = require('./routes/users')
const coffeeShops = require('./routes/coffeeShops');
const reviews = require('./routes/reviews');


mongoose.connect(dbUrl, {
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

const store = new MongoDBStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function(e){
console.log('session store error')
})


const sessionConfig = {
    store,
    secret: secret,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{

    res.locals.currentUser = req.user; 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})


app.use('/', userRoutes)
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