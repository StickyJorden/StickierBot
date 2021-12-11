const Discord = require('discord.js');


module.exports = {
  name: "help",
  alias: ["h"],
  description: 'learn more about what I can do',
  run: async (client, message, args) => { 
 
        const emojis = {
            admin: '⚒',
            crypto: '📈',
            dead: '☠️',
            economy: '💲',
            fun: '🎳',
            games: '🎮',
            monopoly: '🏆',
            music: '🎼'
        }
        //Get the folder names of each command groups
        const directories = [ ...new Set(client.commands.map(cmd => cmd.directory)),];

        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = client.commands
                .filter(cmd => cmd.directory === dir)
                .map(cmd => {
                    return {
                        name: cmd.name || "unamed",
                        description: cmd.description || "there is no description",
                        alias: cmd.alias || "none"
                    };
                });
            
            return {
                directory: formatString(dir),
                commands: getCommands, 
            }
        });


        const embed = new Discord.MessageEmbed().setDescription('Please select a category in the dropdown menu.');

        const components = (state) =>
        [
            new Discord.MessageActionRow().addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId("help-menu")
                    .setPlaceholder("Please select a category")
                    .setDisabled(state)
                    .addOptions(
                        categories.map(cmd => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Commands from ${cmd.directory} category`,
                                emoji: emojis[cmd.directory.toLowerCase()] || null,
                            };
                        })
                    )
            ),
        ];

        const initialMessage = await message.channel.send({ embeds: [embed], components: components(false)});
    
        const filter = (interaction) => interaction.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector({
            filter,
            componentType: "SELECT_MENU",
            //time: 1000 * 10,
        })

        collector.on('collect', (interaction) => {
            const [ directory ] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new Discord.MessageEmbed()
                .setTitle(`${directory} commands`)
                .setDescription("Here are the list of commands")
                .addFields(
                    category.commands.map(cmd => {
                        return {
                            name: `\`${cmd.name}\``,
                            value: cmd.description,
                            inline: true,
                        };
                    })
                );

            interaction.reply({embeds: [categoryEmbed], ephermal: true})
        });

        collector.on('end', () => {
            initialMessage.edit({components: components(true)});
        })
    },
};