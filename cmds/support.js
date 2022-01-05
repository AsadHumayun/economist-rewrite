"use strict";
import { MessageEmbed } from "discord.js";

export default {
	"name": "support",
	aliases: ['support', 'helpme', 'bothelp', 'hub'],
	description: "View an invite to the bot's support server",
	category: 'utl',
	async run(client, message, args) {
		message.reply(
			`Here's an invite to Economist's support server: ${client.config.ssInvite}`
		);
	},
};