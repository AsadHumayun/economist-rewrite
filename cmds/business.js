const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "business",
	aliases: ["business"],
	category: 'ecn',	
	beta: true,
	description: "Shows you stats of your business",
	async run(client, message, args) {
		let user = await client.config.fetchUser(args[0] || message.author.id);
		if (!user) user = message.author;
		const busn = await client.db.get("busn" + user.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0"
		if (!busn) return message.reply("You don't own a business!\nContact Static to give you one (will become publically availible when it is fully released)");
		const name = await client.db.get("busn.name" + user.id) || "unnamed business"
		let busnData = await client.db.get("busn.data" + user.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0"
		busnData = busnData.split(";");
		let rev = busnData[0] || 0;
		let debt = busnData[1] || 0;
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setTitle(`${user.tag}'s Business [${name}]`)
			.setDescription(`\`${message.guild.prefix}sellb\` to sell your business`)
			.addField("Financial Data", `:dollar: Revenue - ${message.author.com == 1 ? rev : client.comma(rev)}\n:heavy_dollar_sign: Debt - ${message.author.com == 1 ? debt : client.comma(debt)}`)
		})
	}
}