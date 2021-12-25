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
		const data = await client.db.getUserData(user.id);
		const cst = data.get("cst") ? data.get("cst").split(";") : [];

		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${user.tag}'s Donor Ranks`)
					.setDescription(
						`
					\`${message.guild.prefix}ptransfer <user> <item>\` to transfer an item to another account

					\`\`\`\n${client.config.Inspect(cst.filter((x) => client.config.statics.ditems.map((i) => i.split(";")[1]).includes(x)))}\n\`\`\`
					`,
					),
			],
		});
	},
};