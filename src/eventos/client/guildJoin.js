const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildCreate,
	emiter: "once",
	run: async (client, guild) => {

		let owners = await guild?.fetchOwner();

		const logEmbed = new EmbedBuilder()
            .setColor('White')
            .setTitle('New Guild Joined')
            .addFields(
                { name: 'Guild Name', value: `${guild.name} (${client.guilds.cache.size})` },
                { name: "Guild ID", value: `${guild.id}` },
				{ name: "Owner", value: `${guild.members.cache.get(owners.id) ? guild.members.cache.get(owners.id).user.tag : 'Unknown'} | ${owners.id}` },
				{ name: "Members", value: `${guild.memberCount}` }
            )
			.setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp()

        client.channels.cache.get('1151644155857076295').send({
            embeds: [logEmbed]
        });

	}
};