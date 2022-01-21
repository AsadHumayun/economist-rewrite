"use strict";
import delay from "delay";

export default {
	name: "reload",
	aliases: ["r", "reload"],
	description: "Reloads a command",
	cst: "administrator132465798",
	usage: "reload <command name or alias>",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must specify a valid command name/alias in order for this command to work!");
		const commandName = args[0].toLowerCase();
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return message.reply(`A command by that name/alias was not found. Look in \`${message.guild ? message.guild.prefix : client.const.prefix}help\` for a list of existing commands`);
		// delete require.cache[require.resolve(`./${command.name}.js`)];
		client.emit("debug", `[CLIENT => CommandsCache] [Remove] ${command.name}.js`);
		// delaying ensures that the remove debug message is sent BEFORE the add debug message.
		await delay(100);
		try {
			const newCommand = await import(`./${command.name}.js`);
			client.commands.set(newCommand.name, newCommand);
			client.emit("debug", `[CLIENT => CommandsCache] [Add] ${command.name}.js`);
		}
		catch (error) {
			console.error(error);
			client.emit("debug", `[CLIENT => CommandsCache] [Error] ADD: ${command.name}.js\n${error}`);
			return message.reply(`${client.const.emoji.err} There was an error whilst attempting to reload the **${command.name}** command; \`${error.message}\``);
		}
		message.reply(`${client.const.emoji.tick} Command **${command.name}** was reloaded in ${Date.now() - 100 - message.createdTimestamp} ms`);
	},
};