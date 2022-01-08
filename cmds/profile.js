"use strict";
import { MessageEmbed, UserFlags } from "discord.js";

export default {
	name: "profile",
	aliases: ["profile", "prof"],
	category: "utl",
	description: "shows a user's profile",
	async run(client, message, args) {
		if (!args) args = [message.author.id];
		let usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) usr = message.author;
		const data = await client.db.getUserData(usr.id);
		const cst = data.get("cst") ? data.get("cst").split(";") : [];
		const badges = Object.entries(client.const.badges).filter((entry) => cst.includes(entry[0])).map((e) => e[1]);
		const cmds = data.get("cmds") ? data.get("cmds").toString() : "";
		let color = data.get("clr").split(";");
		color.pop();
		color = color.join(" ");
		const bio = data.get("bio") || "User has not set a bio.";
		function format(str) {
			let newStr = str.replace(/_+/g, " ").toLowerCase();
			newStr = newStr.split(/ +/).map(x => `${x[0].toUpperCase()}${x.slice(1)}`).join(" ");
			return newStr.replace("Vad", "VAD").replace("Tts", "TTS");
		}
		const flags = Object.keys(UserFlags.FLAGS).filter((flag) => usr.flags.has(flag)).map(format).join(", ");
		const emb = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${usr.tag}'s Profile`)
			// use regex to remove "[" and "]" chars, thereby preventing people from embedding links
			// embedding links = bad because they could use it maliciously and trick users.
			.setDescription(`**Joined:** ${new Date(data.get("createdAt")).toISOString()}\n**Account Last Updated:** ${new Date(data.get("updatedAt")).toISOString()}`)
			.addField("About Me", bio.replace(/\[+|\]+/gm, "").toString())
			.setThumbnail(usr.displayAvatarURL({ dynamic: true }))
			.addField("Commands Used", client.utils.comma(cmds) || "0", true)
			.addField("Colour Preferences", color, true)
			.addField("Flags", flags, true);
		if (badges.length > 0) emb.addField("Badges", badges.join(""), true);
		message.reply({ embeds: [ emb ] });
	},
};