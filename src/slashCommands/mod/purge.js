const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription("🗑 | Borra hasta 100 mensajes de un canal.")
		.addNumberOption((option) =>
			option
				.setName('cantidad')
				.setDescription("- Cantidad de mensajes a borrar!")
				.setRequired(true)
				.setMaxValue(100)
				.setMinValue(1)
		)
		.addUserOption((option) => option
			.setName('miembro')
			.setDescription('- Cantidad de mensajes a borrar'))
		.setDMPermission(false),
	run: async (client, interaction) => {
		try {
			const { options, member } = interaction;

			if (!interaction.guild.members.me.permissions.has('ManageMessages') && !interaction.guild.members.me.permissions.has('Administrator')) return interaction.reply({ content: ':bangbang: | ¡No tienes permiso para usar este apartado!', epehmeral: true });

			const numberDeleted = options.getNumber("cantidad");
			const user = options.getUser('miembro');

			if (isNaN(numberDeleted)) return interaction.reply({
				content: ':bangbang: | Ingresa una cantante válida',
				ephemeral: true
			});

			if (numberDeleted <= 0) return interaction.reply({
				content: ':bangban: | ¡Alto ahí¡',
				ephemeral: true
			});

			if (user) {
				let i = 0;
				let messagesDelete = [];
				const channelMessages = await interaction.channel.messages.fetch();
				channelMessages.forEach((message) => {
					if (message.author.id === user.id && amount > i) {
						i++;
						messagesDelete.push(message);
					}
				});

				if (messagesDelete.length === 0) {
					interaction.reply({
						content: `:no_entry_sign: | No encontre mensajes de ${user.tag}!`,
						ephemeral: true
					});
					return;
				}

				interaction.channel.bulkDelete(messagesDelete, true).then((messages) => {
					interaction.reply({
						content: `🧹 | ¡Se borrarón ${messages.size} mensajes de ${user.tag} en este canal!`,
						ephemeral: true,
					})
					return;
				});
				 } else {

				interaction.channel.bulkDelete(numberDeleted, true).then((messages) => {
					interaction.reply({
						content: `🧹 | ¡Se borrarón ${messages.size} mensajes en este canal!`,
						ephemeral: true,
					})
					return;
				});
			}
		} catch (e) {
			return interaction.reply({ content: "🗑 | Ocurrio un error extraño, quizás los mensajes son muy viejos.", ephemeral: true })
			console.log(e)
		}
	}
};