"use strict";
import { MessageEmbed } from "discord.js";
import { evaluate } from "mathjs";

export default {
	name: "calculate",
	aliases: ["calculate", "calc", "math", "maths"],
	description: "Calculates a calculation and returns the numerical answer",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must specify a calculation!");
		const calc = args.join(" ");
		const number = evaluate(calc);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(client.utils.noExponents(number)),
			],
		});
	},
};