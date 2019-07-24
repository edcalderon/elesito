const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,  
    lowercase: true
  },
  codigo: {
    type: Number,
    required: true,
    unique: true
  },
  cantidad: {
    type: Number
  },
  categoria: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String,
    required: true,
    lowercase: true
  },
  descuento: {
    type: Number
  },
  imagen: {
    type: Buffer
  }
});

// create mongoose model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
