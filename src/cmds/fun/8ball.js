"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "8ball",
	aliases: ["8ball", "b"],
	description: "Ask the bot a question and get its reponse/idea about it. I'm sure you know what 8ball really is.\nWhy not try it out?",
	usage: "<question: string>",
	async run(client, message, args) {
		if (!args.length) {
			return message.reply({ content: ":x: You need to ask me a question..." });
		}
		const question = args.join(" ");
		const answers = [
			"As I See It Yes",
			"Ask Again Later",
			"Better Not Tell You Now",
			"Cannot Predict Now",
			"Concentrate and Ask Again",
			"Don't Count On It",
			"It Is Certain",
			"It Is Decidely So",
			"Most Likely",
			"My Reply Is No",
			"My Sources Say No",
			"Outlook Good",
			"Outlook Not So Good",
			"Signs Point to Yes",
			"Very Doubtful",
			"Without A Doubt",
			"Yes",
			"Impossible",
			"bruh",
			"Yes - Definitely",
		];

		const embed = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle("The 8Ball has spoken.")
			.addField("Info", `**Your Question:** ${question}\n**My Prediction:** ${answers[~~(Math.random() * answers.length)]}`);
		message.reply({ embeds: [embed] }).catch(() => {return;});
	},
};