"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "color",
	aliases: ["color", "colour", "setcolor", "setcolour", "set-color", "set-colour"],
	description: "Changes your colour prefrence (custom color on embeds) you must have the colorist role in the main server",
	usage: "<...colors: hex<string>>",
	cst: "colorist",
	async run(client, message, args) {
		if (!args.length) {
			const clrs = message.author.data.get("clr");
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setTitle(`${message.author.tag}'s Colour Preferences`)
						.setDescription(`Every time you use a command, each colour is cycled through sequentially. The last value is where the bot is currently at in your cycle. \n\n\`\`\`js\n${message.author.color === "RANDOM" ? `You currently have random colours enabled. To disable this, you can sell the random colour preference shop item and gain your money back. Use ${message.guild?.prefix || client.const.prefix}help sell for more information.` : client.utils.Inspect(clrs.split(";"))}\`\`\``),
				],
			});
		}

		const colors = args
			.map((arg) => {
				const color = `#${arg.replace(/#+/g, "").slice(0, 6)}`;
				if (/^#([a-f\d]{6}|[a-f\d]{3})$/i.test(color)) {
					return color;
				}
				return false;
			});

		if (colors.includes(false)) {
			return message.reply("One of your provided hex colour codes is not valid, please check all values and try again. To add more than one colour, simply separate each one by spaces. If you're still having trouble, feel free to contact `" + client.users.cache.get(client.const.display).tag + "`");
		}

		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has set their colour preferences to \`${client.utils.Inspect(colors)}\`. Use \`${message.guild ? message.guild.prefix : client.const.prefix}color\` to view a list of all your currently set colours.`),
			],
		});
		colors.push("0");
		await client.db.USERS.update({
			clr: colors.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
	},
};