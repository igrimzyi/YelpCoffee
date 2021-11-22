const express = require('express'); 
const app = express(); 

app.get('/', (req,res)=>{
    res.send("Hello from YelpCamp")
});

app.listen(3000, ()=>{
    console.log("serving on port 3000")
});