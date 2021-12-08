const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "daily",
	aliases: ["daily"],
	category: "ecn",
	description: "Adds :dollar: 5,000 to your account",
	async run(client, message) {
		let data = await client.db.get("dlc" + message.author.id);
		data = Number(data);
		const cd = client.config.cooldown(message.createdTimestamp, data * 60_000);
		if (cd) {
			message.reply(`You must wait ${cd} before collecting your daily reward!`);
		}
		else {
			let bal = await client.db.get("bal" + message.author.id) || 0;
			bal = Number(bal);
			await client.db.set("dlc" + message.author.id, client.config.parseCd(message.createdTimestamp, ms("1d")));
			await client.db.set("bal" + message.author.id, bal + client.config.statics.dailyReward);
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has collected their daily reward and received :dollar: ${client.config.comma(client.config.statics.dailyReward)} in cash`),
				],
			});
		}
	},
};