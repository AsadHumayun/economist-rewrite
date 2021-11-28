const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dm",
  aliases: ["dm"],
  description: "DMs a user (bot dev only)",
  category: "own",
  cst: "dm",
  async run(client, message, args) {
    const user = await client.config.fetchUser(args[0]).catch((x) => {});
    if (!user) return message.reply(`You must mention the recipient in order for this command to work!`);

    const msg = args.slice(1).join(" ");
    if (!msg) return message.reply("You must include a message.");
    let uclr = await client.db.get("clr" + user.id) || "#00aaaa";
        uclr = uclr.split(";");
    let clr = uclr[Math.floor(Math.random() * uclr.length || 1)];
    let emb = new MessageEmbed()
    .setColor(clr)
    .setDescription(msg)
    .setFooter(`Sent by: ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has been sent the following message:`)
    });
    message.reply({ embed: emb });
    user.send({ embed:emb });
  },
};