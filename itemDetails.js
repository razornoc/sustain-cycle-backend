const mongoose = require('mongoose')

const itemDetailSchema = new mongoose.Schema(
  {
    item: String,
    desc: String,
    years: Number,
    price: Number,
    phno: Number,
    image: String,
    email: String,
  },
  {
    collection: 'ItemDetails',
  }
)
mongoose.model('ItemDetails', itemDetailSchema)
