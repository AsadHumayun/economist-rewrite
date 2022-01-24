"use strict";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

export default {
	name: "lowhigh",
	aliases: ["lowhigh", "highlow", "hl", "lh"],
	description: "The bot will generate 2 random numbers between 0 and 100. One number will be displayed for you. It is your job to guess as to whether or not the random number is gerater than, less than, or equal to the other random number that has not been shown to you. If you manage to guess it correctly, you will receive a random amount of :dollar: in the range of 750-1000.",
	async run(client, message) {
		const cd = message.author.data.get("hlc");
		const c = client.utils.cooldown(message.createdTimestamp, cd * 60_000);
		if (c) return message.reply(`You must wait another ${c} before you can use this command again!`);
		const random = client.utils.getRandomInt(0, 100);
		const random0 = client.utils.getRandomInt(0, 100);

		const buttons = [
			new MessageButton()
				.setCustomId("0")
				.setLabel("Lower")
				.setStyle("DANGER"),
			new MessageButton()
				.setCustomId("1")
				.setLabel("Jackpot")
				.setStyle("PRIMARY"),
			new MessageButton()
				.setCustomId("2")
				.setLabel("Higher")
				.setStyle("SUCCESS"),
		];

		const msg = await message.reply({
			components: [new MessageActionRow().addComponents(buttons)],
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`The Low-High Game - ${message.author.tag}`)
					.setDescription(`Your number is: **${random0}**.\n\nIt is your job to guess as to whether or not the other random number that I generated is either lower, higher, or exactly the same as **${random0}**)`),
			],
		}).catch(() => {return;});
		await client.db.USERS.update({
			hlc: Math.trunc(message.createdTimestamp / 60_000) + 10,
		}, {
			where: {
				id: message.author.id,
			},
		});
		const filter = (interaction) => {
			interaction.deferUpdate();
			return interaction.user.id === message.author.id;
		};
		msg.awaitMessageComponent({ filter, componentType: "BUTTON", time: 30_000 })
			.then(async (interaction) => {
				// NOTE: was struggling with this. In the end just ended up making an object storing
				// the operators as individual functions.
				const ops = ["<", "===", ">"];
				const op = client.const.mathOps[ops[interaction.customId]];
				if (!op(random, random0)) {
					return msg.edit({
						embeds: [
							new MessageEmbed()
								.setColor(client.const.colors.red)
								.setDescription(`Incorrect! The number was **${random}**, and the number that I gave you was **${random0}**!`)
								.setFooter("Better luck next time!"),
						],
						components: [],
					});
				}
				const add = client.utils.getRandomInt(750, 1000);
				await client.db.USERS.update({
					bal: message.author.data.get("bal") + add,
				}, {
					where: {
						id: message.author.id,
					},
				});
				msg.edit({
					embeds: [
						new MessageEmbed()
							.setColor(client.const.colors.green)
							.setDescription(`Correct! ${random0} is ${ops[interaction.customId]} ${random}! :dollar: ${add} have been added to your balance... I look forwards to seeing you again :)`),
					],
					components: [],
				});
			})
			.catch(() => {
				msg.edit({
					embeds: [
						new MessageEmbed(msg.embeds[0])
							.setColor(client.const.colors.expired)
							.setDescription(`**This message has expired.**\n\n~~${msg.embeds[0].description}~~`),
					],
					components: [
						new MessageActionRow()
							.addComponents(buttons.map(btn => btn.setDisabled())),
					],
				});
			});
	},
};