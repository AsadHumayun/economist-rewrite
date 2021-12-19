const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
	name: "daily",
	aliases: ["daily"],
	category: "ecn",
	description: "Adds :dollar: 5,000 to your account",
	async run(client, message) {
		const cd = client.config.cooldown(message.createdTimestamp, message.author.data.get("dlc") * 60_000);
		if (cd) {
			message.reply(`You must wait ${cd} before collecting your daily reward!`);
		}
		else {
			await client.db.USERS.update({
				bal: message.author.data.get("bal") + client.config.statics.dailyReward,
				dlc: client.config.parseCd(message.createdTimestamp, ms("1d")),
			}, {
				where: {
					id: message.author.id,
				},
			});
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