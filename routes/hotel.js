'use strict'

var express = require('express')
var api = express.Router()
var HotelController = require('../controllers/hotel')

api.post('/hotels', HotelController.getHotels)

api.post('/hotel', HotelController.addHotel)
api.put('/hotel', HotelController.updateHotel)
api.get('/hotel/:id', HotelController.getHotel)

api.get('/buildDB', HotelController.buildDB)
api.get('/images/:imageFile', HotelController.getHotelImage)


module.exports = api;