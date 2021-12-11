const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')


const ImageSchema = new Schema({
        url: String,
        filename:String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts = {toJSON: {virtuals:true}};


const coffeeSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    images: [ImageSchema],
    geometry:{
        type:{
            type:String, 
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type:[Number],
            required: true
        }
    },
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
} , opts);

coffeeSchema.virtual('properties.popUpMarkup').get(function(){
    return(`<a href="/coffeeShops/${this._id}">${this.title}`)
})


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