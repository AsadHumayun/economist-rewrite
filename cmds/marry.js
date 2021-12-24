const { Util, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	name: "marry",
	aliases: ["marry"],
	description: "Get yourself a wifey!",
	category: "ecn",
	async run(client, message, args) {
		const spouse = message.author.data.get("spse");
		if (spouse) {
			const spse = await client.config.fetchUser(spouse);
			return message.reply(`Oi! Don't even think about cheating on ${spse.tag}. You can divorce them by using \`${message.guild.prefix}divorce\``);
		}
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [] } });
		if (usr.id == message.author.id) return message.reply("You can't marry yourself! Sorreh.");
		const data = await client.db.getUserData(usr.id);
		let spse0 = data.get("spse");
		spse0 = await client.config.fetchUser(spse0).catch(() => {return;});
		if (spse0) {
			return message.reply(`${usr.tag} is already married to ${spse0.tag}`);
		}
		const buttons = [
			new MessageButton()
				.setCustomId("1")
				.setStyle("SUCCESS")
				.setLabel("Accept"),
			new MessageButton()
				.setCustomId("0")
				.setStyle("DANGER")
				.setLabel("Reject"),
		];
		const row = new MessageActionRow().addComponents(buttons);
		const msg = await message.reply({ content: `${spse0.toString()}, **${Util.escapeMarkdown(message.author.tag)}** has proposed to you! You have 60 seconds to either Accept his proposal, or publicly reject them!`, components: [row], allowedMentions: { parse: ["user"] } });

		const filter = (interaction) => {
			interaction.deferUpdate();
			return interaction.user.id == message.author.id;
		};

		msg.awaitMessageComponent({ filter, componentType: "BUTTON", time: 60_000 })
			.then(async (interaction) => {
				if (interaction.customId == "1") {
					await client.db.USERS.update({
						spse: spse0.id,
					}, {
						where: {
							id: message.author.id,
						}
					})
					await client.db.USERS.update({
						spse: message.author.id,
					}, {
						where: {
							id: spse0.id
						}
					})
					msg.edit({
						content: null,
						components: [],
						embeds: [
							new MessageEmbed()
								.setColor(message.author.color)
								.setDescription(`:two_hearts: ${message.author.tag} and ${usr.tag} are now a newly wed couple!\n:clap::clap::clap::clap::clap::clap:`),
						],
					});
				}
				else {
					msg.edit({
						content: `${message.author.tag}'s proposal to ${spse0.tag} was an act of courage. ${message.author.tag}'s love for ${spse0.tag} was not reciprocated :cry:\n${spse0.tag} has **rejected** ${message.author.tag}...`,
						components: [],
						allowedMentions: {
							parse: [],
							repliedUser: true,
						}
					})
				}
			})
			.catch((err) => {
				console.error(err);
				msg.edit({
					content: "You didn't choose an option in time. The command was cancelled.",
					components: [new MessageActionRow().addComponents(buttons.map((btn) => btn.setDisabled()))],
				});
			});
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