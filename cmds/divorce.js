const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "divorce",
	aliases: ["divorce", "div"],
	description: "Divorce your spouse.",
	category: "ecn",
	async run(client, message) {
		const spouse = await client.db.get("spse" + message.author.id) || "";
		const usr = await client.config.fetchUser(spouse).catch(() => {return;});
		if (!usr) return message.reply(`You're not married to anyone yet! \`${message.guild.prefix}spouse\` to check who you're married with!`);

		await client.db.delete("spse" + message.author.id);
		await client.db.delete("spse" + spouse);

		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`:broken_heart: ${message.author.tag} has divorced ${usr.tag} :cry::cry::cry:`),
			],
		});
	},
};