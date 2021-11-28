const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'cstmrl',
	category: 'utl',	
	aliases: ['cstmrl', 'cstmrls', 'roles', "cgrl"],
	description: 'Lists all of your assignable roles along with their keywords and names',
	async run(client, message, args = []) {
		if (message.guild.id != client.config.statics.supportServer) return message.reply("This command only works in Economist's support server ;-; why not join it though? " + client.config.ssInvite);
		if (!args.length) args[0] = message.author.id;
		let usr = await client.config.fetchUser(args[0]).catch((x) => {});
		if (!usr) usr = message.author; 
		let roles = await client.db.get('cgrl' + message.author.id);
		if (!roles) return message.reply(`${client.config.statics.defaults.emoji.err} You do not own any custom roles.`);
		roles = client.config.listToMatrix(roles.split(";"), 2);
		let resp = roles.map((x) => `    "${x[0]}": "${message.guild.roles.cache.get(x[1]) ? message.guild.roles.cache.get(x[1]).name : "<UNKNOWN ROLE>"}"`).join(',\n');
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${usr.tag}'s Custom Roles (${roles.length} currently owned)`)
			.setDescription(`You may assign roles displayed here to users in the support server\n\`${message.guild.prefix}role <role> <user>\` to add/remove a role from a user (support server only)\n\`${message.guild.prefix}rolecolor <role> <color>\` to edit a role's colour\n\`${message.guild.prefix}rolename <role> <new name>\` to edit a role's name\`\`\`\n{\n${resp || "[ NONE lol ]"}\n}\n\`\`\``)
		})
	}
}