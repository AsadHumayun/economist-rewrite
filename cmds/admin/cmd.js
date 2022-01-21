"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "cmd",
	aliases: ["cmd", "command"],
	description: "Revoke/grant permissions for a user to use a certain command",
	cst: "administrator132465798",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("You must specify a user and a command name/alias in order for this command to work!");
		const usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply("You must mention someone for this command to work!");
		if (client.const.owners.includes(usr.id)) return message.reply("no u.");
		const command = client.commands.get(args[1].toLowerCase()) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(args[1].toLowerCase()));
		if (!command) return message.reply(`A command by that name or alias was not found. Take a look in \`${message.guild ? message.guild.prefix : client.const.prefix}commands\` for a list of existing commands.`);
		const data = await client.db.getUserData(usr.id);
		let bcmd = data.get("bcmd") ? data.get("bcmd").split(";") : [];
		if (!bcmd.includes(command.name)) {
			bcmd.push(command.name);
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} has lost access to the ${command.name} command`),
				],
			});
		}
		else {
			bcmd = bcmd.filter((x) => ![command.name].includes(x));
			message.reply({
				embeds:[
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${usr.tag} has gained access to the ${command.name} command`),
				],
			});
		}
		await client.db.USERS.update({
			bcmd: bcmd.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
	},
};