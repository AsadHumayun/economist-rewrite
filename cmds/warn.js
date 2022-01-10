"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: 'warn',
	aliases: ['warn'],
	description: `Warn a user`,
	category: 'mod',
	cst: "tmod",
	ssOnly: true,
	async run(client, message, args) {
		if (args.length < 2) {
			return message.reply(`${client.const.emoji.err} Incorrect usage; try using \`${message.guild ? message.guild.prefix : client.const.prefix}warn <user> <reason>\``)
		};
		let usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if(!usr) return message.reply(`${client.const.emoji.err} I can't seem to find that user...`);

		const reason = args.slice(1).join(' ');
	
		let logsMessage = await client.channels.cache.get(client.utils.channels.modlog).send({
			embed: new MessageEmbed()
			.setColor("#f56c6c")
			.setTitle("Member Warned")
			.addField("Moderator", `${message.author.tag} | ${message.author.id}`, true)
			.addField("User", `${usr.tag} | ${usr.id}`, true)
			.addField('Reason', reason)
			.setTimestamp()
			.setFooter("Warned")
		});

		let emb = new MessageEmbed()
		.setDescription(`You have received a warning in ${message.guild.name}. If you think this is a mistake or you were wrognly punished, please contact ${client.users.cache.get(client.const.display).tag}\n[[Log Message](${logsMessage.url})]`)
		.setColor(client.const.channels.colors.red)
		.addField(`Moderator`, message.author.tag)
		.addField("Reason", reason);

		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${client.const.emoji.tick} ${usr.tag} has been warned and was sent the following message:`)
		});
		message.reply(emb);
		await client.users.cache.get(usr.id).send(emb).catch(() => {return;});
	},
};