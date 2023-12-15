const { Client, Collection, Partials, GatewayIntentBits, EnumResolvers, Events, EmbedBuilder } = require("discord.js");
const { readdirSync } = require("node:fs");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
	],
});
const config = require(`${process.cwd()}/src/json/client/bot.json`);
const linkSchema = require(`${process.cwd()}/src/models/LinkSchema.js`);

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
client.builder();
client.eventos();
client.mongoose();
client.modlogging();

process.on("unhandledRejection", (err) => console.log(err));
process.on("uncaughtException", (err) => console.log(err));

/* Process time function */
const timeFunction = (ms, style) => {
	return `<t:${Math.floor(ms / 1000)}${style ? `:${style}>` : '>'}`;
};

client.on(Events.MessageCreate, async (message) => {
	try {
		if (message.author.bot) return;
		// Permitido
		if (message.content.includes("tenor.com/") || message.content.includes("c.tenor.com") || message.content.includes("giphy.com/gifs") || message.content.includes("www.virustotal.com") || message.content.includes("w3schools.com") || message.content.includes("tenor.com/view") || message.content.includes("https://media.discordapp.net") || message.content.includes("https://discord.com/channels") || message.content.includes("https://images-ext-2.discordapp.net/")) {
			return;
		}
		// No permitido
		if (
			message.content.includes("http") ||
			message.content.includes("discord.gg") ||
			message.content.includes("https://") ||
			message.content.includes("http://") ||
			message.content.includes("discord.gg/") ||
			message.content.includes("dsc.gg")
		) {

			const Data = await linkSchema
				.findOne({ Guild: message.guild.id })
				.catch((err) => {
					return;
				});

			if (!Data) return;

			const memberPerms = Data.Perms;
			const memberTimeout = Data.Timeout || 60000;

			const user = message.author;
			const member = message?.guild?.members?.cache?.get(user?.id);

			if (member.permissions.has(memberPerms)) return;

			else {
				await message.channel.send({ content: Data.Message.replace("%usuario", user).replace("%tiempo", `${timeFunction(Date.now() + memberTimeout, 'R')}`) }).then(msg => {
					setTimeout(() => msg.delete(), 10000)
				})

					;(await message).delete();
				await member?.timeout(Data.Timeout, 'Anti-link | Litio bot').catch((err) => {
					return;
				}); // Custom timeout member

				client.modlogs({
					Member: member,
					Action: "Anti-links",
					Color: "Yellow",
					Reason: "Litio | Anti-links",
					Time: `${timeFunction(Date.now() + memberTimeout, 'R')}`,
					Link: `${message.content}`
				}, message)
			}
		}
	} catch (err) { return; }
});
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
	try {
		if (oldMessage.content !== newMessage.content) {
		// Permitido
		if (newMessage.author.bot || oldMessage.author.bot) return;
		if (newMessage.content.includes("tenor.com/") || newMessage.content.includes("c.tenor.com") || newMessage.content.includes("giphy.com/gifs") || newMessage.content.includes("www.virustotal.com") || newMessage.content.includes("w3schools.com") || newMessage.content.includes("tenor.com/view") || newMessage.content.includes("https://media.discordapp.net") || newMessage.content.includes("https://discord.com/channels") || newMessage.content.includes("https://images-ext-2.discordapp.net/")) {
			return;
		}
		// No permitido
		if (
			newMessage.content.includes("http") ||
			newMessage.content.includes("discord.gg") ||
			newMessage.content.includes("https://") ||
			newMessage.content.includes("http://") ||
			newMessage.content.includes("discord.gg/") ||
			newMessage.content.includes("dsc.gg")
		) {
			const Data = await linkSchema
				.findOne({ Guild: oldMessage.guild.id })
				.catch((err) => { return; });

			if (!Data) return;

			const memberPerms = Data.Perms;
			const memberTimeout = Data.Timeout || 60000;

			const user = oldMessage.author || newMessage.author;
			const member = oldMessage?.guild?.members?.cache?.get(user?.id);

			if (member.permissions.has(memberPerms)) return;
			else {
				await oldMessage.channel.send({ embeds: [new EmbedBuilder().setDescription(Data.Message.replace("%usuario", user).replace("%tiempo", `${timeFunction(Date.now() + memberTimeout, 'R')}`)).setColor('#ff6767').setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })] }).then(msg => {
					setTimeout(() => msg.delete(), 20000)
				})

					;(await oldMessage).delete();
				await member?.timeout(memberTimeout, 'Anti-link | Litio bot').catch(err => {
					return;
				}); // Custom timeout member

				client.modlogs({
					Member: member,
					Action: "Anti-links",
					Color: "Yellow",
					Reason: "Litio | Anti-links (Mensaje Editado o Con Banner)",
					Time: `${timeFunction(Date.now() + memberTimeout, 'R')}`,
					Link: `${newMessage.content}`
				}, newMessage)
			}
		}
	 }
	} catch (err) { return; }
});

client.login(config.BOT_TOKEN);
