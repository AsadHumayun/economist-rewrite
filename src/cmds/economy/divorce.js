"use strict";
import { MessageActionRow, MessageButton, MessageEmbed, Util } from "discord.js";

export default {
	name: "divorce",
	aliases: ["divorce", "div"],
	description: "Divorce your spouse.",
	async run(client, message) {
		const spouse = message.author.data.get("spse");
		const usr = await client.utils.fetchUser(spouse).catch(() => {return;});
		if (!usr) return message.reply(`You're not married to anyone yet!\nUse \`${message.guild ? message.guild.prefix : client.const.prefix}marry <user>\` to marry someone.`);
		const buttons = [
			new MessageButton()
				.setCustomId("0")
				.setStyle("SUCCESS")
				.setLabel("Stay married"),
			new MessageButton()
				.setCustomId("1")
				.setStyle("DANGER")
				.setLabel("Divorce now!"),
		];
		const row = new MessageActionRow().addComponents(buttons);
		const msg = await message.reply({ content: `Are you sure that you would like to divorce **${Util.escapeMarkdown(usr.tag)}**?`, components: [row], allowedMentions: { parse: [], repliedUser: true } });

		const filter = (interaction) => {
			interaction.deferUpdate();
			return interaction.user.id == message.author.id;
		};

		msg.awaitMessageComponent({ filter, componentType: "BUTTON", time: 30_000 })
			.then(async (interaction) => {
				if (interaction.customId == "1") {
					await client.db.USERS.update({
						spse: null,
					}, {
						where: {
							id: message.author.id,
						},
					});
					await client.db.USERS.update({
						spse: null,
					}, {
						where: {
							id: spouse,
						},
					});
					msg.edit({
						content: null,
						components: [],
						embeds: [
							new MessageEmbed()
								.setColor(message.author.color)
								.setDescription(`:broken_heart: ${message.author.tag} has successfully divorced ${usr.tag} :cry:`),
						],
					});
				}
				else {
					msg.edit({
						content: "Your divorce was cancelled!",
						components: [],
					});
				}
			})
			.catch(() => {
				msg.edit({
					content: "You didn't choose an option in time. The command was cancelled.",
					components: [new MessageActionRow().addComponents(buttons.map(btn => btn.setDisabled()))],
				});
			});
	},
};