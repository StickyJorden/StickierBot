const { MessageActionRow, MessageButton } = require('discord.js');

function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

module.exports = {
	name: 'ping', 
	description: 'replies with pong',
	type: 'CHAT_INPUT',
	async execute(client, interaction, args) {

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
            );

		interaction.followUp({ content: 'Pong!', components: [row] });

        const filter = i => i.customId === 'primary' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'primary') {
                await i.deferUpdate();
                await wait(4000);
		        await i.editReply({ content: 'A button was clicked!', components: [] });
            }
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	},
};