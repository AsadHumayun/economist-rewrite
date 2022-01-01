module.exports = {
	name: "say",
	aliases: ["say", "echo"],
	description: "Gets the bot to say your message",
	category: "fun",
	cst: "say",
	cstMessage: "This command is locked due to the possibility of abuse",
	async run(c, message, a) {
		if (!a.length) return message.reply("You must specify a message for me to say!");
		const msg = a.join(" ");
		message.delete();
		message.channel.send({ content: msg, allowedMentions: { parse: [] } });
	},
};