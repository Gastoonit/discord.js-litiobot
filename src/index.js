const { Client, Collection, Partials, GatewayIntentBits, EnumResolvers } = require("discord.js");
const { readdirSync } = require("node:fs");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	],
	partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction]
});
const config = require(`${process.cwd()}/src/json/client/bot.json`);

module.exports = client;

client.slashCommands = new Collection();
client.buttons = new Collection();
client.slashArray = [];

/* Handlers */
for (const folder of readdirSync(`${process.cwd()}/src/handlers`)) {
	const files = readdirSync(`${process.cwd()}/src/handlers/${folder}`).filter(
		(file) => file.endsWith(".js")
	);

	for (const file of files) {
		require(`${process.cwd()}/src/handlers/${folder}/${file}`)(client);
	}
}

/* Export */
client.builder()
client.eventos()
client.mongoose()
client.cooldowns = new Collection()
client.cooldownTime = 6

process.on('unhandledRejection', err => console.log(err));
process.on('uncaughtException', err => console.log(err));

client.login(config.BOT_TOKEN);