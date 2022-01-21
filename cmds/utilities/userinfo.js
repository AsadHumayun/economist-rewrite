"use strict";
import * as Discord from "discord.js";

export default {
	name: "userinfo",
	aliases: ["user", "who", "whois", "userinfo", "ui"],
	usage: "userinfo <user>",
	description: "See some basic user information",
	async run(client, message, args) {
		/**
		 * Formats a `DISCORD_FLAG` into a more readable, approachable format.
		 * @param {string} str The string to format
		 * @returns {string} `"Discord Flag, Discord Flag 2"`
		 */
		function format(str) {
			let newStr = str.replace(/_+/g, " ").toLowerCase();
			newStr = newStr.split(/ +/g).map(x => `${x[0].toUpperCase()}${x.slice(1)}`).join(" ");
			return newStr;
		}
		function getPerms(m) {
			if (m.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return ["Administrator"];
			return Object.keys(Discord.Permissions.FLAGS).filter((f) => m.permissions.has(f));
		}
		if (!args.length) args = [message.author.id];
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		const member = await message.guild.members.fetch(user.id)
			.catch(() => {return;});

		const flags = (Object.keys(Discord.UserFlags.FLAGS).filter((flag) => user.flags.has(flag)) || ["No flags."]).join(", ");
		const mutuals = client.guilds.cache.filter(async (x) => {
			const mmbr = await x.members.fetch(user.id).catch(() => {return;});
			if (mmbr) {
				x.members.cache.delete(user.id);
				return true;
			}
			else {
				return false;
			}
		});

		if (!member) {
			return message.reply({
				embeds: [
					new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(user.displayAvatarURL({ dynamic: true, format: "png" }))
						.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true, format: "png" }) })
						.setDescription("This user is not a member of this server thus very limited information can be displayed.")
						.addField("Joined Discord At", user.createdAt.toISOString(), true)
						.addField("Bot", user.bot, true)
						.addField("Detected Flags", flags, true),
				],
			});
		}
		else {
			const roles = member.roles.cache.size > 40 ? "Too many roles to display." : member.roles.cache.map((x) => x.toString()).join("");
			return message.reply({
				embeds: [
					new Discord.MessageEmbed()
						.setColor(message.author.color)
						.setThumbnail(user.displayAvatarURL({ dynamic: true, format: "png" }))
						.setAuthor({ name:  user.tag, iconURL: user.displayAvatarURL({ dynamic: true, format: "png" }) })
						.addField("Display Name", member.displayName, true)
						.addField("Joined Discord At", user.createdAt.toISOString().split("T").join(" "), true)
						.addField("Joined Server At", member.joinedAt.toISOString().split("T").join(" "), true)
						.addField("Bot", user.bot.toString(), true)
						.addField("Detected Flags", flags, true)
						.addField("Highest Role", member.roles.highest.toString(), true)
						.addField(`Roles [${member.roles.cache.size}]`, roles, true)
						.addField(`Mutual Servers [${mutuals.size}]`, mutuals.map(({ name }) => name).join(", "), true)
						.addField("Permissions", getPerms(member).map(format).join(", "), true),
				],
			});
		}
	},
};