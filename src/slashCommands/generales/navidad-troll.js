const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("navidad-troll")
    .setDescription("🎄 | ¡Comando que envía un rickroll a tus amigos!"),
    run: async (client, interaction) => {

    const row = new ActionRowBuilder()
     .addComponents(
       new ButtonBuilder()
       .setLabel('¡Lo quiero!')
       .setEmoji('🎄')
       .setStyle(ButtonStyle.Secondary)
       .setCustomId("ipw"),
   );

   const embed = new EmbedBuilder().setColor("Green").setDescription("🎅 JO-JO-JO... Tu regalo de Navidad te espera acá! 👇")

   await interaction.reply({ content: "🎅 Listo, trolleo enviado con exitó, ten cuidado que el propietario del servidor no te banee...", ephemeral: true })
   await interaction.channel.send({ embeds: [embed], components: [row] })

   const filter = i => i.user.id === interaction.user.id
   const collector = interaction.channel.createMessageComponentCollector({ filter });

   collector.on('collect', async i => {
	   if (i.customId === "ipw") {
       await i.reply({ content: "Ahí va:\nhttps://images-ext-1.discordapp.net/external/AoV9l5YhsWBj92gcKGkzyJAAXoYpGiN6BdtfzM-00SU/https/i.imgur.com/NQinKJB.mp4", ephemeral: true })
	   }
  });
 }
};
