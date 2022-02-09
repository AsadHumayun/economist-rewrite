const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "bug",
	aliases: ["bug"],
	category: "utl",
	description: "Reports a bug in the support server. These will be reveiwed and taken seriously - spam or missuse of this command may result in a stun or blacklist from using this command.",
	async run(client, message) {
		let count = await client.db.get("bgc" + client.user.id) || 0;
		count = Number(count);
		const arr = message.content.slice(message.guild ? message.guild.prefix : client.const.prefix.length + 3).split(/\|+/);
		const title = arr[0];
		const desc = arr.slice(1).join(" ");
		if (!title || !desc) {
			return message.reply("You must include a title and a description for your bug separated by `|`, for example: `" + message.guild ? message.guild.prefix : client.const.prefix + "bug title for bug | description`");
		}
		let id = Math.floor(Math.random() * 100000);
		const val = await client.db.get("bugr" + id);
		while (val) {
			id = Math.floor(Math.random() * 100000);
		}
		const embed = new MessageEmbed()
			.setColor(message.author.color)
			.setAuthor(`Bug Report #${count + 1}`)
			.setTitle(title)
			.setDescription(desc)
			.setTimestamp()
			.addField("Staff", `\`~approve ${id} <message>\` to approve this bug report and send ${message.author.tag} <message>\n\`~reject ${id} <message>\` reject this bug and send ${message.author.tag} <message>`)
			.setFooter(`${message.author.tag} | ${message.author.id}`);
		message.reply(embed);
		const msg = await client.channels.cache.get(client.config.channels.bug).send(embed);
		await client.db.set("bugcount", count + 1);
		await client.db.set("bugr" + id, {
			number: count + 1,
			author: message.author.id,
			msg: msg.id,
			at: Date.now(),
			title: title,
		});
	},
};