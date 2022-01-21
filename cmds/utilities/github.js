"use strict";
import { MessageEmbed } from "discord.js";
import { inspect } from "util";
import fetch from "node-fetch";
import moment from "moment";

export default {
	name: "github",
	aliases: ["github", "git", "gh"],
	description: "View a GitHub user stats; 5 seconds cooldown since this uses my personal github access token and I am **NOT** getting myself banned. The exact number of allowed requests will remain unspecified, don't bother asking me.",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must specify a query in order for this command to work!");
		args[0] = encodeURIComponent(args[0]);
		let res = await fetch(`https://api.github.com/users/${args[0]}`);
		if (!res) return message.reply("Your search has yielded no results!");
		res = await res.json();
		if (message.content.toLowerCase().endsWith("-r")) {
			return message.reply("```js\n" + inspect(res, { depth: 0 }) + "\n```");
		}
		const emb = new MessageEmbed()
			.setColor(message.author.color)
			.setAuthor({ name: "GitHub User Search", iconURL: "https://cdn.asad.codes/static/github.png", url: `https://github.com/${args[0]}` })
			.setTitle(`${res.login}'s GitHub Profile`)
			.setThumbnail(res.avatar_url)
			.setDescription(res.bio ? `**Bio:** ${res.bio}` : "None")
			.addField("Name", res.name || "Unknown", true)
			.addField("Company", res.company || "Unknown", true)
			.addField("Hireable", res.hireable == true ? "Yes" : "No", true)
			.addField("User ID", `\`${res.id || "Unknown"}\``, true)
			.addField("User Type", res.type.toString(), true)
			.addField("Followers", (res.followers || 0).toString(), true)
			.addField("Following", res.following.toString(), true)
			.addField("Public Repos", res.public_repos.toString(), true)
			.addField("Pubic Gists", res.public_gists.toString(), true)
			.addField("Located", res.location || "Unknown", true)
			.addField("Email", res.email ? `\`${res.email}\`` : "Unknown", true)
			.addField("Created", moment(res.created_at).format("MMMM Do YYYY, h:mm:ss A"), true)
			.addField("Last Edited", moment(res.updated_at).format("MMMM Do YYYY, h:mm:ss A"), true);
		message.reply({ embeds: [emb] });
	},
};