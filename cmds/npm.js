"use strict";
import { MessageEmbed } from "discord.js";
const moment = require("moment");
const fetch = require("node-fetch");

export default {
	name: "npm",
	desc: "Search [npmjs](https://www.npmjs.com/) for any package",
	usage: "npm <package>",
	aliases: ["npm", "npmjs"],
	async run(client, message, args) {
		if (!args.length) {
			const res = await fetch("https://registry.npmjs.com/");
			const data = await res.json();
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor("#da0000")
						.setAuthor({ name: "NPM", iconURL: "https://i.imgur.com/ErKf5Y0.png", url: "https://www.npmjs.com/" })
						.setTitle("Database Information")
						.addField("Name", data.db_name, true)
						.addField("Doc Count", client.config.comma(data.doc_count), true)
						.addField("Modification Count", client.config.comma(data.update_seq), true)
						.addField("Compact Running", (data.compact_running || false).toString(), true)
						.addField("Deleted Documents", client.config.comma(data.doc_del_count), true)
						.addField("Disk Size", `${client.config.comma(Math.trunc(Number(data.data_size / 1024 / 1024)))} / ${client.config.comma(Math.trunc(Number(data.disk_size) / 1024 / 1024))} MB`, true),
				],
			});
		}
		const pkg = encodeURIComponent(args.join(" "));
		const msg = await message.reply("Fetching package...");
		const res = await fetch(`https://registry.npmjs.com/${pkg}`);
		if (res.status == 404) {
			return msg.edit("I could not find the specified package");
		}
		const body = await res.json();
		if (body.time.unpublished) {
			return msg.edit({ content: "The specified package is unpublished" });
		}

		const version = body["dist-tags"] ? body.versions[body["dist-tags"].latest] : {};
		const dependencies = version.dependencies ? version.dependencies : [];
		const embed = new MessageEmbed()
			.setColor(message.author.color)
			.setAuthor({ name: body.name, iconURL: "https://i.imgur.com/ErKf5Y0.png", url: `https://www.npmjs.com/package/${pkg}` })
			.setDescription(body.description || "No description.")
			.addField("Version", body["dist-tags"].latest || "Unknown", true)
			.addField("License", body.license || "None", true)
			.addField("Author", body.author ? body.author.name : "Unknown", true)
			.addField("Created On", moment.utc(body.time.created).format("YYYY/MM/DD hh:mm:ss"), true)
			.addField("Last Modified", moment.utc(body.time.modified).format("YYYY/MM/DD hh:mm:ss"), true)
			.addField("Main File", `\`${version.main}\`` || "`index.js`", true)
			.addField("Maintainers", client.config.trim(body.maintainers.map(({ name }) => name).join(", "), 1024), true)
			.addField("Dependencies", dependencies.length > 0 ? dependencies.join(", ") : "None", true)
			.setFooter(`In ${Date.now() - message.createdTimestamp} MS`);

		return msg.edit({ content: null, embeds: [embed] });
	},
};