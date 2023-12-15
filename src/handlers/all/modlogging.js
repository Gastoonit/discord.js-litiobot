const { EmbedBuilder } = require("discord.js");
const modlogsDB = require(`${process.cwd()}/src/models/ModLog.js`);

module.exports = (client) => {
  client.modlogging = async () => {
    /* ModLog */
    client.modlogs = async function({
      Member, Action, Color, Reason, Time, Link
    }, interaction) {
      const data = await modlogsDB.findOne({
        GuildID: interaction.guild.id
      })
      if (!data) return;

      const channel = interaction.guild.channels.cache.get(data.ChannelID);
      const LogsEmbed = new EmbedBuilder()
      .setColor(Color)
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
      .setTitle("📕 Moderación Logs")
      .addFields([{ name: "Razón", value: `${Reason.length > 1996 ? Reason.substr(0, 1996) + "...": Reason || "Razón no dada."}`, inline: false },
        { name: "Persona sancionada", value: `[${Member.user.username || Member.author.username}] (<@${Member.id}>) (${Member.id})`, inline: false }])
	  .setThumbnail(Member.user.avatarURL({ dynamic: true })||Member.author.avatarURL({ dynamic: true }))
      .setFooter({ text: `Acción ejecutada: ${Action}` })

      if (Time) {
        LogsEmbed.addFields([{
          name: "Expiración del aislamiento", value: `${Time || 'Tiempo no dado. '}`, inline: true
        }])
      }
      if (Link) {
        LogsEmbed.addFields([{
          name: "Link:", value: `🚦 ¡Peligro, usa esta información bajo tu responsabilidad!\n${Link.length > 1996 ? Link.substr(0, 1996) + "...": Link || 'Link no dado. '}`, inline: true
        }])
      }

      channel.send({
        embeds: [LogsEmbed]
      })
    }
  }
};
