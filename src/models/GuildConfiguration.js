const { Schema, model } = require('mongoose');

const guildConfigurationSchema = new Schema({
	guildId: {
		type: String,
		required: true,
	},
	suggestionsChannelId: {
		type: [String],
		default: [],
	},
	ticketsChannelId: {
		type: [String],
		default: [],
	}
});

module.exports = model('GuildConfiguration', guildConfigurationSchema);