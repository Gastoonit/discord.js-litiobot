const { SlashCommandBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, AttachmentBuilder, codeBlock } = require('discord.js');
const { OpenAI } = require("openai");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("litio-gpt")
		.setDescription("🪿 | Interactua con chat-gpt ia, de acuerdo a las especificaciones que le pidas.")
		.addStringOption((option) =>
			option
				.setName("prompt")
				.setRequired(true)
				.setDescription(
					"- Interactua con la ia"
				)
		),
	run: async (client, interaction) => {

		await interaction.deferReply()
		
       const openai = new OpenAI({
	       apiKey: OPENAI_TOKEN,
       });
		
		const prompt = interaction.options.getString("prompt");

          try {
            
		const chatCompletion = await openai.chat.completions.create({
			messages: [{
				role: 'user',
				content: prompt.toString(),
			}],
			model: 'gpt-3.5-turbo',
			user: interaction?.user?.username,
      max_tokens: 950,
		})
		let response = await chatCompletion.choices[0].message.content
		
		await interaction.editReply(response.length > 1996 ? response.substr(0, 1996) + "...": response)
		
		} catch (err) {
			console.log(err)
			return interaction.editReply({
				content: 'Ocurrió un error extraño, vuelve a intentarlo. by Gastoonit'
			})
		}
	}
                                                 }
