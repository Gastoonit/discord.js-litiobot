const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors, PermissionsBitField } = require("discord.js");
const GuildConfiguration = require(`${process.cwd()}/src/models/GuildConfiguration.js`);
const TicketsDB = require(`${process.cwd()}/src/models/Tickets.js`);
const linkSchema = require(`${process.cwd()}/src/models/LinkSchema.js`);
const modlogsDB = require(`${process.cwd()}/src/models/ModLog.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`establecer`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false)
        .setDescription(`♻️ | ¡Establece y configura un canal!`)
        .addSubcommand(command =>
            command
                .setName("tickets")
                .setDescription(`🎫 | Establece el canal de tickets!`)
                .addChannelOption(option =>
                    option
                        .setName("canal")
                        .setDescription(`- Establece el canal`)
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addChannelOption(option =>
                    option
                        .setName("canal_registros")
                        .setDescription(`- Establece el canal de registros`)
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addRoleOption(option =>
                    option
                        .setName("rol_staff")
                        .setDescription(`- Establece el rol de staff`)
                        .setRequired(true)
                )
                .addStringOption(options =>
                    options
                        .setName("descripción_embed")
                        .setDescription("- Descripción del panel de tickets")
                        .setRequired(false)
                )
                .addStringOption(options =>
                    options
                        .setName("título_embed")
                        .setDescription("- Titulo del panel de tickets")
                        .setRequired(false)
                )
        )
        .addSubcommand(command =>
            command
                .setName("antilink")
                .setDescription(`📢 | ¡Establece el sistema anti links!`)
                .addStringOption(option =>
                    option
                        .setName("permisos")
                        .setRequired(true)
                        .setDescription(
                            "Elija los permisos para que ignore el sistema anti enlaces"
                        )
                        .addChoices(
                            {
                                name: "Gestionar Canales",
                                value: "ManageChannels"
                            },
                            {
                                name: "Gestionar Servidor",
                                value: "ManageGuild"
                            },
                            { name: "Embed Links", value: "EmbedLinks" },
                            { name: "Archivos adjuntos", value: "AttachFiles" },
                            {
                                name: "Gestionar Mensajes",
                                value: "ManageMessages"
                            },
                            { name: "Administrador", value: "Administrator" }
                        )
                )
                .addNumberOption(option =>
                    option
                        .setName("aislamiento")
                        .setRequired(true)
                        .setDescription(
                            "Elija el tiempo de aislamiento del sistema anti enlaces"
                        )
                        .addChoices(
                            { name: "5 minutos", value: 5 * 60 * 1000 },
                            { name: "10 minutos", value: 10 * 60 * 1000 },
                            { name: "30 minutos", value: 30 * 60 * 1000 },
                            { name: "1 hora", value: 60 * 60 * 1000 },
                            { name: "3 horas", value: 3 * 60 * 60000 },
                            { name: "1 día", value: 24 * 60 * 60 * 1000 }
                        )
                )
                .addStringOption(options =>
                    options
                        .setName("mensaje_personalizado")
                        .setDescription(
                            "- Variable %usuario menciona al usuario, %tiempo 5 minutos"
                        )
                        .setRequired(false)
                )
        )
        .addSubcommand(command =>
            command
                .setName("antilink_editar")
                .setDescription(`📢 | ¡Edita el sistema anti links!`)
                .setDescription(
                    "Elija los permisos para que ignore el sistema anti enlaces"
                )
                .addStringOption(option =>
                    option
                        .setName("permisos")
                        .setRequired(true)
                        .setDescription(
                            "Elija los permisos para que ignore el sistema anti enlaces"
                        )
                        .addChoices(
                            {
                                name: "Gestionar Canales",
                                value: "ManageChannels"
                            },
                            {
                                name: "Gestionar Servidor",
                                value: "ManageGuild"
                            },
                            { name: "Embed Links", value: "EmbedLinks" },
                            { name: "Archivos adjuntos", value: "AttachFiles" },
                            {
                                name: "Gestionar Mensajes",
                                value: "ManageMessages"
                            },
                            { name: "Administrador", value: "Administrator" }
                        )
                )
                .addNumberOption(option =>
                    option
                        .setName("aislamiento")
                        .setRequired(true)
                        .setDescription(
                            "Elija el tiempo de aislamiento del sistema anti enlaces"
                        )
                        .addChoices(
                            { name: "5 minutos", value: 5 * 60 * 1000 },
                            { name: "10 minutos", value: 10 * 60 * 1000 },
                            { name: "30 minutos", value: 30 * 60 * 1000 },
                            { name: "1 hora", value: 60 * 60 * 1000 },
                            { name: "3 horas", value: 3 * 60 * 60000 },
                            { name: "1 día", value: 24 * 60 * 60 * 1000 }
                        )
                )
                .addStringOption(options =>
                    options
                        .setName("mensaje_personalizado")
                        .setDescription(
                            "- Variable %usuario menciona al usuario, %tiempo 5 minutos"
                        )
                        .setRequired(false)
                )
        )
	.addSubcommand(command =>
            command
                .setName("auditoria_mods")
                .setDescription(`🔦 | Establece el canal de auditoria para moderadores!`)
                .addChannelOption(option =>
                    option
                        .setName("canal")
                        .setDescription(`- Establece el canal`)
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )),
    run: async (client, interaction) => {
        // const { guild, options } = interaction;
        let guildConfiguration = await GuildConfiguration.findOne({
            guildId: interaction.guildId
        });

        if (!guildConfiguration) {
            guildConfiguration = new GuildConfiguration({
                guildId: interaction.guildId
            });
        }

        let embedResponse = new EmbedBuilder().setColor("Yellow").setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true })
        });

        switch (interaction.options.getSubcommand()) {
            case "tickets":
                const { options } = interaction;
                if (
                    !interaction.member.permissions.has(
                        PermissionsBitField.Administrator
                    )
                )
                    return interaction.reply({
                        content: `:no_entry_sign: | ¡No puedes utilizar este apartado, necesitas ser Administrador!`,
                        ephemeral: true
                    });

                const channel = options.getChannel("canal");
                const channelLog = options.getChannel("canal_registros");
                const roleStaff = options.getRole("rol_staff");
                const descriptionMessage =
                    options.getString("descripción_embed") ||
                    "🎫 - Elige una razón específica para darte acceso a un ticket.";
                const titleMessage =
                    options.getString("título_embed") || "Abrir Ticket";

                if (guildConfiguration?.ticketsChannelId.includes(channel.id)) {
                    await interaction.reply(
                        ":no_entry_sign: | Este canal ya ha sido establecido anteriormente."
                    );
                    return;
                }

                guildConfiguration.ticketsChannelId.push(channel.id);
                await guildConfiguration.save();

                await TicketsDB.findOneAndUpdate(
                    { guildId: interaction.guildId },
                    {
                        roleStaff: roleStaff.id,
                        logTrscChannel: channelLog.id
                    },
                    {
                        new: true,
                        upsert: true
                    }
                );

                interaction.reply({
                    embeds: [
                        embedResponse.setDescription(
                            `- 🎫 | ¡Se estableció el canal de tickets con éxito!\n- ♻️| Canal: (${channel}) | Rol del personal: (${roleStaff}) | Canal de registros: (${channelLog})`
                        )
                    ]
                });

                await channel.send({
                    embeds: [
                        {
                            title:
                                titleMessage.length > 27
                                    ? titleMessage.substr(0, 27) + "..."
                                    : titleMessage,
                            description:
                                descriptionMessage.length > 999
                                    ? descriptionMessage.substr(0, 999) + "..."
                                    : descriptionMessage,
                            footer: {
                                text: client.user.username,
                                iconURL: client.user.avatarURL()
                            },
                            color: Colors.Yellow
                        }
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId("answer")
                                .setLabel("Obtener un ticket")
                                .setEmoji("🎫")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });
                return;

                break;
        }
        switch (interaction.options.getSubcommand()) {
            case "antilink":
                const permissions = interaction.options.getString("permisos");
                const time = interaction.options.getNumber("aislamiento");
                const messagePer = interaction.options.getString(
                    "mensaje_personalizado"
                );

                const Data = await linkSchema.findOne({
                    Guild: interaction.guild.id
                });

                if (Data)
                    return await interaction.reply({
                        content: `:bangbang: | Ya tienes configurado el sistema de enlace, así que deshabilita \`/borrar antilink\` para eliminarlo.`,
                        ephemeral: true
                    });

                if (!Data) {
                    linkSchema.create({
                        Guild: interaction.guild.id,
                        Perms: permissions,
                        Message:
                            messagePer ||
                            "%usuario, ¡No puedes enviar enlaces en este servidor! El aislamiento expira: %tiempo",
                        Timeout: time
                    });
                }

                await interaction.reply({
                    embeds: [
                        embedResponse.setDescription(
                            `🚦 | ¡Se estableció el sistema de anti-links con éxito!`
                        )
                    ]
                });

                return;

                break;
        }
        switch (interaction.options.getSubcommand()) {
            case "antilink_editar":
                const Data = await linkSchema.findOne({
                    Guild: interaction.guildId
                });
                const permissions2 = interaction.options.getString("permisos");
                const time = interaction.options.getNumber("aislamiento");
                const messagePer = interaction.options.getString(
                    "mensaje_personalizado"
                );

                if (!Data)
                    return await interaction.reply({
                        content: `:bangbang: | ¡No hay ningún sistema anti-link configurado aquí!`,
                        ephemeral: true
                    });
                else {
                    await linkSchema.deleteMany({ Guild: interaction.guildId });

                    await linkSchema.create({
                        Guild: interaction.guild.id,
                        Perms: permissions2,
                        Message:
                            messagePer ||
                            "%usuario, ¡No puedes enviar enlaces en este servidor! El aislamiento exipra: %tiempo",
                        Timeout: time
                    });

                    await interaction.reply({
                        embeds: [
                            embedResponse.setDescription(
                                `- 📢 | ¡Se editó el sistema de anti-links con éxito!\n- 📝 | ${
                                    messagePer ||
                                    "%usuario, ¡No puedes enviar enlaces en este servidor! El aislamiento expira: %tiempo"
                                }`
                            )
                        ]
                    });
                }

                return;

                break;
        }
        switch (interaction.options.getSubcommand()) {
            case "auditoria_mods":
                const channelLogMod = interaction.options.getChannel("canal");

                const data = await modlogsDB.findOne({
                    GuildID: interaction.guild.id
                });
                if (data)
                    return await interaction.reply({
                        content: `:bangbang: | Ya tienes configurado el sistema de auditoria para mods, así que deshabilita \`/borrar auditoria_mods\` para eliminarlo.`,
                        ephemeral: true
                    });
                if (!data) {
                    modlogsDB.create({
                        GuildID: interaction.guild.id,
                        ChannelID: channelLogMod.id,
                    });
                }

                await interaction.reply({
                    content: `🔦 | El canal de auditoria para moderarodes ha sido establecido con exitó!`
                });

                return;

                break;
        }
    }
};
