const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'disown',
	aliases: ['disown'],
	description: 'This **deletes** your dragon. **THIS ACTION CAN NOT AND WILL NOT BE UNDONE.**', 
	category: 'pet',
	cst: "dragon",
	async run(client, message, args) {
		let filter = m => m.author.id === message.author.id;
		const msg = await message.reply("Are you sure you want to disown your dragon? **This action cannot be undone.** Reply with `y`. Anything which is not `y` will be considered as no.");
		message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] }).then(async(c) => {
			if (c.first().content.toLowerCase().startsWith("y")) {
		await client.db.delete('pet' + message.author.id);
			return message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${message.author.tag} has disowned their dragon :sob:`)
			})
			} else message.reply("You didn't respond with `y`; I'll take that as a no.")
		})
			.catch((e) => {
				message.reply(`${message.author}, You didn't respond in time!`);
				console.log(
					e
				)
			})
	}
}