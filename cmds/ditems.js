const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ditems',
	aliases: ['dperms', 'ditems'],
	description: "Shows your currently active donor items / bought permissions",
	category: 'utl',
	async run(client, message, args) {
		if (!args.length) args = [message.author.id];
		const user = await client.config.fetchUser(args[0]).catch((x) => {});
		if (!user) user = message.author;
		let cst = await client.db.get("cst" + user.id) || "";
				cst = cst.split(";");

		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${user.tag}'s Donor Ranks`)
			.setDescription(
				`
				\`${message.guild.prefix}ptransfer <user> <item>\` to transfer an item to another account

				\`\`\`\n${client.inspect(cst.filter((x) => client.config.ditems.map((i) => i.split(";")[1]).includes(x)))}\n\`\`\`
				`
			)
		});
	},
};