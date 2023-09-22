const { SlashCommandBuilder, EmbedBuilder, Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription("📗 | Apartado de informaciones generales.")
		.setDMPermission(false)
		.addSubcommand((command) => command
			.setName("bot")
			.setDescription(
				`📊 | ¡Ve la información un poco detallada del bot!`
			))
		.addSubcommand((command) => command
			.setName("help")
			.setDescription(
				`⚡️ | ¡Ve la lista de los comandos del bot!`
			)
			.addStringOption((option) => option.setName("comando").setDescription("- Comando a buscar")),
		)
		.setDMPermission(false),
	run: async (client, interaction) => {

		let totalSeconds = client.uptime / 1000
		const days = Math.floor(totalSeconds / 86400)
		totalSeconds %= 86400
		const hours = Math.floor(totalSeconds / 3600)
		totalSeconds %= 3600
		const minutes = Math.floor(totalSeconds / 60)
		const seconds = Math.floor(totalSeconds % 60)

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Top.gg')
					.setURL(`https://top.gg/bot/1146522183439487096`)
					.setEmoji('🔻')
					.setStyle(ButtonStyle.Link)
			)

		if (interaction.options.getSubcommand() === 'help') {
			const interactionName = interaction.options.getString("comando");
			const embed = new EmbedBuilder();

			if (interactionName) {
				const cmd = interaction.client.slashCommands.find((command) => command.data.name === interactionName);

				if (!cmd) {
					return interaction.reply({
						content: `El comando solicitado al parecer no existe! 🤷`,
						ephemeral: true
					});
				}
				embed.setTitle(`${cmd.data.name}`)
					.addFields(
						{
							name: "Descripción",
							value: cmd.data.description
						},
						{
							name: "Nombre",
							value: `\`/${cmd.data.name}\``,
							inline: true
						},
						{
							name: "Opciones:",
							value: cmd.data.options.length ? `- ${cmd.data.options.map((option) => `\`Nombre: ${option.name}\` | \`Descripción: ${option.description}\` | ${option.required ? "Requiere" : "No requerible"}`).join('\n- ')}` : "No tiene"
						}
					)
					.setFooter({
						text: `${client.user.username}`,
						iconURL: client.user.displayAvatarURL({ dynamic: true, extension: 'png' })
					})
					.setTimestamp()
					.setColor(`#ffc800`);
			} else {
				embed.setTitle("📚 Lista de comandos")
					.setDescription(`Aquí tienes la lista de comandos disponibles:\n\n- ${client.slashCommands.map((interactions) => `\`/${interactions.data.name}\` - ${interactions.data.description}`).join('\n- ')}`)
					.setFooter({
						text: `${client.user.username}`,
						iconURL: client.user.displayAvatarURL({ dynamic: true, extension: 'png' })
					})
					.setTimestamp()
					.setColor(`#ffc800`);
			}
			await interaction.reply({ embeds: [embed], components: [row] });

		}

		if (interaction.options.getSubcommand() === 'bot') {

			const EmbedBot = new EmbedBuilder()
				.setAuthor({ name: client.user.username + ' stat\'s', iconURL: client.user.avatarURL() })
				.setColor('#ff6767')
				.addFields([
					{ name: 'Comandos', value: `\`${client.slashCommands.size} comandos de barra\`` },
					{ name: 'Litio', value: `\`\`\`\nGuilds: ${client.guilds.cache.size}\nPing: ${client.ws.ping}\nTiempo activo: ${days} día(s), ${hours} hora(s), ${minutes} minuto(s)\n\`\`\`` }

				])
				.setTimestamp()

			await interaction.reply({ embeds: [EmbedBot], components: [row] })
		}

	},
};