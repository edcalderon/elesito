const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaProducto = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        required: true,
        trim: true
    },
    foto: {
        data: Buffer,
        contentType: String,
        required: true
    },
    precio: {
        type: Float32Array,
        min: 0.0,
        required: true
    },
    cantidad: {
        type: Number,
        min: 0,
        required: true
    }
});

const Producto = mongoose.model('Producto', schemaProducto);

module.exports = Producto;

