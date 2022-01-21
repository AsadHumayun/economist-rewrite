"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "help",
	aliases: ["help", "helpme", "cmdhelp", "commands", "cmds"],
	description: "*helps* you?",
	async run(client, message, args) {
		if (args.length) {
			const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
			if (!command) return message.reply(`A command by that name/alias was not found. Take a look in \`${message.guild ? message.guild.prefix : client.const.prefix}help\` for a list of existing commnads.`);

			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
						.setTitle(`Command: ${message.guild ? message.guild.prefix : client.const.prefix}${command.name}`)
						.setDescription(command.description)
						.addField("Aliases", command.aliases.join(", "))
						.addField("Category", command.category, true)
						.addField("Usage", `\`\`\`\n${command.name} ${command.usage}\n\`\`\``)
						.setFooter(`Requested by ${message.author.tag}`),
				],
			});
		}
		const embed = new MessageEmbed()
			.setTitle("Command Help")
			.setColor(message.author.color)
			.setDescription(`Here are some commands which can be used by members, arranged in categories. You may use \`${message.guild ? message.guild.prefix : client.const.prefix}help <command name>\` for some extra information on a certain command.`);

		client.const.commandCategories.forEach(cat => {
			embed.addField(`${client.utils.capital(cat)} Commands`, client.commands.filter(cmd => cmd.category === cat).map(({ name }) => `\`${name}\``).join(", "));
		});
		message.reply({
			embeds: [ embed ],
		});
	},
};