const { Events, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const GuildConfiguration = require(`${process.cwd()}/src/models/GuildConfiguration`);
const Suggestion = require(`${process.cwd()}/src/models/Suggestion`);
const formatResults = require(`${process.cwd()}/src/helpers/formatResults`);

module.exports = {
	name: Events.MessageCreate,
	emiter: "on",
	run: async (client, message) => {
		try {

			if (!message.guild || !message.channel || message.author.bot) return;

			const guildConfiguration = await GuildConfiguration.findOne({ guildId: message.guild.id });

			if (!guildConfiguration?.suggestionsChannelId.includes(message.channel.id)) return;

			message.delete().catch(() => { });

			let suggestionMessage;

			try {
				suggestionMessage = await message.channel.send({
					embeds: [
						new EmbedBuilder()
							.setAuthor({
								name: message.author.username,
								iconURL: message.author.displayAvatarURL({ size: 256 }),
							})
							.setColor('Yellow')
					]
				});
			} catch (error) {
				message.channel.send(':bangbang: | Falle al crear la sugerencia, probablemente no tengo permisos :(');

				return;
			}

			// Actualizar sug
			const newSuggestion = new Suggestion({
				authorId: message.author.id,
				guildId: message.guild.id,
				messageId: suggestionMessage.id,
				content: message.content,
			});

			await newSuggestion.save();

			// Sugs embed
			const suggestionEmebed = new EmbedBuilder()
				.setAuthor({
					name: message.author.username,
					iconURL: message.author.displayAvatarURL({ size: 256 }),
				})
				.setDescription(message.content.length > 999 ? message.content.substr(0, 999) + "...": message.content)
				.addFields([
					{ name: 'Estado', value: 'Pendiente' },
					{ name: 'Influencia', value: formatResults() },
				])
				.setColor('Yellow');

			// Botones
			const upvoteButton = new ButtonBuilder()
				.setLabel('De acuerdo')
				.setEmoji('<:litio_1:1148422028634902568>')
				.setStyle(ButtonStyle.Success) // Green
				.setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`);

			const downvoteButton = new ButtonBuilder()
				.setLabel('Desacuerdo')
				.setEmoji('<:litio_2:1148321922409578607>')
				.setStyle(ButtonStyle.Danger) // Red
				.setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`);

			const secondRow = new ActionRowBuilder().addComponents([
				new StringSelectMenuBuilder()
					.setPlaceholder('Panel de acciones')
					.setCustomId('suggestion').addOptions(
						new StringSelectMenuOptionBuilder()
							.setLabel('Sugerencia Aprobada')
							.setValue('approve')
							.setDescription('- ¡Aprueba la sugerencia!')
							.setEmoji('1148425751499120681'),

						new StringSelectMenuOptionBuilder()
							.setLabel('Sugerencia Denegada')
							.setValue('reject')
							.setDescription('- ¡Rechaza la sugerencia!')
							.setEmoji('1148425751499120681'),

						new StringSelectMenuOptionBuilder()
							.setLabel('Crear un hilo')
							.setValue('create-thread')
							.setDescription('- ¡Crea un hilo en la sugerencia!')
							.setEmoji('1148424395711328276')
					)
			]);

			// Rows
			const firstRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton);

			// Editar el mensaje de sugerencias
			suggestionMessage.edit({
				embeds: [suggestionEmebed],
				components: [firstRow, secondRow],
			});

		} catch (err) {
			console.log(`Error in /suggest: ${err}`);
		}
	},
};
