const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
	ChannelType,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	Colors,
	PermissionsBitField
} = require("discord.js");
const GuildConfiguration = require(`${process.cwd()}/src/models/GuildConfiguration.js`);
const TicketsDB = require(`${process.cwd()}/src/models/Tickets.js`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`establecer`)
		.setDefaultMemberPermissions(
			PermissionFlagsBits.ManageChannels
		)
		.setDMPermission(false)
		.setDescription(`♻️ | ¡Establece y configura un canal!`)
		.addSubcommand((command) =>
			command
				.setName(`sugerencias`)
				.setDescription(
					`💡 | Establece el canal de sugerencias!`
				)
				.addChannelOption((option) =>
					option
						.setName(`canal`)
						.setDescription(
							`- Establece el canal`
						)
						.setRequired(true)
						.addChannelTypes(
							ChannelType.GuildText
						)
				))
		.addSubcommand((command) =>
			command
				.setName('tickets')
				.setDescription(
					`🎫 | Establece el canal de tickets!`
				)
				.addChannelOption((option) =>
					option
						.setName('canal')
						.setDescription(
							`- Establece el canal`
						)
						.setRequired(true)
						.addChannelTypes(
							ChannelType.GuildText
						)
				)
				.addChannelOption((option) =>
					option
						.setName('canal_registros')
						.setDescription(
							`- Establece el canal de registros`
						)
						.setRequired(true)
						.addChannelTypes(
							ChannelType.GuildText
						)
				)
				.addRoleOption((option) =>
					option
						.setName('rol_staff')
						.setDescription(
							`- Establece el rol de staff`
						)
						.setRequired(true)
				)
				.addStringOption((options) =>
					options
						.setName('descripción_embed')
						.setDescription('- Descripción del panel de tickets')
						.setRequired(false)
				)
                .addStringOption((options) =>
					options
						.setName('título_embed')
						.setDescription('- Titulo del panel de tickets')
						.setRequired(false)
				)
		),
	run: async (client, interaction) => {
		// const { guild, options } = interaction;
		let guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId });

		if (!guildConfiguration) {
			guildConfiguration = new GuildConfiguration({ guildId: interaction.guildId });
		};

		switch (interaction.options.getSubcommand()) {
			case "sugerencias":

				const channel = interaction.options.getChannel('canal');

				if (guildConfiguration?.suggestionsChannelId.includes(channel.id)) {
					await interaction.reply(':no_entry_sign: | Este canal ya ha sido establecido anteriormente.');
					return;
				}

				guildConfiguration.suggestionsChannelId.push(channel.id);
				await guildConfiguration.save();

				await interaction.reply(`💡 | ¡Se estableció el canal de sugerencias con éxito! (${channel})`);
				return;


				break;
		}
		switch (interaction.options.getSubcommand()) {
			case "tickets":
				
                const { options } = interaction;
				if (!interaction.member.permissions.has(PermissionsBitField.Administrator)) return interaction.reply({
					content: `:no_entry_sign: | ¡No puedes utilizar este apartado, necesitas ser Administrador!`,
					ephemeral: true
				})

				const channel = options.getChannel('canal');
				const channelLog = options.getChannel('canal_registros');
				const roleStaff = options.getRole('rol_staff');
				const descriptionMessage = options.getString('descripción_embed') 
					|| '🎫 - Elige una razón específica para darte acceso a un ticket.';
				const titleMessage = options.getString('título_embed') 
					|| 'Abrir Ticket';

				if (guildConfiguration?.ticketsChannelId.includes(channel.id)) {
					await interaction.reply(':no_entry_sign: | Este canal ya ha sido establecido anteriormente.');
					return;
				}

				guildConfiguration.ticketsChannelId.push(channel.id);
				await guildConfiguration.save();

				await TicketsDB.findOneAndUpdate(
					{ guildId: interaction.guildId },
					{
						roleStaff: roleStaff.id,
						logTrscChannel: channelLog.id,
					},
					{
						new: true,
						upsert: true,
					}
				);

				interaction.reply({
					content: `🎫 | ¡Se estableció el canal de tickets con éxito!\n♻️| Canal: (${channel}) | Rol del personal: (${roleStaff}) | Canal de registros: (${channelLog})`,
					ephemeral: false
				});

				await channel.send({
					embeds: [{
						title: titleMessage.length > 27 ? titleMessage.substr(0, 27) + "...": titleMessage,
						description: descriptionMessage.length > 999 ? descriptionMessage.substr(0, 999) + "...": descriptionMessage,
						footer: {
							text: client.user.username,
							iconURL: client.user.avatarURL()
						},
						color: Colors.Yellow
					}],
					components: [
						new ActionRowBuilder()
							.addComponents(
								new ButtonBuilder().setCustomId('answer').setLabel('Obtener un ticket').setEmoji('🎫').setStyle(ButtonStyle.Secondary)
							)
					]
				})
				return;


				break;
		}

	},
};