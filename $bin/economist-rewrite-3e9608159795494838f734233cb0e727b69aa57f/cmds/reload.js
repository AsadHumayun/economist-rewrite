module.exports = {
	name: 'reload',
	aliases: ['r', 'reload'],
	description: 'Reloads a command',
	category: 'own',
	cst: "administrator132465798",
	usage: 'reload <command name or alias>',
	async run(client, message, args) {
		const msg = await message.reply(`Validating input & performing actions...`);
		if (!args.length) return msg.edit(`${client.config.statics.defaults.emoji.err} You must specify a command to reload!`);
		const commandName = args[0].toLowerCase();
		const command = message.client.config.commands.get(commandName)
			|| message.client.config.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return msg.edit(`${client.config.statics.defaults.emoji.err} Command not found :c`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.config.commands.set(newCommand.name, newCommand);
		} catch (error) {
			console.log(error);
			return msg.edit(`${client.config.statics.defaults.emoji.err} There was an error whilst attempting to reload the **${command.name}** command; \`${error.message}\``);
		}
		msg.edit(`${client.config.statics.defaults.emoji.tick} Command **${command.name}** was reloaded (in ${Date.now() - message.createdAt} MS)`)
	},
};