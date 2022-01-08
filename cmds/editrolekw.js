"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "editrolekw",
	aliases: ["editrolekw", "edrk", "erk"],
	description: "Edit a role's keyword. usage `editrolekw <old keyword> <new keyword>`",
	category: "ecn",
	cst: "editrolekw",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must provide a valid role keyword.");
		let roles = message.author.data.get("cstmrl");
		if (!roles) return message.reply(`${client.const.emoji.err} You do not own any custom roles.`);

		roles = client.utils.listToMatrix(roles.split(";"), 2);
		const kw = roles.map((x) => x[0]);
		const key = args[0].toLowerCase();
		const newkw = args[1].toLowerCase();
		if (!kw.includes(key)) {
			return message.reply("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: " + kw.map((x) => `\`${x}\``) + "");
		}
		if (kw.includes(newkw)) return message.reply(`You already possess a role with the "${newkw}" keyword. Try a different one.`);
		const role = roles.find((x) => x[0] == key);
		const oldRole = role.join(";");
		const indx = roles.findIndex((f) => f[0] == key);
		role[0] = newkw;
		roles = roles.filter((x) => x[1] != oldRole.split(";")[1]);
		roles.push(role);
		roles = client.utils.arrayMove(roles, roles.length - 1, indx);
		roles = roles.map((x) => Array.from(x).join(";"));
		await client.db.USERS.update({
			cstmrl: roles.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Successfully edited the "${key}" role to "${newkw}"`),
			],
		});
	},
};