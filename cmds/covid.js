const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "covid",
	aliases: ["covid", "corona"],
	description: "Infect someone with COVID-19!",
	category: "fun",
	async run(client, message, args) {
		let cst = await client.db.get("cst" + message.author.id) || "";
		cst = cst.split(";");
		if (!cst.includes("covid")) return message.reply("You're not allowed to use this command! You can unlock it by getting infected with COVID-19!");
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("You must mention somebody to infect!");
		let cst0 = await client.db.get("cst" + user.id);
		cst0 = cst0 ? cst0.split(";") : [];
		if (cst0.includes("covid")) return message.reply("That user is already infected with COVID-19!");
		if (cst0.includes("vcn") || (user.bot)) {
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`Oh my, it seems that ${user.tag} is vaccinated!`),
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${user.tag}'s body recognises COVID-19's antigens, and has destroyed them.`),
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${user.tag} remains unshackled by COVID-19!`),
				],
			});
		}
		else {
			cst0.push("covid");
			await client.db.set("cst" + user.id, cst0.join(";"));
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has coughed all over ${user.tag}, and infected them with COVID-19!`),
				],
			});
		}
	},
};