const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost27017/coffee-rate', {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once('open', () =>{
    console.log("Database connected");
})
const app = express(); 

app.set('view engine', 'ejs');
app.set('views' , path.join(__dirname, 'views'))

app.get('/', (req,res)=>{
    res.send("Hello from YelpCamp")
});

app.listen(3000, ()=>{
    console.log("serving on port 3000")
});