"use strict";
/* eslint-disable no-inner-declarations */
import { MessageEmbed } from "discord.js";

export default {
	name: "decode",
	aliases: ["decode", "dnc"],
	description: "decodes any supplied text",
	category: "utl",
	async run(client, message, args) {
		const encds = ["ascii", "base64", "hex", "latin1", "ucs-2", "ucs2", "utf-8", "utf16le", "utf8", "url"];
		let enc;
		if (!encds[Number(args[0]) - 1] || (isNaN(args[0]))) {
			return message.reply(`Invalid index "${args[0] || "null"}"; the indexes are as follows: ${encds.map((x) => `${x} (\`${encds.indexOf(x) + 1}\`)`).join(", ")}`);
		}
		else {
			if (!args.slice(1).join(" ").length) return message.reply("You must supply some text for me to decode!");

			if (Number(args[0]) == 11) {
				enc = decodeURIComponent(args.slice(1).join(" "));
			}
			else {
				enc = Buffer.from(args.slice(1).join(" "), (encds[Number(args[0]) - 1])).toString("ascii");
			}
		}
		if (!enc) return message.reply("The decoder has returned nothing this time round... try to decode something a bit longer than " + args.slice(1).join(" ").length + " characters.");
		// I decided not to Util.splitMessage here because it's not likely that this will ever exceed 4 thousand characters (that is Discord's character limit for embeds; refer to the documentation)
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(enc),
			],
		});
	},
};