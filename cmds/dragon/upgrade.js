"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "upgrade",
	aliases: ["upgrade", "improve", "up", "upgr"],
	description: "Upgrade one of your dragon's stat",
	cst: "dragon",
	async run(client, message, args) {
		let data = message.author.data.get("pet").split(";").map(Number);
		if (!data) data = client.const.dragon;
		if (message.author.data.get("cst")?.split(";").includes("maxdragon888")) data = client.const.naxDragon;
		const stat = (args[0] || "").toLowerCase();
		let Stat = client.utils.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.reply(`The different types of stats are: ${client.utils.list(client.utils.upgr.map((x) => x.split(";")[1]))}`);
		Stat = Stat.split(";");
		const alias = await client.utils.getDragonAlias(message.author.id);
		let amt = isNaN(args[1]) ? 1 : Number(args[1]);
		if (amt <= 0) amt = 1;
		// level;health;energy;exp;data[4];intel;endur;str;affec
		if (data[4] - amt < 0) return message.reply("You don't have enough credits for that!");
		data[4] -= amt;
		data[Stat[2]] += amt;
		if (!message.author.data.get("cst")?.split(";").includes("maxdragon888")) await client.db.USERS.update({ pet: data.join(";") }, { where: { id: message.author.id } });
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has upgraded their ${alias[0]}'s ${Stat[1]} by ${amt} credits but lost ${alias[1][3]} ${amt} in the process`),
			],
		});
	},
};