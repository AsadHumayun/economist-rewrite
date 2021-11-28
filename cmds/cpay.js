const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'cpay',
	aliases: ['cpay'],
	category: 'ecn',
	description: 'Transfer some of your `credit` to another user.',
	usage: 'cpay <user> <amount>',
	async run(client, message, args) {
		/**
		 * Tells the `user` they don't have enough money t pay someone else.
		 */
		function notEnough() {
			return message.reply("You don't have enough :dollar: in your bank!")
		}
		let authorBal = await client.db.get('crdt' + message.author.id) || 0;
			authorBal = Number(authorBal)
		if (!args.length) return message.reply("You must tell me who to transfer money to!");
			let usr = await client.config.fetchUser(args[0]).catch((x) => {});
			if (!usr) return message.reply("Whoops! I can't find that user");
			if (message.author.id == usr.id) return message.reply(`You can't pay yourself!`);
			if (!args[1]) return message.reply("You must specify the amount of credit you wish to pay " + usr.username);
    let amt = args[1].toLowerCase();
    		amt = Number(amt);
		amt = amt.toFixed(2);
		if (amt < 1) return message.reply("You must enter a positive number.");
		//console.log(amt, typeof Number(amt)) // => 10, Number
		if (isNaN(amt)) return message.reply("You must provide a valid number!")
		if (authorBal < 0 || (!authorBal) || (Number(authorBal - amt) < 0)) return notEnough();
		const amountLeft = Number(Number(authorBal) - Number(amt));
		if (amountLeft < 0) return notEnough();
		 await client.db.set('crdt' + message.author.id, amountLeft);
		let oldBal = await client.db.get('crdt' + usr.id) || 0;
			oldBal = Number(oldBal)
		const newBal = Number(Number(oldBal) + Number(amt));
		await client.db.set('crdt' + usr.id, newBal)
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has paid GBP£${amt} into ${usr.tag}'s account`)
		})
	},
}
