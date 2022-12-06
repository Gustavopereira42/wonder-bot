const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("w-pause").setDescription("Pauses the music"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue) {
      return await interaction.editReply("There are no songs in the queue");
    }

    queue.setPaused(true);
    await interaction.editReply("Music has been paused! Use `/w-resume` to resume the music");
  },
}
