const { MessageEmbed } = require('discord.js');
const ms = require("ms");

module.exports = {
	name: 'deprive',
	aliases: ['deprive'],
	description: "Completely deprive your pet's credits on a stat, reducing it to 1 and receive the appropriate amount of credits in return; 2h cooldown",
	cst: "supreme",
	category: 'pet',	
	async run(client, message, args) {
			"level;health;energy;exp;credits;intel;endur;str;affec"
		let cd = await client.db.get("dpc" + message.author.id);
		if (cd) {
			let data = client.config.cooldown(message.createdTimestamp, cd*60_000);
			if (data) {
				return message.reply("You must wait " + data + " before depriving another stat!");
			} else {

			};
		};
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet) pet = client.config.dpet;
		if (message.author.cst.includes("maxdragon888")) pet = client.config.maxPet;
		let petName = await client.db.get("petname" + message.author.id) || "dragon";
		pet = pet.split(';');
		let stat = (args[0] || "").toLowerCase();
		let Stat = client.config.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.reply(`The different types of stats are: ${client.list(client.config.upgr.map((x) => x.split(";")[1]))}`);		
		Stat = Stat.split(";");
		let Credits = Number(pet[Stat[2]]);
		let amt = Credits - 1;
		if (amt < 0) {
			return message.reply("You must have at least 2 credits on a specified `<stat>` before depriving your dragon of this stat.");
		};
		if (!message.author.cst.includes("maxdragon888")) {
			await client.db.set('dpc' + message.author.id, client.config.parseCd(message.createdTimestamp, ms("6h")));
			pet[Stat[2]] = Credits - amt;
			pet[4] = Number(pet[4]) + amt;
			await client.db.set('pet' + message.author.id, pet.join(';'));
		};
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has deprived ${petName}'s ${Stat[1]} by ${amt} points and received ${amt} credits!`)
		});
	},
};