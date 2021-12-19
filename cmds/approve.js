const { MessageEmbed, escapeMarkdown } = require("discord.js");

module.exports = {
	name: "approve",
	aliases: ["approve"],
	category: "utl",
	description: "approve a bug. All this does is post it in #announcements lol",
	cst: "bgmngr",
	async run(client, message, args) {
		if (!args.length) return message.reply({ content: "You must provide a bug ID of the bug you wish to approve" });
		const id = args[0];
		const reason = args.slice(1).join(" ");
		await message.delete().catch(() => {return;});
		const bug = await client.db.BUGS.findOne({ where: { id } });
		if (!bug) return message.reply({ content: `${client.config.statics.defaults.emoji.err} No bug report with ID "${id}" was found.` });
		client.channels.cache.get(client.config.statics.defaults.channels.bug)
			.messages.fetch({
				limit: 1,
				around: bug.msg,
			})
			.then(async (col) => {
				const rec = new MessageEmbed()
					.setColor("#6ae691")
					.setTitle(bug.title)
					.setDescription(`${client.config.statics.defaults.emoji.tick} **Bug Report #${bug.number} was approved by ${escapeMarkdown(message.author.tag)}**`);
				col.first().edit({
					content: "",
					embeds: [ rec ],
				});
				client.channels.cache.get(client.config.statics.defaults.channels.bugLog)
					.send(`Bug reported by ${client.users.cache.get(bug.author).tag || "UNKNOWN_USER#0000"} was approved by ${message.author.tag} (${message.author.id})`, {
						embeds: [ new MessageEmbed()
							.setColor(client.config.statics.defaults.channels.colors.red)
							.setTitle(bug.title)
							.setDescription(col.first().embeds[0].description)
							.setTimestamp(bug.at),
						] });
			})
			.catch((x) => message.reply({ content: "There was an error: `" + x + "`" }));
		message.reply(`${client.config.statics.defaults.emoji.tick} You've approved bug with ID **${id}**`);
		await client.db.BUGS.destroy({ where: { id } });
		client.users.cache.get(bug.author)
			.send(`Your bug (${id}) has been approved by ${message.author.tag}\n${reason ? `${message.author.tag}'s Comments: ${reason}` : ""}`)
			.catch(() => {return;});
	},
};