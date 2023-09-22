const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("hola")
    .setDescription("👀 | Hola, descripción!"),
    run: async (client, interaction) => {

 return interaction.reply({
	 content: "- 🙋 | hola, soy un bot alegre! // Hi, I'm a happy bot!",
	 ephemeral: false
 })

 }
};