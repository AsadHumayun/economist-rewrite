const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'shop',
	aliases: ['s', 'shop'],
	category: 'ecn',
	description: 'View the current shop!',
	async run(client, message, args) {
		let bal = await client.db.get('bal' + message.author.id) || "0";
		let cst = await client.db.get("cst" + message.author.id) || "";
				cst = cst.split(";");
		let owns = {
			fishing_rod: cst.includes("fishrod"),
			phonebook: cst.includes("phoneb"),
			phone: cst.includes("phone"),
			v: cst.includes("bvault"),
			clr: message.author.color == "RANDOM",
			slrprmt: cst.includes("slrprmt")
		}
		const shop = new MessageEmbed()
		.setColor(message.author.color)
		.setTitle(`Shop - ${message.author.tag}`)
		.setDescription(`:dollar: Current Balance - ${client.config.comma(bal)}\n\n`)
		.addField("Items", `[1] ${client.config.statics.defaults.emoji.fishing_rod}${owns.fishing_rod ? ` ${client.config.statics.defaults.emoji.tick} **ALREADY OWNED** ` : ' '}- Allows you to go fishing via \`${message.guild ? message.guild.prefix : client.const.prefix}fish\`; costs :dollar: 25\n[2] ${client.config.emoji.mobile_phone}${owns.phone ? ` ${client.config.statics.defaults.emoji.tick} **ALREADY OWNED** ` : ' '}- Allows you to comunicate with others via \`${message.guild ? message.guild.prefix : client.const.prefix}dial\`; costs :dollar: 750\n[3] ${client.config.emoji.phonebook}${owns.phonebook ? ` ${client.config.statics.defaults.emoji.tick} **ALREADY OWNED** ` : ' '}- Allows you to view other users' phone numbers via \`${message.guild ? message.guild.prefix : client.const.prefix}number\`; costs :dollar: 250\n[4] :receipt:${owns.slrprmt ? ` ${client.config.statics.defaults.emoji.tick} **ALREADY OWNED** ` : ' '}- The Seller's Permit - Allows you to sell in-game items via \`${message.guild ? message.guild.prefix : client.const.prefix}sell\`; costs :dollar: 50,000`)
		.addField(`Foodstuffs`, `[101] ${client.config.emoji.chill} - 1x Chill Pill - removes **all** cooldowns, 6 hour cooldown for consuimg this item; consume with \`${message.guild ? message.guild.prefix : client.const.prefix}dose chill\`; costs :dollar: 100 each`)
		.addField("Utilities", `[201] :bank:${owns.v ? ` ${client.config.statics.defaults.emoji.tick} **ALREADY OWNED** ` : ' '} - Bank Vault - Allows you to store money where it's safely hidden away from attackers; \`${message.guild ? message.guild.prefix : client.const.prefix}vault\` to view your vault; costs :dollar: 10,000\n[202] :rainbow:${owns.clr ? ` ${client.config.statics.defaults.emoji.tick} **ALREADY OWNED** ` : ' '}- Set a random colour preference whilst using commands; costs :dollar: 2,500`)
		message.reply(shop);
	},
}