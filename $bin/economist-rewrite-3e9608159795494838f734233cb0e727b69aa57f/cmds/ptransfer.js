const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "ptransfer",
	aliases: ["ptransfer", "transferitm"],
	description: "Transfers one of your owned items to another user; 2 hours' cooldown",
	category: "utl",
	async run(client, message, args) {
		if (args.length < 2) return message.reply(`Please use the following format: \`${message.guild ? message.guild.prefix : client.const.prefix}transferitm <user> <item>\``);
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("You must mention a user!");
		let cst = await client.db.get("cst" + message.author.id);
		let userCst = await client.db.get("cst" + user.id);
		cst = cst ? cst.split(";") : [];
		userCst = userCst ? userCst.split(";") : [];
		const item = args[1].toLowerCase();
		const res = client.config.statics.ditems.findIndex((i) => item.startsWith(i.split(";")[0]));
		if (res < 0) return message.reply(`The different types of ditems which you can transfer are: ${client.config.list(client.config.statics.ditems.map((i) => i.split(";")[1]))}`);

		const name = client.config.statics.ditems[res].split(";")[1];
		const role = client.config.statics.ditems[res].split(";")[2];
		const ss = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(user.id).catch(() => {return;});
		const authorSS = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(message.author.id).catch(() => {return;});

		if (!cst.includes(name)) return message.reply(`You don't currently possess a ${name.toUpperCase()} on this account therefore you cannot transfer it to others.`);
		if (userCst.includes(name)) return message.reply(`U:${user.tag}(${user.id}) already has ${name.toUpperCase()}.`);
		cst = cst.filter((e) => ![name].includes(e));
		userCst.push(name);
		await client.db.set("cst" + message.author.id, cst.join(";"));
		await client.db.set("cst" + user.id, userCst.join(";"));
		authorSS.roles.remove(role)
			.catch(() => {return;});
		if (ss) {
			ss.roles.add(role)
				.catch(() => {return;});
		}
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has successfully transferred "${name.toUpperCase()}" to U: ${user.tag} (${user.id})`),
			],
		});
	},
};