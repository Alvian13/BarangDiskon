const mongoose = require('mongoose');
const diskonScheema = new mongoose.Schema({
  _id :{
    type: String
  },
  nama:{
    type: String
  },
  asalsitus:{
    type : String
  },
  harga:{
    type : Number
  },
  diskon:{
    type : Number
  },
  gambar:{
    type : String
  },
  jenis:{
    type : String
  },
  link :{
    type:String
  },
  pdiskon:Number

})

module.exports = mongoose.model('data',diskonScheema);