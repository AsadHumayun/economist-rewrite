const Discord = require('discord.js');

module.exports = {
	name: 'rolecolor',
	aliases: ["rolecolor", 'rolecolour','rc'],
	description: "Change the color of your assignable role! (for black, use `#000001`)",
	category: 'ecn',
	usage: 'rolecolor <@role, ID or name> <new hex color>',
	async run(client, message, args) {
		if (message.guild.id != client.config.statics.supportServer) return message.reply("This command only works in the support server as a result of how role information is manipulated.");		
		if (args.length < 2) {
			return message.reply("You must specify a valid role keyword and a new hex colour code under the format of `" + message.guild.prefix + "rolecolor <keyword> <hex colour>`")
		}
		let col = args[1];
		if (!col) return message.reply(`${client.config.statics.defaults.emoji.err} You need to provide a valid hex colour code. Make sure you use the correct format: \`${message.guild.prefix}rolecolor <role keyword> <hex color>\``)

		let roles = await client.db.get("cgrl" + message.author.id);
		if (!roles) return message.reply(`${client.config.statics.defaults.emoji.err} You do not own any custom roles. `);

		roles = client.config.listToMatrix(roles.split(";"), 2);
		let key = args[0].toLowerCase();
		let kw = roles.map((x) => x[0]);
		if (!kw.includes(key)) {
			return message.reply("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: " + kw.map(x => `\`${x}\``).join(', '));
		};

		let role = roles.find((x) => x[0] == args[0].toLowerCase());
			role = message.guild.roles.cache.get(role[1]);
		args[1] = args[1].replace(/#+/g, '');
		let color = args[1];
		let len = args[1].length - 6;
		let x = args[1].slice(0, -len);
		if (!color.startsWith('#')) {
			color = `#${args[1]}`;
		} else {
			color = args[1];
		};
		if (args[1].length > 6 && !args[1].startsWith("#")) {
			color = `#${x}`
		} else if (args[1].length > 6) {
			color = x;
		}
		let clr = role.hexColor;
		let regex = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
		result = regex.test(color);
		if (result == true) {
			role.setColor(color);
			return message.reply("", {
				embed: new Discord.MessageEmbed()
				.setDescription(`${client.config.statics.defaults.emoji.tick} Colour for role ${role.name} was successfully edited from ${clr} to **${color}**`)
				.setColor(color)
			});
		} else {
			return message.reply(`${client.config.statics.defaults.emoji.err} You must provide a valid hexadecimal colour code in order for this command to work!`, {
				embed: new Discord.MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`**Examples:** \`#ff0000\` or \`#ffff00\`\nFor help, use a [hex colour picker](https://htmlcolorcodes.com/)!`)
			});
		};
	},
};