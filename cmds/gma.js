const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "gma",
  aliases: ["gma"],
  description: "Emits the `guildMemberAdd` event for a user (they must already be in a guild for it to work, though).",
  category: "own",
  cst: "gmaffff",
  async run(client, message, args) {
    let u = await client.config.fetchUser(args[0]).catch((e) => {});
    if (!u) return message.reply(`Unrecognised user "${u}"`);
    let mem = await message.guild.members.fetch(u.id).catch((e) => {});
    if (!mem) return message.reply("User not present in current guild");
    try {
      client.emit("guildMemberAdd", mem);
    } catch (err) {
      message.reply(`
Sorry but an error occurred ;-; \`${err}\`
`)
    };
  }
};