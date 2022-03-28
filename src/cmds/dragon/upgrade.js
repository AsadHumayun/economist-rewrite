"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "upgrade",
	aliases: ["upgrade", "improve", "up", "upgr"],
	description: "Upgrade one of your dragon's stat",
	usage: "<stat: string> <upgradeAmount: ?number>",
	cst: "dragon",
	async run(client, message, args) {
		let data = message.author.data.get("drgn");
		if (!data) data = client.const.dragon;
		if (message.author.data.get("cst")?.split(";").includes("maxdragon888")) data = client.const.naxDragon;
		data = data.split(";").map(client.utils.expand);
		const stat = (args[0] || "").toLowerCase();
		let Stat = client.const.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.reply(`The different types of stats are: ${client.utils.list(client.const.upgr.map((x) => x.split(";")[1]))}`);
		Stat = Stat.split(";");
		const alias = await client.utils.getDragonAlias(message.author.id);
		let amt = isNaN(args[1]) ? 1n : BigInt(args[1]);
		if (amt <= 0n) amt = 1n;
		if (data[4] - amt < 0n) return message.reply("You don't have enough credits for that!");
		data[4] -= amt;
		data[Stat[2]] += amt;
		if (!message.author.data.get("cst")?.split(";").includes("maxdragon888")) await client.db.USERS.update({ drgn: data.map(client.utils.format).join(";") }, { where: { id: message.author.id } });
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has upgraded their ${alias[0]}'s ${Stat[1]} by ${amt} credits but lost ${alias[1][3]} ${amt} in the process`),
			],
		});
	},
};