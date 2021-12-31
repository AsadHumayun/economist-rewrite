const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addquote",
	aliases: ["addquote", "aq"],
	description: "Adds a quote to your collection of quotations!",
	category: "fun",
	cst: "qts",
	cstMessage: "Usage of this command requires special permissions!",
	async run(client, message, args) {
		const quote = args.join(" ").replace(/;+/gmi, "");
		if (!quote.length) return message.reply("You must enter a quotation to add in order for this command to work!");
		const qts = message.author.data.get("qts") ? message.author.data.get("qts").split(";") : [];
		qts.push(quote);
		await client.db.USERS.update({
			qts: qts.join(";"),
			pq: null,
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`Successfully added quotation "${args.join(" ")}"`),
			],
		});
	},
};