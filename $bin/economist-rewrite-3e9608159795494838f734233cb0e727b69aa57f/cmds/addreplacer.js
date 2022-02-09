const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addreplacer",
	category: "utl",
	aliases: ["addreplacer", "replaceradd", "newreplacer"],
	description: "Adds a replacer; use `<replace key> <replacer content>`",
	async run(client, message, args) {
		if (args.length < 2) return message.reply({ content: `You must specify a replacer keyword and its content under the format of \`${message.guild ? message.guild.prefix : client.const.prefix}addreplacer <name> <content>\`; for example \`${message.guild ? message.guild.prefix : client.const.prefix}addreplacer firstname Alan\`.` });
		const keyword = args[0].toLowerCase();
		const content = args.slice(1).join(" ");
		if (content.length > 500) return message.reply({ content: `${client.config.statics.defaults.emoji.err} Your replacer content may not exceed 500 characters.` });
		const data = await client.db.get(`replacers${message.author.id}`) || {};
		if (Object.keys(data).length > 10 && (message.author.id != client.config.owner)) return message.reply({ content: "You may not have more than 10 instantaneous replacers; please remove one before adding more!" });
		const newData = Object.assign({}, data, { [keyword]: { content: content, created: Date.now() } });
		await client.db.set(`replacers${message.author.id}`, newData);
		message.reply({ embeds: [
			new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`Successfully added replacer "${keyword}"`),
		] });
	},
};