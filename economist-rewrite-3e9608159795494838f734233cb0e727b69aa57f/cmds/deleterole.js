const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
	name: "deleterole",
	aliases: ["deleterole", "dr"],
	category: "own",
	description: "Remove a guild role",
	async run(client, message, args) {
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return message.reply("You must have the `MANAGE_ROLES` permission in order to use this command!");
		let role;
		try {
			role = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.get(message.mentions.roles.first().id);
		}
		catch (e) {
			return message.reply(`Unkown role "${args[0]}"`);
		}
		// if (!role)
		const rn = role.name;
		const id = role.id;
		await message.guild.roles.cache.get(role.id).delete()
			.then(() => {
				message.reply({
					embeds: [
						new MessageEmbed()
							.setColor(message.author.color)
							.setDescription(`Successfully removed the "${rn}"(${id}) role`),
					],
				});
			})
			.catch((f) => message.reply(`[RoleDeleteRequest: ${id} => Failed] [ERROR] \`${f}\``));
	},
};