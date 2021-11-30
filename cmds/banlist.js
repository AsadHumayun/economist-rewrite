const { MessageEmbed } = require("discord.js");
const { menu } = require("discord.js-reaction-menu");
const ms = require("ms");

module.exports = {
	name: "banlist",
	aliases: ["banned", 'bans', "banlist"],
	desc: 'See a list of users banned from the server, along with their IDs and the reason of their ban',
	usage: "bans",
	category: "mod",
    cst: "moderator",
	async run(client, message, args) {
	 message.guild.bans.fetch({ cache: true })
		.then(async(bans) => {
			if (bans.size == 0) {
				return message.reply(`${client.config.emojis.success} There are no users banned from **${message.guild.name}**!`)
			};
			var counter = 1;
			const string = bans.map((b) => `#${counter++} ${b.user.tag} (${b.user.id}) | ${b.reason || "<UNKNOWN REASON>"}`).join("\n");
			let embeds = [];
			const map = string.match(/[^]{1,2048}/g);
			for (const x in map) {
				embeds.push(
					new MessageEmbed()
					.setAuthor(`Users banned form ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
					.setDescription("```\n" + client.trim(map[x], 2030) + "\n```")
					.setColor(message.author.color)
				);
			};
			return new menu(message.channel, message.author.id, embeds, ms('10m'))
			.catch((er) => {
				message.reply(`${client.config.emojis.error} | I was unable to find your bans list; please make sure I have the \`BAN_MEMBERS\` permission`)
			});
		});
	},
};