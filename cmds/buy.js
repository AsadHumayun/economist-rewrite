const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'buy',
	aliases: ['buy', 'purchase'],
	description: "Buy something from the overpriced shop",
	category: 'ecn',
	usage: '<item>',
	dev: false,
	guild: false,
	disabled: false,
	async run(client, message, args) {
		if (isNaN(args[0])) return message.reply("You must provide a valid ID of what you wish to purchase!");
		let t = parseInt(args[0]);
		let T = Number(args[0]) - 1;
		if (T == 100) T = 3;
		let things = [
			{ number: 1, price: 25 },
			{ number: 2, price: 750 },
			{ number: 3, price: 250 },
			{ number: 101, price: 100 },
			{ number: 201, price: 10000 },
			{ number: 202, price: 2500 },
			{ number: 4, price: 50_000 }
		];
		let valid = [1, 2, 3, 101, 201, 202, 4];
			if (!t || (!valid.includes(t))) return message.reply("You must provide a valid ID of what you wish to purchase!");
		let bal = await client.db.get('bal' + message.author.id) || 0;
		if (!bal || (bal == 0)) return message.reply("You don't have enough :dollar: to purchase that item!");
		if (bal - things[valid.indexOf(t)].price < 0) return message.reply("You don't have enough :dollar: to purchase that item!");
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		if (t == 1) {
			//fishing rod
			let owns = cst.includes("fishrod")
			if (!owns) {} else { return message.reply(`${client.config.statics.defaults.emoji.err} You already own a ${client.config.emoji.fishing_rod}`) }
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price));
			cst.push("fishrod")
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a ${client.config.emoji.fishing_rod} !`)
			})
		} else if (t == 2) {
			//buy phone
			let owns = cst.includes("phone");
			if (owns) return message.reply(`${client.config.statics.defaults.emoji.err} You already own a ${client.config.emoji.mobile_phone} !`);
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price))
			cst.push("phone")
			let phoneNumber = Math.floor(Math.random() * 100000);
			phoneNumber = Number(phoneNumber)
			await client.db.set('n' + phoneNumber, message.author.id);
			await client.db.set('number' + message.author.id, phoneNumber)
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a ${client.config.emoji.mobile_phone} ! \`${message.guild.prefix}dial\``)
			})
		} else if (t == 3) {
			let owns = cst.includes("phoneb")
			if (owns) return message.reply(`${client.config.statics.defaults.emoji.err} You already own a ${client.config.emoji.phonebook} !`);
			cst.push("phoneb")
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price))
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a ${client.config.emoji.phonebook} !`)
			})
		} else if (t == 101) {
			let amt = Number(args[1]);
			if (!amt) amt = 1;
			if (isNaN(amt)) return message.reply("The quantity of how many pills you want to buy must be a number");
			let x = await client.db.get(`chillpills${message.author.id}`) || 0;
			x = Number(x);
			if (bal - (things[valid.indexOf(t)].price * amt) < 0) return message.reply(`You don't have enough money to purchase ${amt} chill pills!`);
			await client.db.set("bal" + message.author.id, bal-things[valid.indexOf(t)].price*amt)
			await client.db.set(`chillpills${message.author.id}`, parseInt(x + amt));
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased ${client.config.emoji.chill} ${message.author.com == 1 ? amt : client.comma(amt)}!`)
			})			
		} else if (t == 201) {
			let owns = cst.includes("bvault")
			if (owns) return message.reply(`${client.config.statics.defaults.emoji.err} You already own a :bank: Bank Vault!`);
			cst.push("bvault")
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price))
			await client.db.set("cst" + message.author.id, cst.join(";"));
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has purchased a :bank: Bank Vault!`)
			})
		} else if (t == 202) {
			let owns = message.author.color == "RANDOM";
			if (owns) return message.reply(`${client.config.statics.defaults.emoji.err} You already have a random colour preference!`);
			
			await client.db.set('bal' + message.author.id, Number(bal - things[valid.indexOf(t)].price))
			await client.db.set("clr" + message.author.id, "RANDOM;0");
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has successfully bought a :rainbow: Random Colour Preference!`)
			})
		} else if (t == 4) {
			let owns = cst.includes("slrprmt");
			if (owns) return message.reply(`${client.config.statics.defaults.emoji.err} You already have a Seller's Permit!`);
			cst.push("slrprmt");
			await client.db.set('bal' + message.author.id, parseInt(bal - things[valid.indexOf(t)].price))
			await client.db.set("cst" + message.author.id, cst.join(";"));
			
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has successfully bought a :receipt: Seller's Permit!`)
			})
		}
	},
};