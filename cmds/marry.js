"use strict";
import { Util, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export default {
	name: "marry",
	aliases: ["marry"],
	description: "Get yourself a wifey!",
	category: "ecn",
	async run(client, message, args) {
		if (!args.length) return message.reply("You msut mention somebody that you'd like to marry in order for this command to work!");
		const spouse = message.author.data.get("spse");
		if (spouse) {
			const spse = await client.utils.fetchUser(spouse);
			return message.reply(`Oi! Don't even think about cheating on ${spse.tag}. You can divorce them by using \`${message.guild ? message.guild.prefix : client.const.prefix}divorce\``);
		}
		const usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply(`Invalid user "${args[0]}"`, { allowedMentions: { parse: [] } });
		if (usr.id == message.author.id) return message.reply("You can't marry yourself! Sorreh.");
		const data = await client.db.getUserData(usr.id);
		let spse0 = data.get("spse");
		spse0 = await client.utils.fetchUser(spse0).catch(() => {return;});
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
		const msg = await message.reply({ content: `${usr}, **${Util.escapeMarkdown(message.author.tag)}** has proposed to you! You have 60 seconds to either accept their proposal, or publicly reject them!`, components: [row], allowedMentions: { parse: ["users"] } });

		const filter = (interaction) => {
			interaction.deferUpdate();
			return interaction.user.id == usr.id;
		};

		msg.awaitMessageComponent({ filter, componentType: "BUTTON", time: 60_000 })
			.then(async (interaction) => {
				if (interaction.customId == "1") {
					await client.db.USERS.update({
						spse: usr.id,
					}, {
						where: {
							id: message.author.id,
						},
					});
					await client.db.USERS.update({
						spse: message.author.id,
					}, {
						where: {
							id: usr.id,
						},
					});
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
						content: `${message.author.tag}'s proposal to ${usr.tag} was an act of courage. ${message.author.tag}'s love for ${usr.tag} was not reciprocated :cry:\n${usr.tag} has **rejected** ${message.author.tag}...`,
						components: [],
						allowedMentions: {
							parse: [],
							repliedUser: true,
						},
					});
				}
			})
			.catch((err) => {
				console.error(err);
				msg.edit({
					content: "You didn't choose an option in time. The command was cancelled.",
					components: [new MessageActionRow().addComponents(buttons.map((btn) => btn.setDisabled()))],
				});
			});
	},
};