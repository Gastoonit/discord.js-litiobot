const { Interaction, Events, ThreadAutoArchiveDuration } = require('discord.js');
const Suggestion = require(`${process.cwd()}/src/models/Suggestion`);
const formatResults = require(`${process.cwd()}/src/helpers/formatResults`);

module.exports = {
	name: Events.InteractionCreate,
	emiter: "on",
	run: async (client, interaction) => {
		try {
			if (interaction.isButton()) {

				if (!interaction.isButton() || !interaction.customId) return;

				const [type, suggestionId, action] = interaction.customId.split('.');

				if (!type || !suggestionId || !messageId || !action) return;
				if (type !== 'suggestion') return;

				await interaction.deferReply({ ephemeral: true });

				const targetSuggestion = await Suggestion.findOne({ suggestionId });
				const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
				const targetMessageEmbed = targetMessage.embeds[0];

				if (action === 'upvote') {

					const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);
					const hasStatus = targetSuggestion.status === 'approved' || targetSuggestion.status === 'rejected';

					if (hasVoted) {
						await interaction.editReply(':bangbang: | Ya votaste anteriormente esta sugerencia!');
						return;
					} else if (hasStatus) {
						await interaction.editReply(':bangbang: | Esta sugerencia ya no puede ser votada!');
						return;
					}

					targetSuggestion.upvotes.push(interaction.user.id);
					await targetSuggestion.save();

					interaction.editReply('👍 | Le diste el visto bueno a esta sugerencia!');

					targetMessageEmbed.fields[1].value = formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes);

					targetMessage.edit({
						embeds: [targetMessageEmbed],
					});

					return;
				}

				if (action === 'downvote') {

					const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);
					const hasStatus = targetSuggestion.status === 'approved' || targetSuggestion.status === 'rejected';

					if (hasVoted) {
						await interaction.editReply(':bangbang: | Ya votaste anteriormente esta sugerencia!');
						return;
					} else if (hasStatus) {
						await interaction.editReply(':bangbang: | Esta sugerencia ya no puede ser votada!');
						return;
					}

					targetSuggestion.downvotes.push(interaction.user.id);
					await targetSuggestion.save();

					interaction.editReply('👎 | Le diste el visto malo a esta sugerencia!');

					targetMessageEmbed.fields[1].value = formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes);

					targetMessage.edit({
						embeds: [targetMessageEmbed],
					});

					return;
				}
			}

			if (interaction.isStringSelectMenu()) {

				await interaction.deferReply({ ephemeral: true });

				const targetSuggestion = await Suggestion.findOne({ messageId: interaction.message?.id });
				const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
				const targetMessageEmbed = targetMessage.embeds[0];

				const value = interaction.values[0];

				if (value === 'approve') {
					if (!interaction.member.permissions.has('Administrator')) {
						await interaction.editReply({
							content: ':bangbang: | ¡No tienes permiso para usar este apartado!',
							epehmeral: true
						});
						return;
					}

					targetSuggestion.status = 'approved';

					targetMessageEmbed.data.color = 0x84e660; // Green Hex code
					targetMessageEmbed.fields[0].value = `✅) Aprobada`;

					await targetSuggestion.save();

					interaction.editReply('✅️ | ¡Sugerencia aprobada con éxito!');

					targetMessage.edit({
						embeds: [targetMessageEmbed],
						components: [],
					});

					return;
				}

				if (value === 'reject') {
					if (!interaction.member.permissions.has('Administrator')) {
						await interaction.editReply({
							content: ':bangbang: | ¡No tienes permiso para usar este apartado!',
							epehmeral: true
						});
						return;
					}

					targetSuggestion.status = 'rejected';

					targetMessageEmbed.data.color = 0xff6161; // Red Hex code
					targetMessageEmbed.fields[0].value = `❌) Denegada`;

					await targetSuggestion.save();

					interaction.editReply('🚫 | ¡Sugerencia denegada con éxito!');

					targetMessage.edit({
						embeds: [targetMessageEmbed],
						components: [],
					});

					return;
				}

				if (value === 'create-thread') {
					if (!interaction.member.permissions.has('Administrator')) {
						await interaction.editReply({
							content: ':bangbang: | ¡No tienes permiso para usar este apartado!',
							epehmeral: true
						});
						return;
					}

					await interaction.message.startThread(
						{
							name: "Hilo de la sugerencia",
							autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
							reason: `Del panel`
						}
					)

					interaction.editReply('<:litio_3:1148424395711328276> | ¡Hilo de Sugerencia creado con éxito!');

					targetMessage.edit({
						embeds: [targetMessageEmbed],
					});

				}
			}

		} catch (error) {
			console.log(`Error in sugerenciasEvent.js: ${error}`);
		}
	}
};
