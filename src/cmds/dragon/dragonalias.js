"use strict";

import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";

export default {
	name: "dragonalias",
	aliases: ["dragonalias", "da"],
	cst: "dragon",
	description: "Choose a dragon alias to be displayed on your dragon!",
	async run(client, message) {
		let hasAliases = [];
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split(";") : [];
		const aliases = client.const.petaliases;
		const dragAliases = Object.entries(aliases);
		hasAliases = dragAliases.filter(alias => cst.includes(alias[0].toLowerCase()));
		let currAlias = message.author.data.get("curr")?.toLowerCase();
		if (!dragAliases.includes(currAlias)) {
			currAlias = "default";
		}
		hasAliases.push(["default", client.const.petaliases.default]);
		const menu = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("0")
				.setPlaceholder("Select a dragon alias to display.")
				.setOptions(hasAliases.map((a, index) => {
					return {
						label: a[0],
						description: `Select this option to set the "${a[0]}" dragon alias as preferred`,
						value: `${a[0]};${index}`,
					};
				})),
		);
		const msg = await message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
					.setDescription("Use the drop-down menu to select your alias."),
			],
			components: [ menu ],
			allowedMentions: { repliedUser: true },
		});
		// TODO:
		// Do something that prevents all of these lil functions ftom being scattered around
		// define it in utils or smth
		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};
		msg.awaitMessageComponent({ filter, componentType: "SELECT_MENU", time: 30_000 })
			.then(async res => {
				const values = res.values[0].split(";");
				const alias = client.const.petaliases[values[0]];
				await client.db.USERS.update({
					curr: values[0],
					petname: alias.DISPLAY_NAME,
				}, {
					where: {
						id: message.author.id,
					},
				});
				msg.edit({
					content: null,
					components: [],
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`Selected "${values[0]}" as preferred dragon alias.`),
					],
				});
			})
			.catch(() => {
				msg.edit({
					embeds: [
						new MessageEmbed(msg.embeds[0])
							.setColor(client.const.colors.expired)
							.setTitle("This message has expired.")
							.setDescription(`~~${msg.embeds[0].description}~~`),
					],
				});
			});
	},
};