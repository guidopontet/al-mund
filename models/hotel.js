'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema

var HotelSchema = Schema({
    name: String,
    stars: Number,
    price: Number,
    image: String,
    amenities: []
})

module.exports = mongoose.model('Hotel', HotelSchema);