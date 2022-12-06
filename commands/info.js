const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("w-info").setDescription("Displays info about the currently playing song"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
      return await interaction.editReply("There are no songs in the queue");
    }

    let bar = queue.createProgressBar({
      queue: false,
      length: 19,
    });

    const song = queue.current;

    const embed = new EmbedBuilder()
      .setDescription(`Currently Playing [${song.title}](${song.url})\n\n` + bar);

    await interaction.editReply({ embeds: [embed] });
  },
}
