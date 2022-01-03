"use strict";
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "snipe",
	aliases: ['snipe', 'sn'],
	description: 'View the last deleted message in the current channel',
	category: 'utl',
	cst: "snipe",
	async run(client, message, args) { 
		let snipedMsg = await client.db.get("snipe" + message.channel.id);
		if(!snipedMsg) return message.reply("Nothing to snipe here!");
		const user = await client.users.fetch(snipedMsg.author) || message.author;
		let EM = new MessageEmbed()
			.setColor('RANDOM')
			.setTitle(`Sniped Message`)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setDescription(snipedMsg.message)
			.setFooter(`Sent ${require('moment')(new Date(snipedMsg.at)).format('MMMM Do YYYY, h:mm:ss A UTC')}`)
		message.reply("", {
			embed: EM
		}).catch((e) => { message.reply("bruv i need the embed links permission for this to work") })		
	},
};