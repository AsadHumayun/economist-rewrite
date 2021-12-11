const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "pbuy",
	aliases: ["pbuy"],
	description: "Purchase something and use up some of your XP",
	category: "util",
	async run(client, message, args) {
		if (!args.length) return message.reply(`You must follow the format of: \`${message.guild.prefix}pbuy <item>\``);
		var xp = await client.db.get("xp" + message.author.id) || "1;0";
		const lvl = xp.split(";")[0];
				xp = Number(xp.split(";")[1]);
		let cst = await client.db.get("cst" + message.author.id);
				cst = cst ? cst.split(";") : [];
		const item = args[0].toLowerCase();
		let res = client.config.ditems.findIndex((i) => item.startsWith(i.split(";")[0]));
		if (res < 0) return message.reply(`The different types of ditems which you can purchase are: ${client.config.list(client.config.ditems.map((i) => i.split(";")[1]))}`);

		const name = client.config.ditems[res].split(";")[1];
		if (cst.includes(name)) return message.reply(`You already have a \`${name}\` on this account.`);		
		const role = client.config.ditems[res].split(";")[2];
		const price = client.config.ditems[res].split(";")[3];
		if (xp - price < 0) return message.reply(`You don't have enough XP to purchase the \`${name}\` permission! You are required to have a minimum of ${price} XP before purchasing this item; to view your current XP, type \`${message.guild.prefix}xp\``);
		const ss = client.guilds.cache.get(client.config.statics.supportServer).members.cache.get(message.author.id);
		if (ss) {
			ss.roles.add(role);
		};
		cst.push(name);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has successfully bought the ${name} permission!`)
		})
		await client.db.set("xp" + message.author.id, `${lvl};${xp - price}`);
		await client.db.set("bal" + message.author.id, cst.join(";"))
	},
};