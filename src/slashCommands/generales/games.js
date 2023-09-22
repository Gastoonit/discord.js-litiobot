const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { Connect4, Flood, RockPaperScissors, TicTacToe } = require("discord-gamecord");

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`juego`)
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.setDMPermission(false)
		.setDescription(`🎮 | ¡Comandos para jugar con tus amigos!!`)
		.addSubcommand((command) =>
			command
				.setName("conectar4")
				.setDescription(
					`🎮 | Juega al conectar4 con tus amigos!`
				)
				.addUserOption((option) =>
					option
						.setName("miembro")
						.setDescription("- Miembro")
						.setRequired(true)
				)
		)
		.addSubcommand((command) =>
			command
				.setName("tictactoe")
				.setDescription(
					`🎮 | Juega al tictactoe con tus amigos!`
				)
				.addUserOption((option) =>
					option
						.setName("miembro")
						.setDescription("- Miembro")
						.setRequired(true)
				)
		)
		.addSubcommand((command) =>
			command.setName("flood").setDescription(`🟥 | ¡Flood!`)
		)
		.addSubcommand((command) =>
			command
				.setName("rps")
				.setDescription(
					`🎮 | Juega al piedra papel o tijeras con tus amigos!`
				)
				.addUserOption((option) =>
					option
						.setName("miembro")
						.setDescription("- Miembro")
						.setRequired(true)
				)
		),
	run: async (client, interaction) => {
		try {
			if (
				interaction.options.getSubcommand() ===
				"conectar4"
			) {
				const member =
					interaction.options.getUser("miembro");
				if (member.bot)
					return interaction.reply({
						content: "❗️ | No puedes jugar con un Bot.",
						ephemeral: true,
					});
				if (member === interaction.user)
					return interaction.reply({
						content: "❗️ | No puedes jugar contra ti.",
						ephemeral: true,
					});

				const Game = new Connect4({
					message: interaction,
					isSlashGame: true,
					opponent: member,
					embed: {
						title: "Conectar 4",
						statusTitle: "Estado:",
						color: "#e7edf0",
					},
					buttons: {
						accept: "Aceptar",
						reject: "Rechazar",
					},
					emojis: {
						board: ":black_circle:",
						player1: "🟠",
						player2: "🔵",
					},
					timeoutTime: 60000,
					buttonStyle: "SECONDARY",
					turnMessage: "{emoji} | **{player}**",
					winMessage: "🧧 | ¡**{player}** gano el juego!",
					tieMessage: "¡El Juego empató! nadie ganó el juego!",
					timeoutMessage:
						"❗️ | El juego terminó por inactividad.",
					playerOnlyMessage:
						"❗️ | ¡No puedes usar los botones!",
					requestMessage:
						"️🎮 | Recibiste una invitación de **{player}** para jugar al conectar4. Tu decides si aceptarla o no, tienes 1 minuto.",
					rejectMessage:
						"️❗️ | El miembro que invitaste anteriormente te ha rechazado la invitación.",
					reqTimeoutMessage:
						"❗️ | El miembro no ha respondido.",
				});

				Game.startGame();
			}
			if (interaction.options.getSubcommand() === "flood") {
				const GameFlood = new Flood({
					message: interaction,
					isSlashGame: true,
					embed: {
						title: "Flood",
						color: "#5865F2",
					},
					difficulty: 13,
					timeoutTime: 60000,
					buttonStyle: "PRIMARY",
					emojis: ["🟥", "🟦", "🟧", "🟪", "🟩"],
					winMessage: "¡Ganaste! Tomaste **{turns}** turnos. ",
					loseMessage:
						"¡Perdiste! Tomaste **{turns}** turnos.",
					playerOnlyMessage:
						":bangbang: | Sólo {player} puede usar estos botones.",
				});

				GameFlood.startGame();
			}
			if (interaction.options.getSubcommand() === "rps") {
				const member =
					interaction.options.getUser("miembro");
				if (member.bot)
					return interaction.reply({
						content: "❗️ | No puedes jugar con un Bot.",
						ephemeral: true,
					});
				if (member === interaction.user)
					return interaction.reply({
						content: "❗️ | No puedes jugar contra ti.",
						ephemeral: true,
					});

				const GameRps = new RockPaperScissors({
					message: interaction,
					isSlashGame: true,
					opponent: user,
					embed: {
						title: "PPOT",
						color: "Random",
						description:
							"¡Presiona el botón y selecciona una opción!",
					},
					buttons: {
						rock: "Piedra",
						paper: "Papel",
						scissors: "Tijera",
						accept: "Sí",
						reject: "No",
					},
					emojis: {
						rock: "🌑",
						paper: "📄",
						scissors: "✂️",
					},
					mentionUser: true,
					timeoutTime: 60000,
					buttonStyle: "PRIMARY",
					requestMessage:
						"🎮 | {player} te ha invitado a una ronda de **Piedra, papel o tijera**.",
					rejectMessage:
						"❗️ | El jugador rechazó tu solicitud de una ronda de **Piedra, papel o tijera**.",
					pickMessage: "👇 | Tú eliges {emoji}.",
					winMessage: "¡**{player}** ganó el juego! ¡Felicidades!",
					tieMessage: "¡El juego empató! ¡Nadie ganó el Juego!",
					timeoutMessage:
						"¡El juego quedó sin terminar! ¡Nadie ganó el Juego!",
					reqTimeoutMessage:
						"❗️ | ¡El miembro no respondió al desafío a tiempo!",
					playerOnlyMessage:
						"❗️ | Solo {player} y {opponent} pueden usar estos botones.",
				});

				GameRps.startGame();
			}
			if (
				interaction.options.getSubcommand() ===
				"tictactoe"
			) {
				const member =
					interaction.options.getUser("miembro");
				if (member.bot)
					return interaction.reply({
						content: "❗️ | No puedes jugar con un Bot.",
						ephemeral: true,
					});
				if (member === interaction.user)
					return interaction.reply({
						content: "❗️ | No puedes jugar contra ti.",
						ephemeral: true,
					});

				const GameTTT = new TicTacToe({
					message: interaction,
					isSlashGame: true,
					opponent: member,
					embed: {
						title: "Tic Tac Toe",
						color: "#5865F2",
						statusTitle:
							"Estado de la partida:",
						overTitle: "Juego perdido:",
					},
					emojis: {
						xButton: "❌",
						oButton: "🔵",
						blankButton: "➖",
					},
					mentionUser: true,
					timeoutTime: 60000,
					xButtonStyle: "DANGER",
					oButtonStyle: "PRIMARY",
					turnMessage:
						"{emoji} | Es turno de jugador **{player}**.",
					winMessage: "{emoji} | ¡**{player}** gano el Juego!",
					requestMessage:
						"🎮 | {player} te ha invitado a una ronda de **Piedra, papel o tijera**.",
					rejectMessage:
						"❗️ | El jugador rechazó tu solicitud de una ronda de **Piedra, papel o tijera**.",
					tieMessage: "¡El partido empatado! Nadie ganó el juego!",
					timeoutMessage:
						"¡El juego quedó inacabado! ¡Nadie ganó el juego!",
					playerOnlyMessage:
						":bangbang: | ¡Solo {player} y {opponent} pueden usar los botones!",
				});

				GameTTT.startGame();
			}
		} catch (err) {
			return interaction.reply({
				content: ":bangbang: | Wow, ocurrió un error extraño con la API, por favor vuelve a intentarlo!",
				ephemeral: true,
			});
		}
	},
};
