"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "dm",
	aliases: ["dm"],
	usage: "<user: UserResolvable> <message: string>",
	description: "This command will send `<message>` to the target user.",
	logAsAdminCommand: true,
	cst: "dm",
	async run(client, message, args) {
		// by doing args[0]||"", it means that args[0] will a) never be undefined, and b) will mean that the user fetch request still fails, therefore the if statement below it triggers. This saves me from having to write in ANOTHER if statement.
		const user = await client.utils.fetchUser(args[0] || "").catch(() => {return;});
		if (!user) return message.reply("You must mention the recipient in order for this command to work!");

		const msg = args.slice(1).join(" ");
		if (!msg) return message.reply("You must include a message.");
		const uclr = (message.author.data.get("clr") || "#00aaaa;0").split(";");
		// uclr[uclr.length - 1]: the last number tells you where the bot is in its colour cycle. This is updated b4 each command use in index.js.
		const emb = new MessageEmbed()
			.setColor(uclr[uclr.length - 1])
			.setAuthor({ name: `${message.author.username}(${message.author.id})`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setDescription(msg.toString());
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${user.tag} has been sent the following message:`),
			],
		});
		user.send({ embeds: [emb] })
			.then(() => {
				message.channel.send({ embeds: [emb] });
			})
			.catch((error) => {
				message.channel.send({
					content: `Unable to message U:${user.tag}(${user.id}): \`${error}\``,
				});
			});
	},
};