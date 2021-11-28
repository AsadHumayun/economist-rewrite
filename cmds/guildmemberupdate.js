const { MessageEmbed, MessageReaction } = require("discord.js");

module.exports = {
  name: "guildmemberupdate",
  aliases: ["guildmemberupdate", "gmu", "gmup"],
  cst: "gmp",
  description: "Emits the guildMember update event for all members in a guild",
  category: "own",
  async run(client, message, args) {
    let gid = message.guild.id;
    if (!client.guilds.cache.get(gid)) gid = message.guild.id;
    const embed = new MessageEmbed()
    .setColor(message.author.color)
    .setDescription(`Fetching members of ${gid}...`);
    const msg = await message.reply({ embed });
    await client.guilds.cache.get(gid).members.fetch()
      .then(async(m) => {
        await msg.edit(embed.setDescription(`Emitting guildMemberUpdate for ${client.guilds.cache.get(gid).members.cache.size} members...`));
        for (let [, g] of client.guilds.cache.get(gid).members.cache) {
          client.emit("guildMemberUpdate", g, g);
        };
        await msg.edit(embed.setDescription(`Successfully emitted guildMemberUpdate for ${client.guilds.cache.get(gid).members.cache.size} members`));
      })
        .catch((err) => {
          msg.edit(embed.setDescription(`Member caching failed`))
        })
  },
};