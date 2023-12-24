const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const modlogsDB = require(`${process.cwd()}/src/models/ModLog.js`);

module.exports = (client) => {
  client.modlogging = async () => {
    /* Botones */
    let rnd = Math.ceil(Math.random() * 500);
    const Row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder().setCustomId(`ban-modl-${rnd}`).setLabel("Banear").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`kick-modl-${rnd}`).setLabel("Kickear").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`untimeout-modl-${rnd}`).setLabel("Quitar aislamiento").setStyle(ButtonStyle.Success),
    )
    /* ModLog */
    client.modlogs = async function({
      Member, Action, Color, Reason, Time, Link
    }, interaction) {
      const data = await modlogsDB.findOne({
        GuildID: interaction.guild.id
      })
      if (!data) return;

      const channel = interaction.guild.channels.cache.get(data.ChannelID);
      const LogsEmbed = new EmbedBuilder()
      .setColor(Color || 'Red')
      .setAuthor({
        name: 'Auditoria Moderación', iconURL: client.user.displayAvatarURL({
          dynamic: true
        })})
      .addFields([{
        name: "Razón", value: `${Reason.length > 1996 ? Reason.substr(0, 1996) + "...": Reason || "Razón no dada."}`, inline: false
      },
        {
          name: "Persona sancionada", value: `${Member.user.displayName || Member.author.displayName} (<@${Member.id}>) (${Member.id})`, inline: false
        }])
      .setThumbnail(Member.user.displayAvatarURL({
        dynamic: true
      }) || Member.author.displayAvatarURL({
        dynamic: true
      }))
      .setFooter({
        text: `Acción ejecutada: ${Action}`
      })

      if (Time) {
        LogsEmbed.addFields([{
          name: "Expiración del aislamiento", value: `${Time || 'Tiempo no dado.'}`, inline: true
        }])
      }
      if (Link) {
        LogsEmbed.addFields([{
          name: "Link:", value: `🚦 ¡Peligro, usa esta información bajo tu responsabilidad!\n${Link.length > 1996 ? Link.substr(0, 1996) + "...": Link || 'Link no dado. '}`, inline: true
        }])
      }

      let msg = await channel.send({
        embeds: [LogsEmbed], components: [Row]
      })

      // Tiempo/time: 3 horas / hours
      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button, time: 10800000, dispose: true
      });

      collector.on('collect', async i => {

        await i.deferReply({
          ephemeral: true
        })
        const embedSuccess = new EmbedBuilder().setColor('Random')

        if (!i.member.permissions.has(PermissionFlagsBits.Administrator)) return i.editReply({
          content: `:no_entry_sign: | ¡No puedes utilizar este apartado, necesitas ser Administrador!`,
          ephemeral: true
        });

        if (i.customId === `ban-modl-${rnd}`) {
          try {
            await i.guild.members.ban(Member, {
              Reason
            });
          } catch(e) {
            return i.reply({
              content: ":bangbang: | ¡No se pudo banear al miembro, intentalo de nuevo!", ephemeral: true
            })
          }

          await msg.edit({
            components: [new ActionRowBuilder().setComponents(msg.components[0].components.map((component) => ButtonBuilder.from(component.toJSON()).setDisabled(true)))]
          }).catch((e) => {
            return;
          })
          await i.editReply({
            embeds: [embedSuccess.setDescription(`\`>\` 🔨 ¡${Member.user.displayName} (Id: ${Member.id}) ha sido correctamente baneado del servidor!, Razón: ${Reason}`)]
          });
        }
        if (i.customId === `kick-modl-${rnd}`) {
          try {
            await i.guild.members.kick(Member, {
              Reason
            });
          } catch(e) {
            return i.reply({
              content: ":bangbang: | ¡No se pudo patear al miembro, intentalo de nuevo!", ephemeral: true
            })
          }

          await msg.edit({
            components: [new ActionRowBuilder().setComponents(msg.components[0].components.map((component) => ButtonBuilder.from(component.toJSON()).setDisabled(true)))]
          }).catch((e) => {
            return;
          })
          await i.editReply({
            embeds: [embedSuccess.setDescription(`\`>\` 🔨 ¡${Member.user.displayName} ha sido pateado con éxito del servidor!, Razón: ${Reason}`)]
          });
        }
        if (i.customId === `untimeout-modl-${rnd}`) {
          timedout = Member.isCommunicationDisabled()

          if (!timedout) {
            return i.editReply({
              content: ":bangbang: | ¡El miembro no esta aislado!", ephemeral: true
            })
          }

          try {
            await Member.timeout(null)
          } catch(e) {
            return i.reply({
              content: ":bangbang: | ¡No se pudo aislar al miembro, intentalo de nuevo!", ephemeral: true
            })
          }

          await i.editReply({
            embeds: [embedSuccess.setDescription(`\`>\` ⏲️ ¡Se le quito el aislamiento con éxito a ${Member.user.displayName}!, Razón: ${Reason}`)]
          });
        }
      });
      collector.on("end",
        async (collected) => {
          // Si no se recolectan por lo menos 2 botones usados, se deshabilita.
          // If at least 2 used buttons are not collected, it is disabled.
          if (collected.size < 2) {
            await msg.edit({
              components: [new ActionRowBuilder().setComponents(msg.components[0].components.map((component) => ButtonBuilder.from(component.toJSON()).setDisabled(true)))]
            })
          }
        })
    }
  }
};
