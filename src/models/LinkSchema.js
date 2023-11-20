const { model, Schema } = require("mongoose");

let linkSchema = new Schema({
  Guild: String,
  Perms: String,
  Message: String,
});

module.exports = model("AntiLinks", linkSchema);
