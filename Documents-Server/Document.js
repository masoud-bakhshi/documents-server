const { Schema, model } = require("mongoose")

const Document = new Schema({
  _id: String,
  username: String,
  data: Object,
})

module.exports = model("Document", Document)
