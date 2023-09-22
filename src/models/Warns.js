const mongo = require("mongoose");

module.exports = mongo.model(
  "advertencias",
   new mongo.Schema({
	 _id: Number,
     guildId: String,
     memberId: String,
     modId: String,
     razón: {
		 type: String,
	 },
     timestamp: Number,
   })
);