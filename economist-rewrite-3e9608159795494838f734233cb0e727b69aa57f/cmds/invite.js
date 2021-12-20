module.exports = {
	name: "invite",
	aliases: ["invite", "inv"],
	description: "View the bot's invite link to add it to other servers",
	category: "utl",
	async run(client, message) {
		message.channel.send(`You can invite me to your server by using the following link: <${client.config.inv}>`);
	},
};