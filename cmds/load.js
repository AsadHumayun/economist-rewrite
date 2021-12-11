const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "load",
	aliases: [ 'load', 'loadbackup' ],
	description: "Loads a backup. Bot-owner only",
	category: 'own',
	cst: "administrator132465798",
	async run(client, message, args) {
		if (message.author.id !== client.config.owner) return message.reply("Only Static can use this command since he's the only one who knows how to!");
		const token = args[0].split("?user=")[0];
		const user = await client.config.fetchUser(args[0].split("?user=")[1]).catch(() => {return;});
		if (!user) return message.reply("User not found.");
		const msg = await message.reply(`Restoring Backup...`);
		const str = Buffer.from(token, 'base64').toString("ascii").split(";");
		for (let kv in str) {
			if (!str[kv]) continue; 
			const key = str[kv].replace('undefined', '').split("_")[0] + user.id;
			let value = str[kv].replace('undefined', '').split("_")[1];
			value = value.toString().replace(/%/g, '_').replace(/::semi/g, ';');
			if (!isNaN(value)) {
				value = Number(value);
			};
			if (value instanceof Boolean) {
				value = Boolean(value);
			};
			await client.db.set(key, value);
		};
		msg.edit(``, {
			embed: new MessageEmbed()
			.setColor("GREEN")
			.setDescription(`Successfully loaded backup under user ${user.tag}`)
			.setFooter(`${Date.now() - msg.createdTimestamp} MS Elapsed`)
		})
	}
}