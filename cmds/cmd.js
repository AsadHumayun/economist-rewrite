const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'cmd',
	aliases: ['cmd', "command"],
	category: 'own',
	description: 'Revoke/grant permissions for a user to use a certain command',
	cst: "administrator132465798",
	async run(client,message,args){
		if(args.length < 2) return message.reply("You must specify a user and a command name/alias in order for this command to work!")
	let usr = await client.config.fetchUser(args[0]).catch((x) => {});
	if (!usr) return message.reply("You must mention someone for this command to work!");
	if (usr.id == client.owner) return message.reply(`${usr.tag} will keep all permissions regardless. You may not use this command on them!`);
	const command = client.commands.get(args[1].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[1].toLowerCase()));
	if (!command) return message.reply("A command with that name or alias was not found.");
	let bcmd = await client.db.get("bcmd" + usr.id);
			bcmd = bcmd ? bcmd.split(";") : []; 
	if (!bcmd.includes(command.name)) {
		bcmd.push(command.name)
		await client.db.set("bcmd" + usr.id, bcmd.join(";"));
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${usr.tag} has lost access to the ${command.name} command`)
		});
		} else {
			bcmd = bcmd.filter((x) => ![command.name].includes(x));
			await client.db.set("bcmd" + usr.id, bcmd.join(";"));
			message.reply({
				embed: new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${usr.tag} has gained access to the ${command.name} command`)
			})
		}
	}
};