"use strict";
import { MessageEmbed } from "discord.js";

export default {
  name: "vupgrade",
  aliases: ["vupgrade", "vupgr"],
  description: "Upgrade your vault, costing :dollar: 500 at first, but every time you upgrade, the more you'll need to pay the next time you upgrade again.",
  category: "ecn",
  async run(client, message, args) {
    let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");
    if (!cst.includes("bvault")) return message.reply("You must own a Bank Vault in order to use this command!")
    let bal = await client.db.get("bal" + message.author.id) || 0;
        bal = Number(bal);
    let v = await client.db.get("v" + message.author.id) || "1;0";
        v = v.split(";");
        v[0] = Number(v[0]);
    if (v[0] == 9999999999) return message.reply("Bruh you already have a maxvault...");
    if ((args[0] || "").toLowerCase() == "max") {
      let cbal = bal;
      let loops = 0;
      let levelups = 0;
      let cbal0;
      while (cbal >= 0) {
        let cost = (v[0] + loops) * 500;
        cbal -= cost;
        if (cbal < 0) {
          cbal0 = cbal + cost;
          break;
        } else {
          loops += 1;
          levelups += 1;
        }
      };
      if (levelups == 0) return message.reply(`Sorry mate, but you need at least :dollar: ${client.utils.comma(v[0] * 500)} in order to upgrade your bnk vault!`);
      if (cbal < 0) levelups -= 1;
      
      v[0] += levelups;
      await client.db.set("bal" + message.author.id, cbal0)
      await client.db.set("v" + message.author.id, v.join(";"))
      return message.reply({
        embed: new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${message.author.tag} has upgraded their Bank Vault to level ${client.utils.comma(v[0])}! It can now hold :dollar: ${client.utils.comma(v[0] * 5000)}`)
      });  
    };
    let c = v[0] * 500;
    if (bal - c < 0) return message.reply("You must have at least :dollar: " + client.utils.comma(c) + " in order to upgrade your Bank Vault.");
    v[0] += 1;

    await client.db.set("bal" + message.author.id, bal - c)
    await client.db.set("v" + message.author.id, v.join(";"))
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${message.author.tag} has upgraded their Bank Vault to level ${client.utils.comma(v[0])}! It can now hold :dollar: ${client.utils.comma(v[0] * 5000)}`)
    });
  },
};