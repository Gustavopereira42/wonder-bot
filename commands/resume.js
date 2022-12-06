const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("w-resume").setDescription("Resumes the music"),
	execute: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId);
		if (!queue) {
      return await interaction.editReply("There are no songs in the queue");
    }

		queue.setPaused(false);
    await interaction.editReply("Music has been resumed! Use `/w-pause` to pause the music");
	},
}
