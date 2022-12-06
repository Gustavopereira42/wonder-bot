const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('w-ping')
    .setDescription('Replies with Pong!'),
  async execute({ interaction }) {
    await interaction.editReply('Pong!');
  },
};
