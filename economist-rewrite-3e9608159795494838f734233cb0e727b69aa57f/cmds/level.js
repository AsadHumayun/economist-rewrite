const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "level",
	aliases: ["level", "xp", "lvl"],
	category: "utl",
	description: "View your or someone else's level & XP (only shows info from support server)",
	async run(client, message, args) {
		if (!args.length) args = [message.author.id];
		let user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) user = message.author;
		let data = await client.db.get("xp" + message.author.id) || "1;0";
		data = data.split(";");
		data[0] = Number(data[0]);
		data[1] = Number(data[1]);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${user.tag}'s Experience [${data[0]}]`)
					.setDescription("Whenever you send a message in the support server, you gain a random number of XP between 15 and 35. To prevent spam, XP will only be added once every 60 seconds.")
					.addField("XP", `${data[1]}/${data[0] * 200}`, false)
					.addField("XP Until Level Up", `${(data[0] * 200) - data[1]}`, false),
			],
		});
	},
};