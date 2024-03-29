"use strict";
import { MessageEmbed } from "discord.js";
import moment from "moment";

export default {
	name: "purgemessages",
	aliases: ["purgemessages", "clear"],
	description: "mass deletes messages within a channel - max: 100, min: 1",
	guildOnly: true,
	usage: "<messages: number>",
	cst: "moderator",
	async run(client, message, args) {
		function date(_date = Date.now()) {
			return moment(_date).format("MMMM Do YYYY, h:mm:ss A");
		}
		// not gonna lie, but i just stole this function off the internet
		// I didn't want to spend too much time on this so I just got a solution and moved on. xD.
		// I did this so long ago, I don't remember the source, all I know is that it was on stackoverflow.
		async function clear(n = 1, logs, trigger) {
			const { channel: source, author } = trigger;
			if (n < 1 || !logs || !source) return;

			const coll = await source.messages.fetch({ limit: n }),
				arr = [...coll.values()],
				collected = [];
			let embeds = [];

			let index = 0;
			for (let i = 0; i < arr.length; i += 25) {
				collected.push([]);
				for (let m = i; m < i + 25; m++) {if (arr[m]) collected[index].push(arr[m]);}
				index++;
			}

			for (let i = 0; i < collected.length; i++) {
				const embed = new MessageEmbed()
						.setColor(message.author.color)
						.setTitle(`Channel Purging${collected.length > 1 ? ` - Part ${i + 1}` : ""}`)
						.setDescription(`Deleted from: ${source}`)
						.setAuthor({ name: `${author.tag} (${author.id})`, iconURL: author.displayAvatarURL({ dynamic: true }) })
						.setTimestamp(trigger.editedAt ? trigger.editedAt : trigger.createdAt),
					group = collected[i];
				for (const msg of group) {
					const a = `${msg.author.tag} (${msg.author.id}) at ${msg.editedAt ? date(msg.editedAt) : date(msg.createdAt)}`;
					if (!msg.content) msg.content = msg.embeds[0].description || "[]";
					const c = msg.content.length > 1024 ? msg.content.substring(0, msg.content.length - 3) + "..." : msg.content;
					embed.addField(a, c);
				}
				embeds.push(embed);
			}
			embeds = client.utils.listToMatrix(embeds, 10);
			source.bulkDelete(coll, true).then(async () => {
				if (message.guild.id == client.const.supportServer) {
					for (const embedArray of embeds) await logs.send({ embeds: [embedArray] });
				}
				// can't message.reply, since the original command message will have been deleted.
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`Successfully deleted **${coll.size}** messages in ${Date.now() - message.createdTimestamp} ms`),
					],
				});
			}).catch((err) => message.reply("Sorry, but there was an error whilst performing the request: " + err));
		}
		if (isNaN(args[0]) || (!args[0])) return message.reply({ content: `Invalid parameter "${args[0] || "null"}"; "n" must be of type Number`, allowedMentions: { parse: [] } });
		const logs = client.channels.cache.get(client.const.channels.msgLogs);
		clear(Number(args[0]), logs, message);
	},
};