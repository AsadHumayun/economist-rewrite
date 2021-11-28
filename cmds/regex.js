const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'regex',
	aliases: ['regex', 'regexp'],
	nerd: true,
	description: 'utilise regexp on a specified test `String`',
	category: 'nrd',
	async run(client, message, args) {
		let msg = await message.reply("Testing RegEx...")
		let regex = new RegExp(args[0]);
		let str = args.slice(1).join(' ');
		let res = regex.test(str || null);

		let output = new MessageEmbed()
		.setColor(message.author.color)
		.setTitle("The Regular Expression Machine")
		.addField("Regex Used", `\`${regex}\``, true)
		.addField("Test String", str, true)
		.addField("Result", "```js\n" + res + "\n```")
		.setTimestamp()

		msg.edit("", { embed: output });
	},
}