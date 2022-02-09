"use strict";

import { MessageEmbed } from "discord.js";

export default {
	name: "timeout",
	aliases: ["timeout", "silence"],
	description: "Timeout a server member.",
	usage: "<user: UserResolvable> <time (in minutes) (use 0 to remove timeout): number> <reason: ?string>",
	cst: "moderator",
	ssOnly: true,
	/**
	 * @todo add a cstMessage type of object in Constants.
	 */
	cstMessage: "You must be a moderator in order to use this command!",
	async run(client, message, args) {
		if (args.length < 2) return message.reply(`You must use the command under the format of \`${message.guild?.prefix || client.const.prefix}timeout <User> <Time (minutes)> <?reason>\` in order for this command to work!`);
		if (isNaN(args[1]) || Number(args[1]) <= 0) return message.reply("You must enter a positive number");
		// ~timeout <U: UserResolvable> <T: number> <R: ?string>
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		const member = await message.guild.members.fetch(user.id).catch(() => {return;});
		if (!member) return message.reply(`User ${user.username}(${user.id}) is not a member of the current guild`);
		const time = Number(args[1]) * 60_000;
		const reason = args.slice(2).join(" ") || "no reason given";
		const willToLive = null;
		await member.timeout(time, `Responsible User: ${message.author.tag} (${message.author.id})\nReason specified: ${reason}`);
		const notification = new MessageEmbed()
			.setColor(client.const.colors.red)
			.setDescription(`You have been timed out in ${message.guild.name} for ${time / 60000} minutes`)
			.addField("Moderator", message.author.tag)
			.addField("Reason", reason);
		message.channel.send({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has been timed out for ${time / 60_000} minutes because of "${reason}" and has been sent the following message:`),
			],
		});
		message.channel.send({
			embeds: [ notification ],
		});
		member.send({ embeds: [ notification ] }).catch(() => {return;});
	},
};