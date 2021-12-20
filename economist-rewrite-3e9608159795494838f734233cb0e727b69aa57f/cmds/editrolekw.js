const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'editrolekw',
	aliases: ['editrolekw', 'edrk', 'erk'],
	description: 'Edit a role\'s keyword. usage `editrolekw <old keyword> <new keyword>`',
	category: 'ecn',	
	cst: "editrolekw",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must provide a valid role keyword.")
		let roles = await client.db.get("cgrl" + message.author.id);
		if (!roles) return message.reply(`${client.config.statics.defaults.emoji.err} You do not own any custom roles.`);

		roles = client.config.listToMatrix(roles.split(";"), 2);
		let kw = roles.map((x) => x[0]);
		let key = args[0].toLowerCase();
		let newkw = args[1].toLowerCase();
		if (!kw.includes(key)) {
			return message.reply("You don't seem to own a role with that keyword!\n\nYour owned roles' keywords are: " + kw.map((x) => `\`${x}\``) + "");
		};
		if (kw.includes(newkw)) return message.reply(`You already possess a role with the "${newkw}" keyword. Try a different one.`)
		let role = roles.find((x) => x[0] == key);
		let oldRole = role.join(";");
		let indx = roles.findIndex((f) => f[0] == key);
		role[0] = newkw;
		roles = roles.filter((x) => x[1] != oldRole.split(";")[1]);
		roles.push(role);
		roles = client.arrayMove(roles, roles.length - 1, indx);
		roles = roles.map((x) => Array.from(x).join(";"));
		await client.db.set("cgrl" + message.author.id, roles.join(";"));
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`Successfully edited the "${key}" keyword to "${newkw}"`)
		});
	},
};