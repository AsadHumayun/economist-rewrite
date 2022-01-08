const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "ditems",
	aliases: ["dperms", "ditems"],
	description: "Shows your currently active special/donor permissions",
	category: "utl",
	async run(client, message, args) {
		if (!args.length) args = [message.author.id];
		let user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) user = message.author;
		let cst = await client.db.get("cst" + user.id) || "";
		cst = cst.split(";");

		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${user.tag}'s Donor Ranks`)
					.setDescription(
						`
					\`${message.guild ? message.guild.prefix : client.const.prefix}ptransfer <user> <item>\` to transfer an item to another account

					\`\`\`\n${client.config.Inspect(cst.filter((x) => client.config.statics.ditems.map((i) => i.split(";")[1]).includes(x)))}\n\`\`\`
					`,
					),
			],
		});
	},
};