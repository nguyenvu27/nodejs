
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomsSchema = new Schema({
  room_number:  {type: String, unique : true, required : true, dropDups: true},
  floor: {type: String, default: null},
  hotelid: {type: Schema.Types.ObjectId, ref: "hotels"},
  single_room: {type: String, default: null},
  price:{type: Number, default: 0},
  status:{type: Number, default: null},
  image: {type: String, default: null},
  detail: {type: String, default: null},
});


module.exports = mongoose.model('rooms', roomsSchema);