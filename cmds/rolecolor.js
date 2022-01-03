"use strict";
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "rolecolor",
	aliases: ["rolecolor", "rolecolour", "rc"],
	description: "Change the color of your assignable role! (for black, use `#000001`)",
	category: "ecn",
	usage: "rolecolor <@role, ID or name> <new hex color>",
	ssOnly: true,
	async run(client, message, args) {
		if (args.length < 2) {
			return message.reply("You must specify a valid role keyword and a new hex colour code under the format of `" + message.guild.prefix + "rolecolor <keyword> <hex colour>`");
		}

		let roles = message.author.data.get("cstmrl");
		if (!roles) return message.reply(`${client.config.statics.defaults.emoji.err} You do not own any custom roles. `);

		roles = client.config.listToMatrix(roles.split(";"), 2);
		const key = args[0].toLowerCase();
		const kw = roles.map((x) => x[0]);
		if (!kw.includes(key)) {
			return message.reply(`A role by that keyword was not found. Please use \`${message.guild.prefix}roles\` to view a list of roles that you own. If you are still having trouble, please message ${client.users.cache.get(client.config.owner).tag}.`);
		}

		let role = roles.find((x) => x[0] == args[0].toLowerCase());
		role = message.guild.roles.cache.get(role[1]);
		args[1] = args[1].replace(/#+/g, "");
		let color = args[1];
		const len = args[1].length - 6;
		const x = args[1].slice(0, -len);
		if (!color.startsWith("#")) {
			color = `#${args[1]}`;
		}
		else {
			color = args[1];
		}
		if (args[1].length > 6 && !args[1].startsWith("#")) {
			color = `#${x}`;
		}
		else if (args[1].length > 6) {
			color = x;
		}
		const clr = role.hexColor;
		const regex = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
		const result = regex.test(color);
		if (result == true) {
			role.setColor(color);
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setDescription(`${client.config.statics.defaults.emoji.tick} Colour for role ${role.name} was successfully edited from ${clr} to **${color}**`)
						.setColor(color),
				],
			});
		}
		else {
			return message.reply({
				content: `${client.config.statics.defaults.emoji.err} You must provide a valid hexadecimal colour code in order for this command to work!`,
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription("**Examples:** `#ff0000` or `#ffff00`\nFor help, use a [hex colour picker](https://htmlcolorcodes.com/)!"),
				],
			});
		}
	},
};