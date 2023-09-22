const {Schema, model} = require('mongoose');

const ticketsSchema = new Schema(
    {
        guildId: {
          type: String,
        },
        roleStaff: {
          type: String,
        },
		logTrscChannel: {
			type: String,
		}
    },
);

module.exports = model('Tickets', ticketsSchema);