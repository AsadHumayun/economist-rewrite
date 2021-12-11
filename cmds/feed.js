const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'feed',
	aliases: ['f', 'fuel', 'feed'],
	description: "Feed your dragon and increase its energy.",
	category: 'pet',
	cst: "dragon",
	async run(client, message, args) {
		"level;health;energy;exp;credits;intel;endur;str;affec";
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet) pet = client.config.statics.defaults.dragon;
		if (message.author.cst.includes("maxdragon888")) pet = client.config.statics.defaults.naxDragon;
		pet = pet.split(';');

		let cooldown = await client.db.get('fdc' + message.author.id);
		if (cooldown && (!message.author.cst.includes("maxdragon888"))) {
			const data = client.config.cooldown(message.createdTimestamp, cooldown*60_000);
			if (data) {
				return message.reply(`Your dragon is convulsing its wings in annoyance; you should try again in ${data}`);
			};
		};
		const currAlias = await client.db.get("curralias" + message.author.id) || "default";
		let emojis;
		let display;
		if (currAlias) {
			const aliases = require('../petaliases.json');
			const names = Object.keys(aliases);
			if (names.includes(currAlias)) {
				display = aliases[currAlias].DISPLAY_NAME;
				emojis = aliases[currAlias].EMOJIS;
			} else {
				display = "dragon";
				emojis = client.config.defaults.PET_EMOJIS;
			}
		}			
		let pn = await client.db.get(`petname${message.author.id}`) || display;
		display = pn;
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		let input = (args[0] || "").toLowerCase();
		let foods = client.config.foods;
		let type = foods[Object.keys(foods).find((x) => input.startsWith(x))];
		if (!type || (!args.length)) return message.reply(`The different types of food are ${client.config.list(Object.values(foods).map((x) => x.name))}`)
		if (!message.author.cst.includes("maxdragon888")) {
			let health = Number(pet[1]);
			let en = Number(pet[2]);
			pet[1] = health + type.gives.hp > 100 ? 100 : health + type.gives.hp;
			pet[2] = en + type.gives.en > 100 ? 100 : en + type.gives.en;
			if (type.key.split(";").length > 1 && (!cst.includes("allfood"))) {
				let fsh = await client.db.get("fsh" + message.author.id) || "0;0;0;0;0";
						fsh = fsh.split(";");
				if (fsh[type.key.split(";")[1]] - 1 < 0) return message.reply("You don't have that type of food!");
				fsh[type.key.split(";")[1]] -= 1;
				await client.db.set("fsh" + message.author.id, fsh.join(";"));
			} else if (!cst.includes("allfood")) {
				let amt = await client.db.get(`${type.key}${message.author.id}`) || "0";
						amt = Number(amt);
				if (amt - 1 < 0) return message.reply("You don't have that type of food!");
				amt -= 1;
				await client.db.set(`${type.key}${message.author.id}`, amt);
			};
			await client.db.set("pet" + message.author.id, pet.join(";"));
		};
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has fed their ${display} a ${type.emoji}, and re-plenished ${emojis[0]} ${type.gives.hp} and ${emojis[1]} ${type.gives.en}!`)
		});
		if (type.name == "chillpill" && (Math.floor(Math.random(1) * 10) >= 8)) {
			return message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Because of being fed a ${type.emoji}, ${message.author.tag}'s ${display} is so chill, that it's decided to have absolutely no feed cooldown!`)
			});
		} else {
			let cd = Math.floor(((30 / Number(pet[9])) * 0.75 + 5));
			let time = cd;
					time *= 60000	
			if (!message.author.cst.includes("maxdragon888")) await client.db.set(`fdc${message.author.id}`, client.config.parseCd(message.createdTimestamp, time));
		};
	},
};