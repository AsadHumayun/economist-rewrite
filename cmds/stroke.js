const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'stroke',
	aliases: ['stroke', 'str'],
	description: "Stroke your pet and increase its Affection by 1",
	category: 'pet',
	cst: "pet",
	async run(client, message, args) {
		let cooldown = await client.db.get('strc' + message.author.id);
		let cd = client.config.cooldown(message.createdTimestamp, cooldown*60_000);
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet)	return message.reply("It looks like you don't own a dragon! Why not tame one by using `" + message.guild.prefix + "tame`")	
			pet = pet.split(';');
			const currAlias = await client.db.get("curralias" + message.author.id) || "default";
			let emojis;
			let display;
			if (currAlias) {
				const aliases = require('../petaliases.json');
				const names = Object.keys(aliases);
				if (names.includes(currAlias)) {
					display = aliases[currAlias].DISPLAY_NAME;
					selected = display;
					emojis = aliases[currAlias].EMOJIS;
				} else {
					display = "dragon";
					emojis = client.config.defaults.PET_EMOJIS;
				}
			};
		let pn = await client.db.get(`petname${message.author.id}`) || display;
		display = pn;
		if (cd) return message.reply(`You must wait another ${cd} before stroking your ${display} again!`);		
		pet[8] = Number(pet[8]) + 1;
		if (!message.author.cst.includes("maxdragon888")) await client.db.set(`pet${message.author.id}`, pet.join(';'));
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${emojis[7]} ${message.author.tag} has stroked their ${display}`)
		});
		await client.db.set(`strc${message.author.id}`, client.config.parseCd(message.createdTimestamp, ms("3h")));
	},
};