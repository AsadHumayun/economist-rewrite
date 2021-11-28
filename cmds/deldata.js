const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
	name: 'deldata',
	aliases: ['deldata', 'removedata', 'forget'],
	description: 'Innact the right to be forgotten (deletes all your data)',
	category: 'utl',	
	async run(client, message, args) {
		if (message.author.id == client.config.owner) {
			if (!args.length) return message.reply("You must mention someone for me to forget!");
			const usr = await client.config.fetchUser(args[0]).catch((x) => {});
            if (!usr) return message.reply("Unknown User.");
            let keys = client.keys;
            keys = keys.concat(client.commands.map(x => `cmds.${x.name}`));
            for (x in keys) {
                await client.db.delete(`${keys[x]}${usr.id}`)
                    .catch((error) => message.reply("Error whilst deleting keys[" + x + "]" + error, { code: 'xl' }))
            };
            message.reply({
                embed: new MessageEmbed()
                .setColor(message.author.color)
				.setDescription(`${client.config.statics.defaults.emoji.tick} **${escapeMarkdown(usr.tag)}**'s data has been successfully removed`)
			});
			return;
		};
		const already = await client.db.get('deldatareqed' + message.author.id);
		if (already) {
			return message.reply("You've already requested for the removal of your data!")
		}

		const confirm = 'I would like to innact the right to be forgotten!';
		message.reply("Are you sure you want to delete **ALL** your data?\nThis action can **NOT**, and will **NOT** be undone.\n\nYou have 30 seconds to type the following phrase into chat: `I would like to innact the right to be forgotten!` (case sensitive)");

		const filter = m => m.author.id == message.author.id;
		let cancel = false;
		let AwaitFetch = await message.channel.awaitMessages(filter, { max: 1, time: 30_000, errors: ['time'] }).catch((x) => {});
		let Await = AwaitFetch.first().content || "x";

		if (Await != confirm) {
			cancel = true;
			return message.reply("Your request has been cancelled.");
		}
			
		if (cancel != true) {
			const x = new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${escapeMarkdown(message.author.tag)} (${message.author.id}) wants all of their data removed from Economist.`)
		client.users.cache.get(client.config.owner).send({
			embed: x
		});
		message.reply(`${message.author.tag} has successfully requested for the removal of all their data; the following message has been sent to ${client.users.cache.get(client.config.owner).tag}`)
		message.reply(x);
		};
	},
};