const { QueryType } = require('discord-player');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('w-play')
    .setDescription('Play a song by a given URL!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Loads a single song from a url")
        .addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Loads a playlist of songs from a url")
        .addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Searches for sogn based on provided keywords")
        .addStringOption((option) => option.setName("searchterms").setDescription("the search keywords").setRequired(true))
    ),
  async execute({ client, interaction }) {
    if (!interaction.member.voice.channel) {
      return interaction.editReply("You need to be in a VC to use this command")
    }

    const queue = await client.player.createQueue(interaction.guild)
    if (!queue.connection) await queue.connect(interaction.member.voice.channel)
    const channel = interaction.member.voice.channel;
    const embedBuilder = new EmbedBuilder();

    if (interaction.options.getSubcommand() === "song") {
      const url = interaction.options.getString("url");
      const searchEngine = url.includes('spotify') ? QueryType.SPOTIFY_SONG : QueryType.YOUTUBE_VIDEO;
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine,
      });
      if (result.tracks.length === 0) {
        await interaction.editReply("No results");
      }

      const song = result.tracks[0];
      await queue.addTrack(song);
      const embed = embedBuilder
        .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}`});

      channel.send({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "playlist") {
      const url = interaction.options.getString("url")
      const searchEngine = url.includes('spotify') ? QueryType.SPOTIFY_PLAYLIST : QueryType.YOUTUBE_PLAYLIST;
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine,
      });

      if (result.tracks.length === 0) {
        return interaction.editReply("No results");
      }

      const playlist = result.playlist;
      await queue.addTracks(result.tracks);

      const embed = embedBuilder
        .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`);
      channel.send({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "search") {
      const url = interaction.options.getString("searchterms");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0) {
        return interaction.editReply("No results");
      }

      const song = result.tracks[0];
      await queue.addTrack(song);
      const embed = embedBuilder
        .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}`});

      channel.send({ embeds: [embed] });
    }
    if (!queue.playing) await queue.play();
    await interaction.editReply('✊😔');
  }
};
