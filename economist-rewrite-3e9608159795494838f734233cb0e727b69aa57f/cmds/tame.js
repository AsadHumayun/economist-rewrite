const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'tame',
	aliases: ['tame', 'getdragon'],
	category: 'pet',	
	description: 'tame a dragon! (`~dragon`)',
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id);
				cst = cst ? cst.split(";") : [];
		if (cst.includes("dragon")) return message.reply("You already seem to own a dragon!");
		cst.push("dragon");
		await client.db.set("cst" + message.author.id, cst.join(";"));
		await client.db.set('pet' + message.author.id, client.config.statics.defaults.dragon);
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has successfully tameed a :dragon_face: dragon! | \`${message.guild.prefix}dragon\``)
		});
	},
};