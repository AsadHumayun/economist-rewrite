"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "addcredits",
	aliases: [ "addcredits", "addcred" ],
	description: "Adds pet credits to a certain user",
	usage: "<user: UserResolvable> <credits: ?number>",
	cst: "addcredits",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("Desired usage for this command is: `" + (message.guild ? message.guild.prefix : client.const.prefix) + "addcredits <user> [amount]`");
		const user = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("Unknown user");
		const credits = isNaN(args[1]) ? 1 : BigInt(args[1]);
		const data = await client.db.getUserData(user.id);
		const ucst = (data.get("cst") || "").split(";").includes("dragon");
		if (!ucst) return message.reply("That person doesn't have a dragon!");
		const pet = data.get("drgn").split(";").map(client.utils.expand);
		if (pet.length < client.const.intendedPetLength) return message.reply("Malformed pet - does not have at least " + client.utils.statocs.intendedPetLength + " elements.");
		const alias = await client.utils.getDragonAlias(user.id);
		pet[4] += credits;
		await client.db.USERS.update({
			drgn: pet.map(client.utils.format).join(";"),
		}, {
			where: {
				id: user.id,
			},
		});
		message.reply({ embeds: [
			new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${user.tag} has received ${alias[1][3]} ${client.utils.comma(credits)}`),
		] });
	},
};