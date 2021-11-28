const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "deleterole",
  aliases: ["deleterole", "dr"],
  category: "own",
  cst: "dltrle",
  description: "Remove a guild role",
  async run(client, message, args) {
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You don't have perms to use this command ;-;")
    let role;
    try {
      role = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.get(message.mentions.roles.first().id);
    } catch (e) {
      return message.reply(`Unkown role "${args[0]}"`);
    };
    //if (!role) 
    const rn = role.name;
    const id = role.id;
    await message.guild.roles.cache.get(role.id).delete()
      .catch((f) => message.reply(`Failed to delete the ${id} role`))
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`Successfully removed the "${rn}" (${id}) role`)
    })
  }
};