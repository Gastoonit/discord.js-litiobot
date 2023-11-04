const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("📗 | Apartado de informaciones generales.")
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName("bot")
        .setDescription(`📊 | ¡Ve la información un poco detallada del bot!`)
    )
    .addSubcommand((command) =>
      command
        .setName("help")
        .setDescription(`⚡️ | ¡Ve la lista de los comandos del bot!`)
        .addStringOption((option) =>
          option.setName("comando").setDescription("- Comando a buscar")
        )
    )
    .setDMPermission(false),
  run: async (client, interaction) => {
    let totalSeconds = client.uptime / 1000;
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Top.gg")
        .setURL(`https://top.gg/bot/1146522183439487096`)
        .setEmoji("🔻")
        .setStyle(ButtonStyle.Link)
    );

    if (interaction.options.getSubcommand() === "help") {
      const interactionName = interaction.options.getString("comando");
      const embed = new EmbedBuilder();

      if (interactionName) {
        const cmd = interaction.client.slashCommands.find(
          (command) => command.data.name === interactionName
        );

        if (!cmd) {
          return interaction.reply({
            content: `El comando solicitado al parecer no existe! 🤷`,
            ephemeral: true,
          });
        }
        embed
          .setTitle(`${cmd.data.name}`)
          .addFields(
            {
              name: "Descripción",
              value: cmd.data.description,
            },
            {
              name: "Nombre",
              value: `\`/${cmd.data.name}\``,
              inline: true,
            },
            {
              name: "Opciones:",
              value: cmd.data.options.length
                ? `- ${cmd.data.options
                    .map(
                      (option) =>
                        `\`Nombre: ${option.name}\` | \`Descripción: ${
                          option.description
                        }\` | ${option.required ? "Requiere" : "No requerible"}`
                    )
                    .join("\n- ")}`
                : "No tiene",
            }
          )
          .setFooter({
            text: `${client.user.username}`,
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
              extension: "png",
            }),
          })
          .setTimestamp()
          .setColor(`#ffc800`);
      } else {
        let em = new EmbedBuilder()
          .setColor("White")
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({
              dynamic: true,
              extension: "png",
            }),
          })
          .setDescription(
            `Descubre, juega, sugiere y modera con [Litio bot](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands). Disfruta de juegos, sistema de tickets, sugerencias y moderación. ¡Únete y vive una experiencia única!`
          )
          /* .setFooter({
            text: client.user.username,
            iconURL: client.user.avatarURL({
              dynamic: true,
              extension: "png",
            }),
          }) */
          .setThumbnail(
            client.user.avatarURL({
              dynamic: true,
              extension: "png",
            })
          )
          .setTimestamp();

        let select = new StringSelectMenuBuilder()
          .setCustomId(`ok`)
          .setPlaceholder(`Menú de selección`)
          .addOptions([
            {
              label: `Apartado de Ayuda`,
              emoji: "<:litio_4:1148425751499120681>",
              value: `ok1`,
            },
            {
              label: `Establecer canales`,
              emoji: `⏺️`,
              value: `ok2`,
            },
            {
              label: `Info`,
              emoji: `❔`,
              value: `ok3`,
            },
            {
              label: `Entretenimiento`,
              emoji: `⛳`,
              value: `ok4`,
            },
            {
              label: `Moderación`,
              emoji: `🔦`,
              value: `ok5`,
            },
            {
              label: `Todos los comandos`,
              emoji: `♻️`,
              value: `ok6`,
            },
          ]);
        let ro2 = new ActionRowBuilder().addComponents(select);

        let em1 = new EmbedBuilder()
          .setColor("White")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
              extension: "png",
            }),
          })
          .setFooter({
            text: client.user.username,
            iconURL: interaction.guild.iconURL({
              dynamic: true,
              extension: "png",
            }),
          })
          .addFields({
            name: `Establecer canales`,
            value: "`establecer sugerencias`, `establecer tickets`",
          });

        let em2 = new EmbedBuilder()
          .setColor("White")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
              extension: "png",
            }),
          })
          .setFooter({
            text: interaction.user.username,
            iconURL: interaction.guild.iconURL({
              dynamic: true,
              extension: "png",
            }),
          })
          .addFields({
            name: `Informativos`,
            value: "`info bot`, `info help`",
          });

        let em3 = new EmbedBuilder()
          .setColor("White")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
              extension: "png",
            }),
          })
          .setFooter({
            text: client.user.username,
            iconURL: interaction.guild.iconURL({
              dynamic: true,
              extension: "png",
            }),
          })
          .addFields({
            name: `Entretenimiento`,
            value: "`juego conectar4`, `juego rps`, `juego calculadora`, `juego lucha`, `juego flood`, `juego tictactoe`, `imagen`, `reaccionar`",
          });

        let em4 = new EmbedBuilder()
          .setColor("White")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({
              dynamic: true,
              extension: "png",
            }),
          })
          .setFooter({
            text: client.user.username,
            iconURL: interaction.guild.iconURL({
              dynamic: true,
              extension: "png",
            }),
          })
          .addFields({
            name: `Moderación`,
            value: "`advertencia otorgar`, `advertencia visualizar`, `advertencia quitar`, `advertencia quitar_todas`",
          });
        let em5 = new EmbedBuilder()
          .setColor("White")
          .setDescription(
            `Aquí tienes la lista de comandos disponibles:\n\n- ${client.slashCommands
              .map(
                (interactions) =>
                  `\`/${interactions.data.name}\` - ${interactions.data.description}`
              )
              .join("\n- ")}`
          )
          .setThumbnail(
            interaction.user.displayAvatarURL({
              dynamic: true,
              extension: "png",
            })
          )
          .setFooter({
            text: client.user.username,
            iconURL: interaction.guild.iconURL({
              dynamic: true,
              extension: "png",
            }),
          });

        let msg = await interaction.reply({
          embeds: [em],
          components: [ro2],
        }); // Botones eliminados la línea antigua es: let msg = await interaction.channel.send({ embeds: [em], components: [ro, ro2] });

        let call = await msg.createMessageComponentCollector({
          filter: (o) => {
            if (o.user.id === interaction.user.id) return true;
            else {
              return o.reply({
                content: `:bangbang: | Esta no es tu sesión, ejecuta /info help en su lugar.`,
                ephemeral: true,
              });
            }
          },
          time: 50000,
        });
         call.on('collect', async (int) => {
          if (int.isStringSelectMenu()) {
            for (const value of int.values) {
              if (value === `ok1`) {
                return int.update({
                  embeds: [em],
                });
              }
              if (value === `ok2`) {
                return int.update({
                  embeds: [em1],
                });
              }
              if (value === `ok3`) {
                return int.update({
                  embeds: [em2],
                });
              }
              if (value === `ok4`) {
                return int.update({
                  embeds: [em3],
                });
              }
              if (value === `ok5`) {
                return int.update({
                  embeds: [em4],
                });
              }
              if (value === `ok6`) {
                return int.update({
                  embeds: [em5],
                });
              }
            }
		  }
	  });

        call.on("end", async () => {
          if (!msg) return;
          ro2.components[0].setDisabled(true);
          msg.edit({
            embeds: [em],
			components: [ro2],
            content: null
          });
        });
      }
    }

    if (interaction.options.getSubcommand() === "bot") {
      const EmbedBot = new EmbedBuilder()
        .setAuthor({
          name: client.user.username + " stat's",
          iconURL: client.user.avatarURL(),
        })
        .setColor("#ff6767")
        .addFields([
          {
            name: "Comandos",
            value: `\`${client.slashCommands.size} comandos de barra\``,
          },
          {
            name: "Litio",
            value: `\`\`\`\nGuilds: ${client.guilds.cache.size}\nPing: ${client.ws.ping}\nTiempo activo: ${days} día(s), ${hours} hora(s), ${minutes} minuto(s)\n\`\`\``,
          },
        ])
        .setTimestamp();

      await interaction.reply({ embeds: [EmbedBot], components: [row] });
    }
  },
};
