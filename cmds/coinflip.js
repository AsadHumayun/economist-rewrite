const { MessageEmbed } = require("discord.js");
const delay = require("delay");
const ms = require("ms");

module.exports = {
  name: "coinflip",
  aliases: ["coinflip", "cf"],
  description: "Bet X amount of money onto whether you get heads or tails and gain/lose it all",
  category: "ecn",
  async run(client, message, args) {
    let cd = await client.db.get("cfc" + message.author.id);
    let scd = Math.round(((cd * client.config.exp) - message.createdTimestamp) / 1000);
    if (scd > 0) return message.reply(`You must wait ${scd} seconds before flipping another coin!`);
    if (!(args[0] && (args[0].toLowerCase().startsWith("h") || (args[0].toLowerCase().startsWith("t"))))) return message.reply(`You must specify either "h" or "t" and a bet under the format: \`${message.guild.prefix}coinflip <h or t> <bet>\``);
    let res = Math.round(Math.random()) == 1 ? "heads" : "tails";
    let bal = await client.db.get("bal" + message.author.id) || "0";
        bal = Number(bal);
    let bet = isNaN(args[1]) ? 1 : Number(args[1]);
    if (bal - bet < 0 || (bet < 0)) return message.reply("That number exceeds your current balance.");
    await client.db.delete("bal" + message.author.id);
    await client.db.set("cfc" + message.author.id, client.parseCd(message.createdTimestamp, ms("2m"), true));
    let e = new MessageEmbed()
              .setColor(message.author.color)
              .setTitle(`Coinflip - ${message.author.tag} (💵 ${client.comma(bet)})`)
              .setDescription("**Flipping a coin...**")
    let msg = await message.reply({ embed: e });
    let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");
    await delay(2000);
    if ((res.startsWith(args[0]) || (cst.includes("cfw"))) && (!cst.includes("cfl"))) {
      let sads = [":(", ":/", ":c", ";(", ">:(", "(´；ω；`)", "(＃ﾟДﾟ)"]
      e = e.setDescription(`It landed ${res} up ${sads[Math.floor(Math.random() * sads.length)]}... here's your :dollar: ${client.comma(bet)} bet back, along with an extra :dollar: ${client.comma(bet)} :((`)
      msg.edit({ embed: e });
      await client.db.set("bal" + message.author.id, bal + (bet * 2));
    } else {
      await client.db.set("bal" + message.author.id, bal - bet);
      e = e.setDescription(`It landed ${res} up! Thanks for the free :dollar: ${client.comma(bet)}, see you next time!`).setColor("#da0000");
      msg.edit({ embed: e });
    };
  },
};