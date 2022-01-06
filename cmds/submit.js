"use strict";
import { MessageEmbed } from "discord.js";

export default {
  name: "submit",
  aliases: ["submit"],
  description: "Submit your staff application",
	ssOnly: true,
  async run(client, message, args) {
		if (message.guild.id != client.config.statics.supportServer) {
      return message.reply("this command only works in our support server! Join by using `" + message.guild.prefix + "hub`");
  };    

    let cst = await client.db.get("cst" + message.author.id);
        cst = cst ? cst.split(";") : [];
    if (cst.includes("sbmt")) return message.reply("You've already submitted your staff application!");
    let ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(message.author.id));
    if (!ch) return message.reply("You haven't even applied for staff yet!");
    cst.push("sbmt")  
    client.channels.cache.get(client.config.channels.appNotifs)
      .send(`Application ${ch} submitted by ${message.author.tag} (${message.author.id})`)
    message.reply("Successfully notified the staff team!");
    await client.db.set("cst" + message.author.id, cst.join(";"));
  }
};