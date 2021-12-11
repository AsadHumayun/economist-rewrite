const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "dose",
	aliases: ["dose", "consume"],
	description: "dose on something",
	category: "ecn",
	async run(client, message, args) {
		const dose = (args[0] || "").toLowerCase();
		const res = client.config.doses.findIndex((d) => dose.startsWith(d[0].split(";")[0]));
		if (res < 0) return message.reply(`The different types of consumables are: ${client.list(client.config.statics.doses.map((d) => d[0].split(";")[1]))}`);
		const active = await client.db.get(`dose${res}${message.author.id}`);
		if ((message.createdTimestamp / 60_000) < active) return message.reply(`Your ${client.config.doses[res][0].split(";")[5]} is active for another ${client.config.cooldown(message.createdTimestamp, active * 60_000)} after your last dose.`);
		const lastUsed = await client.db.get(`${client.config.doses[res][0].split(";")[3]}${message.author.id}`);
		if (lastUsed) {
			const time = client.config.cooldown(message.createdTimestamp, lastUsed * 60_000);
			if (time) {
				return message.reply(`You must wait ${time} before consuming another ${client.config.doses[res][0].split(";")[5]}`);
			}
		}
		const scs = await client.config.doses[res][1](message, MessageEmbed);
		if (!scs) {
			await client.db.set(`dose${res}${message.author.id}`, client.config.parseCd(message.createdTimestamp, ms(client.config.doses[res][0].split(";")[2])));
			await client.db.set(`${client.config.doses[res][0].split(";")[3]}${message.author.id}`, client.config.parseCd(message.createdTimestamp, ms(client.config.doses[res][0].split(";")[4])));
		}
	},
};