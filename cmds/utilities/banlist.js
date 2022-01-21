"use strict";
import { MessageEmbed } from "discord.js";
import { menu } from "discord.js-reaction-menu";

export default {
	name: "banlist",
	aliases: ["banned", "bans", "banlist"],
	desc: "See a list of users banned from the server, along with their IDs and the reason of their ban",
	usage: "bans",
	ssOnly: true,
	cst: "moderator",
	async run(client, message) {
		message.guild.bans.fetch()
			.then(async (bans) => {
				if (bans.size == 0) {
					return message.reply(`${client.const.emoji.tick} There are no users banned from **${message.guild.name}**!`);
				}
				let counter = 1;
				const string = bans.map((b) => `#${counter++} ${b.user.tag} (${b.user.id}) | ${b.reason || "<UNKNOWN REASON>"}`).join("\n");
				const embeds = [];
				const map = string.match(/[^]{1,4069}/g);
				for (const x in map) {
					embeds.push(
						new MessageEmbed()
							.setAuthor({ name: `Users banned form ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
							.setDescription("```\n" + client.utils.trim(map[x], 4060) + "\n```")
							.setColor(message.author.color),
					);
				}
				return new menu({
					userID: message.author.id,
					channel: message.channel,
					pages: embeds,
					time: 600_000,
				})
					.catch(() => {
						message.reply(`${client.const.emojis.error} | I was unable to find your bans list; please make sure I have the \`BAN_MEMBERS\` permission!`);
					});
			});
	},
};