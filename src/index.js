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
    Partials.Reaction,
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
client.cooldowns = new Collection();
client.cooldownTime = 6;

process.on("unhandledRejection", (err) => console.log(err));
process.on("uncaughtException", (err) => console.log(err));

// No tenía ganas de organizarlo en la carpeta eventos. perdón 😔 
client.on(Events.MessageCreate, async (message) => {
  try {
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

    const user = message.author;
    const member = message?.guild?.members?.cache?.get(user?.id);

    if (member.permissions.has(memberPerms)) return;
	
    else {
      await message.channel
        .send({ embeds: [new EmbedBuilder().setDescription(Data.Message.replace("%usuario", user).replace("%tiempo", "5 minutos")).setColor('#ff6767').setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })] })
        .then((msg) => {
          setTimeout(() => msg.delete(), 10000);
        });
      (await message)?.delete();
	  await member?.timeout(300000, 'Anti-link | Litio bot').catch((err) => {
            return;
      }); // 5 min timeout member
    }
  }
  } catch(err) { return; }
});
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  try {
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
      .catch((err) => {
        return;
      });

    if (!Data) return;

    const memberPerms = Data.Perms;

    const user = oldMessage.author || newMessage.author;
    const member = oldMessage?.guild?.members?.cache?.get(user?.id);

    if (member.permissions.has(memberPerms)) return;
    else {
      await oldMessage.channel
        .send({ embeds: [new EmbedBuilder().setDescription(Data.Message.replace("%usuario", user).replace("%tiempo", "5 minutos")).setColor('#ff6767').setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })] })
        .then((msg) => {
          setTimeout(() => msg.delete(), 10000);
        });
      (await oldMessage)?.delete();
	  await member?.timeout(300000, 'Anti-link | Litio bot').catch(err => {
            return;
      }); // 5 min timeout member
    }
  }
  } catch(err) { return; }
});

client.login(config.BOT_TOKEN);
