const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { inspect } = require('util');

module.exports = {
data: new SlashCommandBuilder()
  .setName('eval')
  .setDescription ("👤 | Unknown")
  .setDMPermission(false)
  .addStringOption((option) =>
    option.setName("input")
  .setDescription("Input!")
  .setRequired(true)),
    run: async (client, interaction) => {

 if (interaction.user.id !== '746203025860853790') return interaction.reply({ content: ":bangbang: | Esto solo esta disponible para administradores del bot.", ephemeral: true })
 
 const command = interaction.options.getString('input');
 if(!command) return interaction.reply({ content: ':bangbang: Escribe el comando que quieras evaluar.', ephemeral: true })
 
 try{
   const evaled = eval(command)
   const evaluar = new EmbedBuilder()
   .addFields(
    {
     name: '📗 Entrada',
     value: `\`\`\`js\n${command}\`\`\``
    },
    {
     name: '📕 Salida', 
     value: `\`\`\`js\n${inspect(evaled, {depth: 0 })}\`\`\``
    },
 )
 .setColor("Green")
 .setTimestamp()
   
   await interaction.reply({ embeds: [evaluar] })
   
 } catch (err) {
	 
   const fallo = new EmbedBuilder()
   .setColor('Red')
   .addFields({ name: '📕 Error', value: `\`\`\`js\n${err}\`\`\`` })
   .setTimestamp()
   
   await interaction.reply({ embeds: [fallo] })

 }
 }
};
