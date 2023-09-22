const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const { getJson } = require(`${process.cwd()}/src/helpers/HttpUtils`);
const NekosLife = require("nekos.life");
const neko = new NekosLife();

// const choices = ["hug", "kiss", "cuddle", "feed", "pat", "poke", "slap", "smug", "tickle", "wink"]

module.exports = {
	data: new SlashCommandBuilder()
		.setName("reaccionar")
		.setDescription("🎭 | Apartado de reacciones interactivas.")
		.addStringOption(option =>
			option.setName('categoría')
				.setDescription('The gif category')
				.setRequired(true)
				.addChoices(
					{ name: 'Abrazo', value: 'hug' },
					{ name: 'Beso', value: 'kiss' },
					{ name: 'Abrazo', value: 'cuddle' },
					{ name: 'Guiño', value: 'wink' },
					{ name: 'Alimentar', value: 'feed' },
					{ name: 'Palmadita', value: 'pat' },
					{ name: 'Dar un toque', value: 'poke' },
					{ name: 'Cachetear', value: 'slap' },
					{ name: 'Presumir', value: 'smug' },
					{ name: 'Cosquillas', value: 'tickle' },
				)),
	run: async (client, interaction) => {
		try {
			await interaction.deferReply();
			const trCategory = {
				hug: 'Abrazaste a un desconocido',
				kiss: 'Besaste a un desconocido',
				cuddle: 'Abrazo uwu',
				feed: 'Alimentaste a un desconocido',
				pat: 'Palmadita',
				poke: 'Dio un toque a un desconocido',
				slap: 'Le diste una Cacheteada a un desconocido', 
				smug: 'Presumiste a un desconocido',
				tickle: 'Acabas de hacer Cosquillas a un desconocido'
			}

			
			const genReaction = async (category, user) => {
				try {
					let imageUrl;

						imageUrl = (await neko[category]()).url;

					return new EmbedBuilder()
						.setAuthor({ name: `${trCategory[category]}!` })
						.setColor('Random')
						.setImage(imageUrl)
						.setFooter({ text: `${user.tag}` });
				} catch (ex) {
					return interaction.followUp({
						content: ":bangbang: No puede completar la interacción, vuelve a intentarlo otra vez.",
						ephemeral: true
					})
				}
			};

			const choice = interaction.options.getString("categoría");
			const embed = await genReaction(choice, interaction.user);
			await interaction.followUp({ embeds: [embed] });
		} catch (err) {}

	}
}