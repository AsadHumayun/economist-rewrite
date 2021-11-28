const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "credit",
  aliases: [ "credit", "cred", "crdt" ],
  description: "Shows how much credit you have",
  category: "utl",
  async run(client, message, args) {
    async function crdt(id, tag) {
      let crd = await client.db.get("crdt" + id) || 0;
      if (isNaN(crd)) crd = 0;    
      crd = Number(crd);
      crd = crd.toFixed(2);
      const embed = new MessageEmbed()
      .setColor(message.author.color)
      .setTitle(`${tag}'s Donor Credit`)
      .setDescription(
        `\`${message.guild.prefix}cbuy <item>\` to purchase an item with your credit;\n\`${message.guild.prefix}cpay <user> <amount>\` to pay some of your credit to another user;\n\`${message.guild.prefix}ptransfer <user> <item>\` to transfer an owned item from this account to another account, costing £0.25.`
      )
      .addField("Available Credit", "£" + crd)

      message.reply({ embed })
    };
    let user = await client.config.fetchUser(args[0]).catch((x) => {});
    if (!user) user = message.author;
    let p = await client.db.get("perms" + message.author.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0";
    p = p.split(";");
    if (p[8] != "1") {
      crdt(message.author.id, message.author.tag) 
    } else {
      crdt(user.id, user.tag)
    };
  }
} 