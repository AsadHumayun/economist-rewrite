"use strict";
module.exports = {
	name: "reload",
	aliases: ["r", "reload"],
	description: "Reloads a command",
	category: "own",
	cst: "administrator132465798",
	usage: "reload <command name or alias>",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must specify a valid command name/alias in order for this command to work!");
		const commandName = args[0].toLowerCase();
		const command = client.config.commands.get(commandName)
			|| client.config.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return message.reply(`A command by that name/alias was not found. Look in \`${message.guild.prefix}help\` for a list of existing commands`);
		delete require.cache[require.resolve(`./${command.name}.js`)];
		client.emit("debug", `[CLIENT => CommandsCache] [Remove] ${command.name}.js`);
		// delaying ensures that the remove debug message is sent BEFORE the add debug message.
		await require("delay")(100);
		try {
			const newCommand = require(`./${command.name}.js`);
			client.config.commands.set(newCommand.name, newCommand);
			client.emit("debug", `[CLIENT => CommandsCache] [Add] ${command.name}.js`);
		}
		catch (error) {
			console.error(error);
			client.emit("debug", `[CLIENT => CommandsCache] [Error] ADD: ${command.name}.js\n${error}`);
			return message.reply(`${client.config.statics.defaults.emoji.err} There was an error whilst attempting to reload the **${command.name}** command; \`${error.message}\``);
		}
		message.reply(`${client.config.statics.defaults.emoji.tick} Command **${command.name}** was reloaded in ${Date.now() - 100 - message.createdTimestamp} ms`);
	},
};