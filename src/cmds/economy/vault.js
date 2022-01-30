"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "vault",
	aliases: ["vault", "v", "bank"],
	description: "View a user's bank vault. This allows you to store money safely away in a place where it's safe from robbers.",
	async run(client, message, args) {
		let usr = await client.utils.fetchUser(args[0]).catch(() => {return;});
		if (!usr) usr = message.author;
		const data = await client.db.getUserData(usr.id);
		const upg = data.get("cst")?.split(";") || [];
		if (!upg.includes("bvault")) return message.reply(`${message.author.id == usr.id ? "You do " : usr.tag + " does "}not own a Bank Vault. Take a look in \`${message.guild ? message.guild.prefix : client.const.prefix}shop\` for further details.`);
		const v = data.get("v").split(";").map(Number);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle(`${usr.tag}'s Personal Bank Vault [${v[0]}]`)
					.setDescription(`\`${message.guild ? message.guild.prefix : client.const.prefix}vault <user>\` to view a user's vault;\n\`${message.guild ? message.guild.prefix : client.const.prefix}deposit <amount>\` to deposit \`<amount>\` money into your Bank Vault;\n\`${message.guild ? message.guild.prefix : client.const.prefix}withdraw <amount>\` to withdraw \`<amount>\` money from your Bank Vault and gain it as balance money;\n\`${message.guild ? message.guild.prefix : client.const.prefix}vupgrade\` to upgrade your Bank Vault thus increasing the amount of money it can hold.`)
					.addField("Your Bank Vault contains", `:dollar: ${client.utils.comma(v[1])}/${v[0] >= 9999999999 ? "∞" : client.utils.comma(client.utils.noExponents(v[0] * 5000))}`),
			],
		});
	},
};