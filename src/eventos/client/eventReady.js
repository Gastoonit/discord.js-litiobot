const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	emiter: "once",
	run: async (client) => {

		client.user.setPresence({
			activities: [{ name: 'vTester', type: ActivityType.Watching }],
			status: 'online',
		});

		console.log("✅️ | Bot en linea")

	}
};