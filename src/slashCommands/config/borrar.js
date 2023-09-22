const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
	ChannelType,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	PermissionsBitField
} = require("discord.js");
const GuildConfiguration = require(`${process.cwd()}/src/models/GuildConfiguration.js`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`borrar`)
		.setDefaultMemberPermissions(
			PermissionFlagsBits.ManageChannels
		)
		.setDMPermission(false)
		.setDescription(`🗑 | ¡Borra un canal establecido!`)
		.addSubcommand((command) =>
			command
				.setName(`sugerencias`)
				.setDescription(
					`💡 | Borra el canal de sugerencias!`
				)
				.addChannelOption((option) =>
					option
						.setName(`canal`)
						.setDescription(
							`- Borra el canal de sugerencias`
						)
						.setRequired(true)
						.addChannelTypes(
							ChannelType.GuildText
						)
				))
		.addSubcommand((command) =>
			command
				.setName(`tickets`)
				.setDescription(
					`🎫 | Borra el canal de tickets!`
				)
				.addChannelOption((option) =>
					option
						.setName(`canal`)
						.setDescription(
							`- Borra el canal de sugerencias`
						)
						.setRequired(true)
						.addChannelTypes(
							ChannelType.GuildText
						)
				)),
	run: async (client, interaction) => {
		// const { guild, options } = interaction;
		let guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId });

		if (!guildConfiguration) {
			guildConfiguration = new GuildConfiguration({ guildId: interaction.guildId });
		};

		switch (interaction.options.getSubcommand()) {
			case "sugerencias":

				const channel = interaction.options.getChannel('canal');

				if (!guildConfiguration?.suggestionsChannelId.includes(channel.id)) {
					await interaction.reply(':no_entry_sign: | Este canal no ha sido establecido anteriormente.');
					return;
				}

				guildConfiguration.suggestionsChannelId = guildConfiguration.suggestionsChannelId.filter((channelId) => channelId !== channel.id);

				await guildConfiguration.save();

				await interaction.reply(`💡 | ¡Se borro el canal de sugerencias con éxito! (${channel})`);
				return;


				break;
		}

		switch (interaction.options.getSubcommand()) {
			case "tickets":

				const channel = interaction.options.getChannel('canal');

				if (!guildConfiguration?.ticketsChannelId.includes(channel.id)) {
					await interaction.reply(':no_entry_sign: | Este canal no ha sido establecido anteriormente.');
					return;
				}

				guildConfiguration.ticketsChannelId = guildConfiguration.ticketsChannelId.filter((channelId) => channelId !== channel.id);

				await guildConfiguration.save();

				await interaction.reply(`🎫 | ¡Se borro el canal de tickets con éxito! (${channel})`);
				return;


				break;
		}

	},
};