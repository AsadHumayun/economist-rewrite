const { MessageEmbed } = require("discord.js");
const delay = require("delay");
const ms = require("ms");

module.exports = {
	name: "coinflip",
	aliases: ["coinflip", "cf"],
	description: "Bet X amount of money onto whether you get heads or tails and gain/lose it all",
	category: "ecn",
	async run(client, message, args) {
		const cd = await client.db.get("cfc" + message.author.id);
		const scd = Math.round(((cd * client.config.exp) - message.createdTimestamp) / 1000);
		if (scd > 0) return message.reply(`You must wait ${scd} seconds before flipping another coin!`);
		if (!(args[0] && (args[0].toLowerCase().startsWith("h") || (args[0].toLowerCase().startsWith("t"))))) return message.reply(`You must specify either "h" or "t" and a bet under the format: \`${message.guild.prefix}coinflip <h or t> <bet>\``);
		const res = Math.round(Math.random()) == 1 ? "heads" : "tails";
		let bal = await client.db.get("bal" + message.author.id) || "0";
		bal = Number(bal);
		const bet = isNaN(args[1]) ? 1 : Number(args[1]);
		if (bal - bet < 0 || (bet < 0)) return message.reply("That number exceeds your current balance.");
		await client.db.delete("bal" + message.author.id);
		await client.db.set("cfc" + message.author.id, client.config.parseCd(message.createdTimestamp, ms("2m"), true));
		let e = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`Coinflip - ${message.author.tag} (💵 ${client.config.comma(bet)})`)
			.setDescription("**Flipping a coin...**");
		const msg = await message.reply({ embeds: [e] });
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst.split(";");
		await delay(2000);
		if ((res.startsWith(args[0]) || (cst.includes("cfw"))) && (!cst.includes("cfl"))) {
			const sads = [":(", ":/", ":c", ";(", ">:(", "(´；ω；`)", "(＃ﾟДﾟ)"];
			e = e.setDescription(`It landed ${res} up ${sads[Math.floor(Math.random() * sads.length)]}... here's your :dollar: ${client.config.comma(bet)} bet back, along with an extra :dollar: ${client.config.comma(bet)} :((`);
			msg.edit({ embeds: [e] });
			await client.db.set("bal" + message.author.id, bal + (bet * 2));
		}
		else {
			await client.db.set("bal" + message.author.id, bal - bet);
			e = e.setDescription(`It landed ${res} up! Thanks for the free :dollar: ${client.config.comma(bet)}, see you next time!`).setColor("#da0000");
			msg.edit({ embed: e });
		}
	},
};