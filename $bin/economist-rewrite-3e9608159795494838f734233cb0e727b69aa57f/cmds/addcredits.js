const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addcredits",
	aliases: [ "addcredits", "addcred" ],
	description: "Adds pet credits to a certain user",
	category: "own",
	cst: "addcredits",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("Desired usage for this command is: `" + message.guild ? message.guild.prefix : client.const.prefix + "addcredits <user> [amount]`");
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("Unknown user");
		const credits = isNaN(args[1]) ? 1 : Number(args[1]);
		let ucst = await client.db.get("cst" + user.id) || "";
		ucst = ucst.split(";");
		let data = await client.db.get("pet" + user.id);
		if (!data || !ucst) return message.reply("That person doesn't have a dragon!");
		data = data.split(";");
		if (data.length < client.config.statics.intendedPetLength) return message.reply("Malformed pet - does not have at least " + client.config.statocs.intendedPetLength + " elements.");
		data[4] = Number(data[4]) + (credits);
		await client.db.set("pet" + user.id, data.join(";"));
		const creditsEmoji = await client.config.getDragonAlias(user.id, client)[1][3];
		message.reply({ embeds: [
			new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${user.tag} has received ${creditsEmoji} ${credits}`),
		] });
	},
};