"use strict";
import { MessageEmbed } from "discord.js";

export default {
	name: "rolename",
	aliases: ["rolename", "rolename", "rn"],
	category: "ecn",
	description: "Change the name of your assignable role!",
	ssOnly: true,
	async run(client, message, args) {
		if (args.length < 2) {
			return message.reply("You must specify a valid role keyword and a new role name under the format of `" + message.guild.prefix + "rolename <keyword> <new name>`");
		}
		let roles = message.author.data.get("cstmrl");
		if (!roles) return message.reply(`${client.config.statics.defaults.emoji.err} You do not own any custom roles. `);

		roles = client.config.listToMatrix(roles.split(";"), 2);
		const key = args[0].toLowerCase();
		const kw = roles.map((x) => x[0]);
		if (!kw.includes(key)) {
			return message.reply(`A role by that keyword was not found. Please use \`${message.guild.prefix}roles\` to view a list of roles that you own. If you are still having trouble, please message ${client.users.cache.get(client.config.owner).tag}.`);
		}
		const role = roles.find((x) => x[0] == key);

		const name = args.slice(1).join(" ").slice(0, 100);
		if (!name) return message.reply("You must specify a new role name in order for this command to work! (max rolename length is 500 chars)");

		const Role = message.guild.roles.cache.get(role[1]);
		const rname = Role.name;
		if (!Role) return message.reply(`${client.config.statics.defaults.emoji.err} I cannot find your custom role!`);
		Role.setName(name);
		return message.reply({
			embeds: [
				new MessageEmbed()
					.setDescription(`Successfully renamed the ${rname} role to "${name}"`)
					.setColor(message.author.color),
			],
		});
	},
};