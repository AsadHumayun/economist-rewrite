const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "cshop",
  aliases: ["cshop"],
  description: "View a list of purchasable items with their prices",
  category: "utl",
  async run(client, message, args) {
    let p = message.guild.prefix;
    const embed = new MessageEmbed()
    .setColor(message.author.color)
    .setTitle("Donor Shop - " + message.author.tag)
    .setDescription(`\`${p}cbuy <item>\` to purchase an item from here`)
    .addField("Staff - £650.00 (To purchase this, you must DM " + client.users.cache.get(client.config.owner).tag + ")", `- Access to \`${p}give <User> <Permission>\`\n- Access to \`${p}take <User> <Permission>\`\n- Access to \`${p}get <user> <key>\`\n- Access to \`${p}have <permission>\`\n- Access to \`${p}cmd <user> <command>\`\n- Access to \`${p}stun <user> <time>\`\n- Access to \`${p}unstun <user>\`\n- Access to \`${p}approve <id>\`\n- Access to \`${p}reject <id>\`\n- Access to \`${p}cantuse <command>\`\n- Access to \`${p}spawn\`\n- Access to \`${p}setprefix <guild id> <new prefix>\``)
    .addField("Colorist - £2.50", "- Access to `" + message.guild.prefix + "color <hex code> <hex code> ...` -- allows for up to 10 different colour preferences")
    .addField("Keyboard Warrior - £1.00", "- Access to `" + p + "snipe` -- shows last deleted message in the current channel")
    .addField("Supreme - £5.00", `- Access to \`${p}name <name>\` -- rename your dragon\n- Access to \`${p}cooldowns\` -- shows you your cooldowns`)
    .addField("Rebel - £1.00", "- Clears 5 second cooldown between using commands")
    .addField("Nerd - £5.00", "- Access to all logs channels")
    .addField("Custom Roles", "These are roles which are held in our support server. You will have permissions to be able to assign these to other members as you wish. A custom role will cost £15.00 and if you wish for it to be hoisted, it will cost you £19.99. In order to purchase these, please PM " + client.users.cache.get(client.config.owner).tag + ".")
    .addField("Custom Channels", "These can be purchased for £20.00. These will be in the CUSTOM category and you'll have permission manage the channel. Note: If your channel is public, you're not allowed to mention @everyone, @here or any other custom role (other than yours). Doing so will result in your channel being removed. If you would like to purchase one of these, please PM " + client.users.cache.get(client.config.owner).tag)
    .addField("dragon Aliases", "dragon aliases can be purchased for £10.00. You will have the ability to assign access as you wish. A dragon alias allows for you to fully customise the emojis which are used. The effects will be visible on all dragon-related commands, including `search`, `upgrade` etc.\nBelow is an example of the Dwerd dragon alias.")
    .setImage("https://media.discordapp.net/attachments/793470161532354580/793470185490350100/unknown.png?width=400&height=370")

    message.reply({ embed })
  } 
}