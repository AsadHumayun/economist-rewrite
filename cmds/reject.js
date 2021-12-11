const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: "reject",
	aliases: ["reject", "rej"],
	description: 'Reject a bug, completely disregarding it.',
	dev: true,
	category: 'btsf',
	async run(client, message, args) {
		if (!args.length) return message.reply("You must provide a bug ID of the bug you wish to reject")
		const id = args[0];
		const reason = args.slice(1).join(' ');
		message.delete().catch(() => {return;});
		const val = await client.db.get(`bugr${id}`);
		if (!val) return message.reply(`${client.config.statics.defaults.emoji.err} No bug report with ID "${id}" was found.`);
		client.channels.cache.get(client.config.channels.bug)
			.messages.fetch({
				limit: 1,
				around: val.msg,
			})
				.then(async(col) => {
					const rec = new MessageEmbed()
						.setColor(client.config.colors.red)
						.setTitle(val.title)
						.setDescription(`${client.config.statics.defaults.emoji.err} **Bug report #${val.number} was rejected by ${escapeMarkdown(message.author.tag)}**`)
						col.first().edit('', {
							embed: rec,
						});
				})
				.catch((x) => message.reply("There was an error: `" + x + "`"));
			message.reply(`${client.config.statics.defaults.emoji.err} You've rejected bug with ID **${id}**`);
		await client.db.delete(`bugr${id}`);
		client.users.cache.get(val.author)
			.send(`Your bug (${id}) has been rejected by ${message.author.tag}\n${reason ? `${message.author.tag}'s Comments: ${reason}` : ""}`)
				.catch(() => {return;});
	},
};