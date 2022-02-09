"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "bug",
	aliases: ["bug"],
	description: "Reports a bug in the support server. These will be reveiwed and taken seriously - spam or missuse of this command may result in a stun or blacklist from using this command.",
	usage: "<title: string> | <description: string>",
	async run(client, message) {
		const clientData = await client.db.getUserData(client.user.id);
		const number = clientData.get("bgc") ? clientData.get("bgc") + 1 : 1;
		await client.db.USERS.update({
			bgc: number,
		}, {
			where: {
				id: client.user.id,
			},
		});
		const arr = message.content.slice(message.guild ? message.guild.prefix : client.const.prefix.length + 3).split(/\|+/);
		const title = arr[0];
		const desc = arr.slice(1).join(" ");
		if (!title || !desc) {
			return message.reply("You must include a title and a description for your bug separated by `|`, for example: `" + message.guild ? message.guild.prefix : client.const.prefix + "bug title for bug | description`");
		}
		let id = Math.floor(Math.random() * 100000);
		let val = await client.db.BUGS.findOne({ where: { id } });
		while (val.get("id") == id) {
			id = Math.floor(Math.random() * 100000);
			val = await client.db.BUGS.findOne({ where: { id } });
		}
		const embed = new MessageEmbed()
			.setColor(message.author.color)
			.setAuthor({ name: `Bug Report #${number}` })
			.setTitle(title)
			.setDescription(desc)
			.setTimestamp()
			.addField("Staff", `\`~approve ${id} <message>\` to approve this bug report and send ${message.author.tag} <message>\n\`~reject ${id} <message>\` reject this bug and send ${message.author.tag} <message>`)
			.setFooter(`${message.author.tag} | ${message.author.id}`);
		message.reply(embed);
		const msg = await client.channels.cache.get(client.utils.channels.bug).send({ embeds: [embed] });
		await client.db.BUGS.create({
			id,
			title,
			number,
			submitter: message.author.id,
			msg: msg.id,
			at: Date.now(),
		});
	},
};