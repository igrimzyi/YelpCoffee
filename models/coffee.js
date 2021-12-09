const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const coffeeSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    images: [{
        url: String,
        filename:String
    }],
    location: String, 
    author:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
coffeeSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('coffee', coffeeSchema)