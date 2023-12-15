const { SlashCommandBuilder, Events, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const Schema = require(`${process.cwd()}/src/models/Warns.js`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('advertencia')
		.setDescription("📄 | Advierte o interactua con el apartado.")
		.setDMPermission(false)
		.addSubcommand((command) => command
			.setName("otorgar")
			.setDescription(
				`🧾 | ¡Advierte a un miembro del servidor!`
			)
			.addUserOption((option) => option.setName('miembro').setDescription('- Miembro')
				.setRequired(true))
		)
		.addSubcommand((command) => command
			.setName("visualizar")
			.setDescription(
				`🔎 | Ve las advertencias de un miembro.`
			)
			.addUserOption((option) => option.setName('miembro').setDescription('- Miembro')
				.setRequired(true))
		)
		.addSubcommand((command) => command
			.setName("quitar")
			.setDescription(
				`🚫 | Quita una advertencia de un miembro.`
			)
			.addNumberOption((option) => option.setName('advertencia_id').setDescription('- ID de la advertencia')
				.setRequired(true))
			)
		.addSubcommand((command) => command
			.setName("quitar_todas")
			.setDescription(
				`🚫 | Quita todas las advertencias de un miembro.`
			)
			.addUserOption((option) => option.setName('miembro').setDescription('- Miembro')
				.setRequired(true))
			)
		.setDMPermission(false),
	run: async (client, interaction) => {
		try {

			function getRndInteger(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}
			// await interaction.deferReply({ ephemeral: false })

			if (interaction.options.getSubcommand() === 'otorgar') {

				if (!interaction.member.permissions.has('Administrator')) return await interaction.reply({
					content: ':bangbang: | ¡No tienes permiso para usar este apartado! (Administrador)',
					ephemeral: true
				});

				const member = interaction.options.getUser('miembro');

					const modal = new ModalBuilder()
						.setCustomId('radv-modal')
						.setTitle('Sistema de Advertencias');

					const reasonInput = new TextInputBuilder()
						.setCustomId('reason')
						.setLabel("Ingresa la razón")
						.setStyle(TextInputStyle.Paragraph)
						.setPlaceholder('Razón: \'Uso mal los canales.\'')
						.setMaxLength(1000)
						.setRequired(false);

					const firstRow = new ActionRowBuilder().addComponents(reasonInput);

					modal.addComponents(firstRow)
					await interaction.showModal(modal);

					client.on(Events.InteractionCreate, async (interaction) => {
						if (!interaction.isModalSubmit()) return;

						if (interaction.customId === 'radv-modal') {

							const reason = interaction.fields.getTextInputValue('reason');

							const dataSaved = new Schema({
								_id: getRndInteger(2000, 9999),
								guildId: interaction.guild.id,
								memberId: member.id,
								modId: interaction.user.id,
								razón: reason || 'Sin descripción',
								timestamp: Date.now(),
							})
							await dataSaved.save()

							return interaction.reply({
								content: `🧾 | ${member} (ID: ${member.id}) ha sido advertido, usa */advertir ver [miembro]*.`
							})

						}
					});
					
			}

			if (interaction.options.getSubcommand() === 'visualizar') {

				const member = interaction.options.getUser('miembro');

				const memberAdv = await Schema.find({
					memberId: member.id,
					guildId: interaction.guild.id,
				});
				if (!memberAdv?.length) return await interaction.reply({
					content: `🧾 | **Advertencias de: ${member.tag || member.user.tag} (ID: ${member.id})**\n🦺 | El miembro no tiene ninguna advertencia actualmente.`,
					ephemeral: false
				})

				const contentAdvs = memberAdv.map((adv) => {
					var modTag = interaction.guild.members.cache.get(
						adv.modId
					)

					return [
						`- ID Advertencia: \`${adv._id}\` | Autor: ${modTag.tag || modTag.user.tag} | Fecha: <t:${parseInt(adv.timestamp / 1000)}:D> | Razón: \`${adv.razón}\``,
					]
				}).join("\n")

				const buff = Buffer.from(contentAdvs)
				const fil = new AttachmentBuilder(buff, { name: "advs.txt" })

				if (contentAdvs.length > 1997) return await interaction.reply({
					content: "📂 | El contenido de las advertencias pasan de los 2000 carácteres, igualmente las puedes ver en el archivo de abajo:",
					files: [fil]
				})

				return interaction.reply({
					content: `:card_box: | **Advertencias de: ${member.tag || member.user.tag} (ID: ${member.id})**\n${contentAdvs}`
				})

			}

			if (interaction.options.getSubcommand() === 'quitar') {

				if (!interaction.guild.members.me.permissions.has('Administrator')) return await interaction.reply({
					content: ':bangbang: | ¡No tienes permiso para usar este apartado! (Administrador)',
					ephemeral: true
				});
				
				const advId = interaction.options.getNumber("advertencia_id");

				const data = await Schema.findByIdAndDelete(advId);
				if (!data) return interaction.reply({
					content: ":bangbang: | La ID de la advertencia es inválida!",
                    ephemeral: true
				})

				const member = interaction.guild.members.cache.get(data.memberId);
				return interaction.reply({
					content: `:white_check_mark: | Advertencia borrada.\n👤 | Miembro: ${member.tag || member.user.tag} (ID: ${member.id})\nAdvertencia ID: \`${advId}\``
				})
			}

			if (interaction.options.getSubcommand() === 'quitar_todas') {

				if (!interaction.guild.members.me.permissions.has('Administrator')) return await interaction.reply({
					content: ':bangbang: | ¡No tienes permiso para usar este apartado! (Administrador)',
					ephemeral: true
				});
				
				const memberMention = interaction.options.getUser("miembro");

				const data = await Schema.findOne({ memberId: memberMention.id });
				if (!data) return interaction.reply({
					content: ":bangbang: | Este usuario no tiene advertencias!",
					ephemeral: true
				})
                else {
				
				await Schema.deleteMany({ memberId: memberMention.id })

				const member = interaction.guild.members.cache.get(data.memberId);
				return interaction.reply({
					content: `:white_check_mark: | Advertencias borradas con éxito.\n👤 | Miembro: ${member.tag || member.user.tag} (ID: ${member.id})`
				})
			  }
			}

		} catch (e) {
			return await interaction.reply({
				content: "🤔 | Ocurrio un error extraño, quizás estas usando los comandos muy rápido.",
				ephemeral: true
			})
			console.log(e)
		}
	}
};
