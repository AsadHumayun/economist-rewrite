"use strict";
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "withdraw",
  aliases: ["withdraw", "with", "w"],
  description: "Withdraw money from your Bank Vault and gain it as balance money.",
  category: "ecn",
  async run(client, message, args) {
    let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");
    if (!cst.includes("bvault")) return message.reply("You must own a Bank Vault in order to use this command!")
    if (isNaN(args[0]) || (Number(args[0]) <= 0)) return message.reply("You must enter a positive number");
    let w = Number(args[0]);
    let bal = await client.db.get("bal" + message.author.id) || 0;
        bal = Number(bal);

    let v = await client.db.get("v" + message.author.id) || "1;0";
        v = v.split(";");
        v[0] = Number(v[0]);
        v[1] = Number(v[1]);
    let curr = v[1];
    if (curr - w < 0) return message.reply(`Your vault doesn't contain enough money!`);
    curr -= w;
    v[1] = curr;
    await client.db.set("bal" + message.author.id, bal + w)
    await client.db.set("v" + message.author.id, v.join(";"))
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${message.author.tag} has withdrawn :dollar: ${w} form their Bank Vault. Their Bank Vault now has :dollar: ${v[1]}`)
    });
  }
}