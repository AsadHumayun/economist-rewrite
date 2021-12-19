const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addcredits",
	aliases: [ "addcredits", "addcred" ],
	description: "Adds pet credits to a certain user",
	category: "own",
	cst: "addcredits",
	async run(client, message, args) {
		if (args.length < 2) return message.reply("Desired usage for this command is: `" + message.guild.prefix + "addcredits <user> [amount]`");
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("Unknown user");
		const credits = isNaN(args[1]) ? 1 : Number(args[1]);
		const data = await client.db.getUserData(user.id);
		const ucst = data.get("cst").split(";").includes("dragon");
		if (!ucst) return message.reply("That person doesn't have a dragon!");
		const pet = data.get("pet").split(";");
		if (pet.length < client.config.statics.intendedPetLength) return message.reply("Malformed pet - does not have at least " + client.config.statocs.intendedPetLength + " elements.");
		data[4] = Number(data[4]) + credits;
		await client.db.USERS.update({
			pet: pet.join(";"),
		}, {
			where: {
				id: message.author.id,
			},
		});
		const creditsEmoji = await client.config.getDragonAlias(user.id, client)[1][3];
		message.reply({ embeds: [
			new MessageEmbed()
				.setColor(message.author.color)
				.setDescription(`${user.tag} has received ${creditsEmoji} ${credits}`),
		] });
	},
};