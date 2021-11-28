const { Permissions } = require("discord.js");

module.exports = {
	name: "addemoji",
	aliases: ['addemoji', 'add-emoji'],
	description: "Adds an emoji in the current guild",
	async run(client, message, args) {
	if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) return message.reply({ content: "You must have the `MANAGE_EMOJIS_AND_STICKERS` permission in order to use this command!" });
    if (args.length < 2) return message.reply({ content: "You must provide a name and image URL for the new emoji under the format `" + message.guild.prefix + "addemoji <name> <URL>`" });
		const name = args[0];
		const URL = args[1];
		message.guild.emojis.create(URL, name)
			.then((emoji) => message.reply({ content: `${client.config.statics.defaults.emoji.tick} Successfully added ${emoji} under the name \`${emoji.name}\`` }))
				.catch((error) => message.reply({ content: `There was an error whilst adding the emoji under your given args: ${error}`, allowedMentions: { repliedUser: false }}))
	},
};