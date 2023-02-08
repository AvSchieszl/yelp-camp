const mongoose = require('mongoose');
const review = require('./review');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//thumbnail for campground edit page to delete images
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300');
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    price: Number,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>`
});

CampgroundSchema.methods.calculateAvgRating = function () {
    let sumRatings = 0;
    this.reviews.forEach(review => {
        sumRatings += review.rating;
    });
    this.avgRating = sumRatings / this.reviews.length;
    return this.avgRating.toFixed(1);
};

// Mongoose middleware, triggeres when delete campground and deletes all associated reviews
CampgroundSchema.post('findOneAndDelete', async function (camp) {
    if (camp) {
        await Review.deleteMany({
            _id: {
                $in: camp.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);