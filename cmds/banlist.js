"use strict";
import { MessageEmbed } from "discord.js";
import { menu } from "discord.js-reaction-menu";

export default {
	name: "banlist",
	aliases: ["banned", "bans", "banlist"],
	desc: "See a list of users banned from the server, along with their IDs and the reason of their ban",
	usage: "bans",
	category: "mod",
	cst: "moderator",
	async run(client, message) {
		message.guild.bans.fetch()
			.then(async (bans) => {
				if (bans.size == 0) {
					return message.reply(`${client.config.statics.defaults.emoji.tick} There are no users banned from **${message.guild.name}**!`);
				}
				let counter = 1;
				const string = bans.map((b) => `#${counter++} ${b.user.tag} (${b.user.id}) | ${b.reason || "<UNKNOWN REASON>"}`).join("\n");
				const embeds = [];
				const map = string.match(/[^]{1,4069}/g);
				for (const x in map) {
					embeds.push(
						new MessageEmbed()
							.setAuthor(`Users banned form ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
							.setDescription("```\n" + client.config.trim(map[x], 4060) + "\n```")
							.setColor(message.author.color),
					);
				}
				return new menu({
					userID: message.author.id,
					channel: message.channel,
					pages: embeds,
					time: 600_000,
				})
				// return new menu(message.channel, message.author.id, embeds, ms('10m'))
					.catch(() => {
						message.reply(`${client.config.emojis.error} | I was unable to find your bans list; please make sure I have the \`BAN_MEMBERS\` permission!`);
					});
			});
	},
};