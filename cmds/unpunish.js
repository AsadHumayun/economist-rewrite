"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "unpunish",
	aliases: ["unpunish", "unpnsh"],
	description: "Remove a user's offence, and unmutes them if necessary.\nNote: this command will NOT unban users -- that should be done via the unban command.",
	category: "mod",
	ssOnly: true,
	cst: "moderator",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("Correct usage: `" + message.guild ? message.guild.prefix : client.const.prefix + "unpunish <user> <offence index> <?reason>`; requires mod");
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply({ content: `Invalid user "${args[0]}"`, allowedMentions: { parse: [] } });
		const data = await client.db.getUserData(user.id);
		const ofncs = data.get("ofncs") ? data.get("ofncs").split(";").map(Number) : [];
		const reason = args.slice(2).join(" ");
		const index = Number(args[1]);
		if (!Object.values(client.const.ofncs)[index - 1]) {
			return message.reply(`Index ${index} out of bounds for length ${Object.keys(client.const.ofncs).length}`);
		}
		if (!ofncs[index - 1]) ofncs[index - 1] = 0;
		ofncs[index - 1] = ofncs[index - 1] - 1;
		while (ofncs[ofncs.length - 1] == 0) {
			ofncs.pop();
		}
		await client.db.USERS.update({
			ofncs: ofncs.join(";"),
		}, {
			where: {
				id: user.id,
			},
		});
		message.reply(`Successfully updated ofncs ${index} ${user.id} from ${ofncs[index - 1] + 1} to ${ofncs[index - 1]} ${reason ? `(reason: ${reason})` : ""}`);
		const level = Object.values(client.const.ofncs)[index - 1][1];
		const mem = await client.guilds.cache.get(client.const.supportServer).members.fetch(user.id);
		if (!mem) return;
		async function unmute() {
			if (!mem.roles.cache.has(client.const.roles.muted)) return;
			mem.roles.remove(client.const.roles.muted).catch(() => {return;});
			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${user.tag}'s mute has been removed because of "${reason || "user unpunished"}"; they were sent the following message:`),
				],
			});
			const e = new MessageEmbed()
				.setColor(client.const.colors.green)
				.setDescription("Your mute has been removed")
				.addField("Moderator", message.author.tag)
				.addField("Reason", reason.toString() || "Moderator didn't specify a reason.");
			message.channel.send({ embeds: [ e ] });
			user.send({ embeds: [ e ] }).catch(() => {return;});
		}
		if (level == 1 && (ofncs[index - 1] < 2)) {
			unmute();
		}
		else if (level == 2) {
			unmute();
		}
		else if (level == 3) {
			unmute();
		}
		else if (level == 4) {
			unmute();
		}
	},
};