const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "deprive",
	aliases: ["deprive"],
	description: "Completely deprive your pet's credits on a stat, reducing it to 1 and receive the appropriate amount of credits in return; 2h cooldown",
	cst: "supreme",
	category: "pet",
	async run(client, message, args) {
		const cd = await client.db.get("dpc" + message.author.id);
		if (cd) {
			const data = client.config.cooldown(message.createdTimestamp, cd * 60_000);
			if (data) {
				return message.reply(`You must wait ${data} before depriving another stat!`);
			}
		}
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst ? cst.split(";") : [];
		if (!cst.includes("dragon")) return message.reply("You do not have a pet dragon!");
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet) pet = client.config.statics.defaults.dragon;
		if (cst.includes("maxdragon888")) pet = client.config.statics.defaults.naxDragon;
		const alias = await client.config.getDragonAlias(message.author.id, client);
		pet = pet.split(";");
		const stat = (args[0] || "").toLowerCase();
		let Stat = client.config.statics.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.reply(`The different types of stats are: ${client.config.list(client.config.statics.upgr.map((x) => x.split(";")[1]))}`);
		Stat = Stat.split(";");
		const Credits = Number(pet[Stat[2]]);
		const amt = Credits - 1;
		if (amt < 0) {
			return message.reply("You must have at least 2 credits on a specified `<stat>` before depriving your dragon of said stat.");
		}
		// shouldn't affect users with the maxdragon -- the maxdragon is intended to be a "ghost" type thing; it doesn't change no matter what the user does.
		if (!cst.includes("maxdragon888")) {
			await client.db.set("dpc" + message.author.id, client.config.parseCd(message.createdTimestamp, ms("6h")));
			pet[Stat[2]] = Credits - amt;
			pet[4] = Number(pet[4]) + amt;
			await client.db.set("pet" + message.author.id, pet.join(";"));
		}
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has deprived their ${alias[0]}'s ${Stat[1]} by ${amt} points and received ${alias[1][3]} ${amt} credits!`),
			],
		});
	},
};