"use strict";
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "upgrs",
  aliases: ["upgrs", "assigns", "ccmds"],
  description: "View a list of assignable upgrades",
  category: "utl",
  async run(client, message, args) {
    let upgr = await client.db.get("upgr" + message.author.id) || "";
    if (upgr.split(";").length < 2) return message.reply("You have no assignable upgrades!");
    let keys = client.config.listToMatrix(upgr.split(";"), 2).map((f) => f[0]);
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setTitle(`${message.author.tag}'s Assignable Upgrades`)
      .setDescription("```\n" + client.config.Inspect(keys) + "\n```")
    });
  }
};