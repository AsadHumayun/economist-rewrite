"use strict";
import { MessageActionRow, MessageButton } from "discord.js";

export default {
	name: "invite",
	aliases: ["invite", "inv"],
	description: "View the bot's invite link to add it to other servers",
	category: "utl",
	async run(client, message) {
		message.channel.send({
			content: "Here are some useful links...",
			components: [
				new MessageActionRow().addComponents([
					new MessageButton()
						.setStyle("LINK")
						.setLabel("Bot Invite")
						.setURL(client.config.statics.botInvite),
					new MessageButton()
						.setStyle("LINK")
						.setLabel("Support Server")
						.setURL(client.config.statics.ssInvite),
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