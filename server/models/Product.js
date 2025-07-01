const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: Number }, // optional - useful for anti-fraud checks
  stock: { type: Number, default: 100 }
});

module.exports = mongoose.model('Product', productSchema);
