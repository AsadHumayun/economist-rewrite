const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "decline",
	aliases: ["decline"],
	description: "decline someone's staff app",
	ssOnly: true,
	cst: "srmod",
	cstMessage: "You must be a **Senior Moderator** in order to use this command!",
	async run(client, message, args) {
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("You must mention a user whose application you wish to decline!");
		let cst = await client.db.get("cst" + user.id) || "";
		cst = cst.split(";");
		if (!cst.includes("sbmt")) return message.reply("That user hasn't submitted their staff application yet!");
		const ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(user.id));
		if (!ch) return message.reply("That user has not applied for staff.");
		client.channels.cache.get(client.config.channels.appNotifs)
			.send(`Application ${ch} submitted by ${user.tag} (${user.id}) has been **declined** by ${message.author.tag} (${message.author.id})`);
		const em = new MessageEmbed()
			.setColor(client.config.statics.defaults.channels.colors.red)
			.setDescription("Sorry, but your Staff Application has been declined.")
			.addField("Senior Moderator", message.author.tag)
			.addField("Reason", args.slice(1).join(" ") || "Please contact me for your reason.");
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${user.tag}'s Staff Application has been declined by ${message.author.tag}; they have been sent the following message:`),
				em,
			],
		});
		message.reply({ embed: em });
		user.send({ embed: em })
			.catch((err) => {
				message.channel.send({
					content: `Failed to message ${user.tag} (${user.id}): \`${err}\``,
				});
			});
	},
};