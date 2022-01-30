"use strict";
import { MessageActionRow, MessageButton } from "discord.js";

export default {
	name: "invite",
	aliases: ["invite", "support", "hub", "links", "link"],
	description: "Get a URL to invite the bot, or to join the support server... or something *special*!",
	async run(client, message) {
		message.channel.send({
			content: "Here are some useful links...",
			components: [
				new MessageActionRow().addComponents([
					new MessageButton()
						.setStyle("LINK")
						.setLabel("Bot Invite")
						.setURL(client.const.botInvite),
					new MessageButton()
						.setStyle("LINK")
						.setLabel("Support Server")
						.setURL(client.const.ssInvite),
					new MessageButton()
						// rickroll
						.setStyle("LINK")
						.setLabel("Something Special!")
						.setURL("https://www.youtube.com/watch?v=iik25wqIuFo"),
				]),
			],
		});
	},
};