"use strict";
import { Permissions } from "discord.js";

export default {
	name: "slowmode",
	aliases: ["slow", "slowmode"],
	guildOnly: true,
	usage: "<seconds (use 0 to remove slowmode): number>",
	description: "Sert slowmode for the current channel, minimum 1 second and maximum 21600 seconds (6 hours)",
	async run(client, message, args) {
		if (!args.length) return message.reply(`You must follow the format of \`${message.guild ? message.guild.prefix : client.const.prefix}slowmode <seconds>\` in order for this command to work! (To disable slowmode, use \`0\` instead)`);

		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			return message.reply("You must have the MANAGE_CHANNEL permission in order to use this command!");
		}
		if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			return message.reply("I must have the MANAGE_CHANNELS permission in order for this command to work!");
		}
		const count = parseInt(args[0]);
		if (isNaN(count)) {
			return message.reply("You msut enter a positive number");
		}
		message.channel.setRateLimitPerUser(count);
		if (count == 0) {
			return message.reply(`${client.const.emoji.tick} Successfully disabled slowmode in ${message.channel}`);
		}
		else {
			message.reply(`${client.const.emoji.tick} Set slowmode for \`${count}\` seconds!`);
		}
	},
};