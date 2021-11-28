const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const qs = require('querystring');
const moment = require('moment');
const ms = require('ms');
const rm = require('discord.js-reaction-menu');
const { inspect } = require('util');

module.exports = {
	name: 'github',
	aliases: ['github', 'git', 'gh'],
	description: "View a GitHub user stats; 5 seconds cooldown since this uses my personal github access token and I am **NOT** getting myself banned. The exact number of allowed requests will remain unspecified, don't bother asking me.",
	category: 'utl',
	async run(client, message, args) {
		if (!args.length) return message.reply("You must specify a query for this command (a username)")
		let res = await fetch(`https://api.github.com/users/${args[0].toLowerCase()}`);
		if (!res) return message.reply("Your search has yielded no results!");
		res = await res.json();
		if (message.content.toLowerCase().endsWith('-r')) {
			return message.reply(inspect(res, { depth: 10000000 }), { code: 'js' });
		};
		let emb = new MessageEmbed()
		.setColor(message.author.color)
		.setAuthor("GitHub User Search", "http://cdn.asad.codes/static/github.png", `https://api.github.com/users/${args[0]}`)
		.setTitle(`${res.login}'s GitHub Profile`)
		.setThumbnail(res.avatar_url)
		.setDescription(res.bio ? `**Bio:** ${res.bio}` : "No bio found")
		.addField("Name", res.name || 'Unknown', true)
		.addField("Company", res.company || 'Unknown', true)	
		.addField("Hireable", res.hireable == true ? "Yes" : "No", true)
		.addField("User ID", `\`${res.id || 'Unknown'}\``, true)
		.addField("User Type", res.type, true)
		.addField("Followers", res.followers || 0, true)
		.addField("Following", res.following, true)
		.addField("Public Repos", res.public_repos, true)
		.addField("Pubic Gists", res.public_gists, true)
		.addField("Located", res.location || 'Unknown', true)
		.addField("Email", res.email ? `\`${res.email}\`` : "Unknown")	
		.addField("Created", moment(res.created_at).format('MMMM Do YYYY, h:mm:ss A'), true)
		.addField("Last Edited", moment(res.updated_at).format('MMMM Do YYYY, h:mm:ss A'), true)	
	/*	let res2 = await fetch(`https://api.github.com/users/${args[0].toLowerCase()}/followers`);	
		console.log(res2)
		res2 = await res2.json();
		if (message.content.toLowerCase().endsWith('--followers')) {
			Res = res2.map(x => x.login).join(', ').match(/.{1, 2000}g/);
			console.log(Res);
			let embeds = [];
			for (const x in Res) {
				embeds.append(new MessageEmbed().setColor(message.author.color).setTitle(`${res.login}'s GitHub Followers [${res2.length}]`).setDescription(Res[x]))
			};
			console.log(Res)
			return new rm.menu(message.channel, message.author.id, embeds, ms('10m'))
		};
		*/
		message.reply({ embed: emb })
	},
};