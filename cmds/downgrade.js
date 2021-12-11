const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "downgrade",
	aliases: ["downgrade", "decondition"],
	description: "downgrade one of your dragon's stat and receive one credit in return",
	category: "pet",
	cst: "dragon",
	async run(client, message, args) {
		const cd = await client.db.get("dgrc" + message.author.id) || 0;
		let data = client.config.cooldown(message.createdTimestamp, cd * 60_000);
		if (data) {
			return message.reply(`You must wait another ${data} before downgrading another one of your dragon's stat!`);
		}
		data = await client.db.get("pet" + message.author.id);
		if (!data) data = client.config.statics.defaults.dragon;
		let cst = await client.db.get("cst" + message.author.id);
		cst = cst ? cst.split(";") : [];
		if (cst.includes("maxdragon888")) data = client.config.statics.defaults.maxPet;
		data = data.split(";");
		const stat = (args[0] || "").toLowerCase();
		let Stat = client.config.statics.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.reply(`The different types of stats are: ${client.list(client.config.statics.upgr.map((x) => x.split(";")[1]))}`);
		Stat = Stat.split(";");
		const alias = await client.config.getDragonAlias(message.author.id, client);
		data[4] = Number(data[4]) + 1;
		data[Stat[2]] = Number(data[Stat[2]]) - 1;
		if (data[Stat[2]] <= 1) return message.reply(`Each of your ${alias[0]}'s stats must have at least 1 point.`);
		if (!cst.includes("maxdragon888")) {
			await client.db.set("dgrc" + message.author.id, client.config.parseCd(message.createdTimestamp, ms("30m")));
			await client.db.set("pet" + message.author.id, data.join(";"));
		}
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has reduced their ${alias[0]}'s ${Stat[1]} and received ${alias[1][3]} 1!`),
			],
		});
	},
};