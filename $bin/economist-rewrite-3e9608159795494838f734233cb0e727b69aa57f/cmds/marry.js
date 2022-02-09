const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "marry",
	aliases: ["marry"],
	description: "Get yourself a wifey!",
	category: "ecn",
	async run(client, message, args) {
		const spouse = await client.db.get("spse" + message.author.id);
		if (spouse) {
			const spse = await client.config.fetchUser(spouse);
			return message.reply(`Oi! Don't even think about cheating on ${spse.tag}. You can divorce them by using \`${message.guild ? message.guild.prefix : client.const.prefix}divorce\``);
		}
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [] } });
		if (usr.id == message.author.id) return message.reply("You can't marry yourself! sorreh.");
		let spse0 = await client.db.get("spse" + usr.id);
		spse0 = await client.config.fetchUser(spse0).catch(() => {return;});
		if (spse0) {
			return message.reply(`Too late. ${usr.tag} is already married to ${spse0.tag}`);
		}
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has proposed to ${usr.tag}!\n${usr.tag} has 60 seconds to accept. Type \`accept\` to accept!`),
			],
		});
		message.channel.awaitMessages({
			filter: (m) => m.author.id === usr.id,
			max: 1,
			time: 60 * 1000,
			errors: ["time"],
		})
			.then(async (col) => {
				if (col.first().content.toLowerCase() == "accept") {
					await client.db.set("spse" + message.author.id, usr.id);
					await client.db.set("spse" + usr.id, message.author.id);
					message.reply({
						embeds: [
							new MessageEmbed()
								.setColor(message.author.color)
								.setDescription(`:sparkling_heart: ${message.author.tag} is now married to ${usr.tag}! \`${message.guild ? message.guild.prefix : client.const.prefix}spouse\``),
						],
					});
				}
				else {
					message.reply(`It looks like ${usr.tag} didn't want to marry you, ${message.author}. Better luck next time!`);
				}
			})
			.catch(() => {
				return message.reply(`Welp, ${usr.tag} didn't respond in time.`);
			});
	},
};