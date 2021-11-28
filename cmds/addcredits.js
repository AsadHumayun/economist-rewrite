const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "addcredits",
  aliases: [ "addcredits", "addcred" ],
  description: "Adds pet credits to a certain user",
  category: "own",
  cst: "addcredits",
  async run(client, message, args) {
    const msg = await message.reply({ content: "Please wait..." })
    if (args.length < 2) return msg.edit({ content: "Desired usage for this command is: `" + message.guild.prefix + "addcredits <user> [amount]`" });
    const user = await client.config.fetchUser(args[0])
      .catch((er) => {});
    if (!user) return msg.edit({ content: "Unknown user" });
    const credits = isNaN(args[1]) ? 1 : Number(args[1]);
    let ucst = await client.db.get("cst" + user.id) || "";
        ucst = ucst.split(";");
    var data = await client.db.get("pet" + user.id);
    if (!data) return message.channel.edit({ content: "That person doesn't have a dragon!" });
    data = data.split(";");
    if (data.length < client.config.statics.intendedPetLength) return msg.edit({ content: "Malformed pet - does not have at least " + client.config.statocs.intendedPetLength + " elements." });
    data[4] = Number(data[4]) + (credits);
    await client.db.set("pet" + user.id, data.join(";"))
    const creditsEmoji = await client.config.getDragonAlias(user.id)[1][3];
    msg.edit({ embeds: [
      new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has received ${creditsEmoji} ${credits}`)
    ]});
  },
};