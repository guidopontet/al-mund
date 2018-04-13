'use strict'

var Hotel = require('../models/hotel');
var data_hotels = require('../data/data.json')
let fs = require('fs')
let path = require('path')

/* ----- ----- AGREGAR HOTEL ----- ----- */
function addHotel(req,res){
    var hotel = new Hotel();
    var params = req.body

    // Verificamos que esten los parametros obligatorios
    if (params.name && params.price) {
        hotel.name = params.name;
        hotel.stars = params.stars;
        hotel.price = params.price;
        hotel.image = null;
        hotel.amenities= null;


        // Verificamos que no existe ya un hotel con el mismo nombre
        Hotel.findOne({name: hotel.name}, (error, hotels) => {

            if (error) return res.status(500).send({ message: 'Error al registrar Hotel', error })

            // Si ya existe un hotel con ese nombre
            if (hotels) {
                return res.status(500).send({ message: "Ya existe un hotel con ese nombre" })
            }

            // Guardamos el hotel
            hotel.save((err, hotelStored) => {
                if (err || !hotelStored) return res.status(500).send({ message: 'Error al registrar hotel', err })
                if (hotelStored) {
                    return res.status(200).send({ message: 'hotel Registrado!' })
                }
            })
        })

    } else {
        return res.status(500).send({
            message: 'Completa todos los campos'
        })
    }  
}

/* ----- ----- GET HOTEL ----- ----- */
function getHotel(req, res) {
    // Obtenemos el ID de la URL
    let hotel_id = req.params.id

    Hotel.findById(hotel_id, (err, hotel) => {
        if (err) return res.status(500).send({ message: 'Error al recuperar hotel', err })

        if (!hotel) return res.status(500).send({ message: 'No existe el hotel' })

        return res.status(200).send({ hotel })
    })
}

/* ----- ----- GET HOTELS ----- ----- */
function getHotels(req,res){
    let filter_string = req.body.filter_string;
    let filter_stars = req.body.filter_stars;

    // Si no hay filtro por estrellas, traemos todas
    if(filter_stars==""){
        filter_stars={ $gt: 0, $lt: 6 }
    }
    
    Hotel.find({ name: { $regex: new RegExp(filter_string, "i") }, stars: filter_stars},(err,hotels) => { /* Busqueda case insensitive */
        if (err) return res.status(500).send({ message: 'Error al recuperar hoteles', err })

        // Si no existen hoteles
        if (!hotels) return res.status(500).send({ message: 'No existen hoteles' })

        res.status(200).send({
            hotels
        })
    })

}

/* ----- ----- UPDATE HOTEL ----- ----- */
function updateHotel(req,res){
    let hotelUpdate = req.body;

    // Comprobamos que si cambió el nombre, no esté en uso
    User.findById(hotel_id, (err, hotel_original) => {
        if (err) return res.status(500).send({ message: 'Error al actualizar hotel', err })

        if (hotelUpdate.name != hotel_original.name) {
            // Buscamos si existe algún usuario con ese email
            Hotel.findOne({ name: hotelUpdate.name }, (err, hotel) => {
                if (err) return res.status(500).send({ message: 'Error al actualizar hotel', err })

                // Si Ya está en uso retornamos
                if (hotel) return res.status(500).send({ message: 'El nombre del hotel ya está en uso' })

                // Sinó actualizamos el usuario
                updateUser(hotel_id, hotelUpdate);
            })
        } else {
            updateUser(hotel_id, hotelUpdate);
        }

        function updateUser(id, hotel) {
            Hotel.findByIdAndUpdate(id, hotel, { new: true }, (err, hotelUpdated) => {
                if (err || !hotelUpdated) return res.status(500).send({ message: 'Error al actualizar hotel', err })

                return res.status(200).send({
                    message: "Hotel actualizado satisfactoriamente",
                    hotel: hotelUpdated
                })
            })
        }


    })
}

/* ----- ----- GENERAR DB DESDE DATA.JSON ----- ----- */
function buildDB(req,res){
    
    data_hotels.forEach((element,index) => {
        let hotel = new Hotel();
        
        hotel.name = element.name,
        hotel.stars = element.stars,
        hotel.price = element.price,
        hotel.image = element.image,
        hotel.amenities = element.amenities

        console.log("agregando: " + index + " " + hotel.name)
        // Guardamos el hotel
        hotel.save((err, hotelStored) => {
            if (err || !hotelStored) return res.status(500).send({ message: 'Error al registrar hotel', err })
        })
    });
    
    return res.status(200).send({mesagge: "Hoteles agregados!"})
}

/* ----- ----- GET IMAGEN ----- ----- */
function getHotelImage(req,res){
    var image_file=req.params.imageFile;
    var path_file='./uploads/hotels/'+image_file;
    
	fs.exists(path_file,(exist)=>{
		if(exist){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message:'No existe la imagen'})
		}
	})
}

module.exports = {
    addHotel,
    getHotel,
    getHotels,
    updateHotel,
    buildDB,
    getHotelImage
}