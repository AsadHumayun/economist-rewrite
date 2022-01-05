"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "encode",
	aliases: ["encode", "enc"],
	description: "Encodes any supplied text",
	category: "utl",
	async run(client, message, args) {
		if (!args[0]) args[0] = "null";
		const encds = ["ascii", "base64", "binary", "hex", "latin1", "ucs-2", "ucs2", "utf-8", "utf16le", "utf8", "url", "reverse"];
		let enc;
		if (!encds[Number(args[0]) - 1] || (isNaN(args[0]))) {
			return message.reply(`Invalid index "${args[0]}"; the indexes are as follows: ${encds.map((x) => `${x} (\`${encds.indexOf(x) + 1}\`)`).join(", ")}`);
		}
		else {
			if (!args.slice(1).join(" ").length) return message.reply("You must supply some text for me to encode!");
			if (Number(args[0] == 3)) {
				enc = client.t2b(args.slice(1).join(" "));
			}
			else if (Number(args[0]) == 11) {
				enc = encodeURIComponent(args.slice(1).join(" "));
			}
			else if (Number(args[0]) == 12) {
				enc = args.slice(1).map((x) => x.split("").reverse().join("")).join(" ");
			}
			else {
				enc = Buffer.from(args.slice(1).join(" ")).toString((encds[Number(args[0]) - 1]));
			}
		}
		if (!enc) return message.reply("The encode function has returned nothing this time round... try to encode something a bit longer than " + args.slice(1).join(" ").length + " characters.");
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`\`\`\`\n${enc}\n\`\`\``),
			],
		});
	},
};