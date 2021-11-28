const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'nameb',
	aliases: ["nameb", "namebusiness", "name-business"],
	businessman: true,
	description: "Rename your business - costs :dollar: 10,000 in legal fees. It's free for the first time, though.",
	category: 'ecn',
	async run(client, message, args){
		let name = args.join(' ');
		if (!name) {
			return message.reply("You must specify a new name for your business!")
		}
		let oldName = await client.db.get("bsun.name" + message.author.id);
		const oldBal = await client.db.get('bal' + message.author.id) || 0;
		if(isNaN(oldBal)) oldBal = 0;
		if (Number(oldBal - 10000) < 0) return message.reply("You don't have enough money! (costs :dollar: 10,000 to rename)");
		await client.db.set("bal" + message.author.id, Number(oldBal - 10000))
		await client.db.set("busn.name" + message.author.id, name);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has paid :dollar: 10,000 in legal fees and renamed their business to "${name}"`)
		})
	}
}