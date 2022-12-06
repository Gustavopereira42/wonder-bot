const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("w-skip").setDescription("Skips the current song"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue) {
      return await interaction.editReply("There are no songs in the queue");
    }

    const currentSong = queue.current;
    queue.skip();

    const embed = new EmbedBuilder()
      .setDescription(`${currentSong.title} has been skipped!`)
      .setThumbnail(currentSong.thumbnail);

    await interaction.editReply({ embeds: [embed] });
  },
}
