const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: 'dose',
	aliases: ['dose', 'consume'],
	description: 'dose on something',
	category: 'ecn',	
	async run(client, message, args) {
		let dose = (args[0] || "").toLowerCase();
		let res = client.config.doses.findIndex((d) => dose.startsWith(d[0].split(";")[0]));
		if (res < 0) return message.reply(`The different types of consumables are: ${client.list(client.config.doses.map((d) => d[0].split(";")[1]))}`)
		let active = await client.db.get(`dose${res}${message.author.id}`);
		if ((message.createdTimestamp/client.config.exp) < active) return message.reply(`Your ${client.config.doses[res][0].split(";")[5]} is active for another ${client.cooldown(message.createdTimestamp, active*client.config.exp)} after your last dose.`);
		let lastUsed = await client.db.get(`${client.config.doses[res][0].split(';')[3]}${message.author.id}`);
		if (lastUsed) {
			let time = client.cooldown(message.createdTimestamp, lastUsed*client.config.exp);
			if (time) {
				return message.reply(`You must wait ${time} before consuming another ${client.config.doses[res][0].split(";")[5]}`);
			};
		};
		let scs = await client.config.doses[res][1](message, MessageEmbed);
		if (!scs) {
				await client.db.set(`dose${res}${message.author.id}`, client.parseCd(message.createdTimestamp, ms(client.config.doses[res][0].split(';')[2])));
				await client.db.set(`${client.config.doses[res][0].split(';')[3]}${message.author.id}`, client.parseCd(message.createdTimestamp, ms(client.config.doses[res][0].split(';')[4])));
			};
		},
};