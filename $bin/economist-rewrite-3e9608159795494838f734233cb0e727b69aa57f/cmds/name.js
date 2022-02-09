module.exports = {
	name: "name",
	aliases: ["name", "dragonname", "namedragon", "dragon-name", "name-dragon", "petname"],
	description: "Name your dragon.",
	cst: "supreme",
	category: "pet",
	async run(client, message, args) {
		if (!args.length) return message.reply("You must specify a new name for your dragon in order for this command to work!");
		const newName = args.join(" ");
		if (newName.length > 128) return message.reply("Your dragon's name may not exceed 128 characters in length.");
		await client.db.set("petname" + message.author.id, newName.toString());
		message.reply({ content: `Successfully set petname ${message.author.id} as ${newName}`, allowedMentions: { parse: [] } });
	},
};