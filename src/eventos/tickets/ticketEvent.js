const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	Colors,
	Events,
	PermissionFlagsBits
} = require('discord.js');
const transcript = require('discord-html-transcripts');
const TicketsDB = require(`${process.cwd()}/src/models/Tickets.js`);

module.exports = {
	name: Events.InteractionCreate,
	emiter: "on",
	run: async (client, interaction) => {
		try {
			if (!interaction.isButton()) return;
			const data = await TicketsDB.findOne({ guildId: interaction.guildId });
			if (!data) return;

			if (!interaction.guild.members.me.permissions.has([PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.MentionEveryone])) return interaction.reply({
				content: ':no_entry_sign: | No tengo los permisos para usar el sistema de tickets correspondientemente: (Gestionar Canales, Ver mensajes,  Ver el historial de mensajes,  Enviar mensajes, Mencionar Everyone)\n📄 | Nota: Para evitar enrollamientos con los permisos, puedes asignarme el permiso de Administrador.',
				ephemeral: true
			})

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder().setCustomId('claim').setLabel('Reclamar').setEmoji('📩').setStyle(ButtonStyle.Secondary),
					new ButtonBuilder().setCustomId('close').setLabel('Cerrar').setEmoji('🗑').setStyle(ButtonStyle.Danger),
					new ButtonBuilder().setCustomId('transcript').setLabel('Transcripción').setEmoji('📁').setStyle(ButtonStyle.Primary)
				)

			const EmbedLogging = new EmbedBuilder().setColor(Colors.White).setFooter({ text: 'Por: '+interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

			let StaffRole = interaction.guild.roles.cache.get(data.roleStaff);
			let LogChannel = data.logTrscChannel;

			let AlreadyAChannel = interaction.guild.channels.cache.find(c => c.topic == interaction.user.id)

			if (interaction.customId === "close") {
				client.channels.cache.get(LogChannel).send({
					embeds: [EmbedLogging.setDescription(`🗑 | Ticket cerrado en #${interaction.channel.name}\n📂 | Transcripción completada en #${interaction.channel.name}`)],
					files: [await transcript.createTranscript(interaction.channel)]
				})
				
				let channel = interaction.channel;
				channel.delete()
			} else if (interaction.customId === "claim") {
				if (!interaction.member.roles.cache.has(data.roleStaff)) {
					interaction.reply({
						content: ':bangbang: | ¡No tienes permiso para usar este apartado!',
						ephemeral: true
					})
                    return;
				}
				
				interaction.reply({
					embeds: [{
						description: `🦺 | Este ticket lo reclamo ${interaction.user}`,
						footer: {
							text: client.user.username,
							iconURL: client.user.avatarURL()
						},
						color: Colors.Orange
					}]
				})
			} else if (interaction.customId === "transcript") {
				if (!interaction.member.roles.cache.has(data.roleStaff)) {
					interaction.reply({
						content: ':bangbang: | ¡No tienes permiso para usar este apartado!',
						ephemeral: true
					})
                    return;
				}
				
				interaction.reply({
					embeds: [{
						description: `📁 | La transcripción ha sido completada.`,
						footer: {
							text: client.user.username, 
							iconURL: client.user.avatarURL()
						},
						color: Colors.Yellow
					}]
				})

				client.channels.cache.get(LogChannel).send({
					embeds: [EmbedLogging.setDescription(`📁 | Transcripción completada en #${interaction.channel.name}`).setColor(Colors.Yellow)],
					files: [await transcript.createTranscript(interaction.channel)]
				})
			} else
			  if (AlreadyAChannel) {
				  interaction.reply({ 
					  content: ":bangbang: | Ya tienes un ticket abierto en el servidor, espera a que cierren el otro y intenta otra vez.",
				      ephemeral: true 
				  })
				  return;
			  }
				if (interaction.customId === "answer") {
				
				interaction.guild.channels.create({
					name: `ticket de ${interaction.user.username}`,
					type: ChannelType.GuildText,
					topic: interaction.user.id,
					permissionOverwrites: [{
						id: interaction.user.id,
						allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
						deny: [PermissionFlagsBits.MentionEveryone]
					},
					{
						id: client.user.id,
						allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.MentionEveryone],
					},
					{
						id: interaction.guild.id,
						deny: [PermissionFlagsBits.ViewChannel]
					},
					{
						id: StaffRole,
						allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
						deny: [PermissionFlagsBits.MentionEveryone]
					}
					]
				}).then((c) => {
					c.send({
						content: `${interaction.user}`,
						embeds: [{
							title: "Tema: Ticket",
							description: "Cuenta a detalle tu problema así el personal lo resuelve rápidamente.",
							footer: {
								text: client.user.username,
							    iconURL: client.user.avatarURL()
							},
							color: Colors.Blue
						}],
						components: [
							row
						]
					})
					interaction.reply({
						content: `✅ | Su ticket ha sido abierto exitosamente. (<#${c.id}>)`,
						ephemeral: true
					})
				})

			}
		} catch (error) {
			return;
			// console.log(`Error in ticketsEvent.js: ${error}`);
		}
	}
};
