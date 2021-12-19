const { MessageEmbed } = require("discord.js");
const delay = require("delay");

module.exports = {
	name: "boost",
	aliases: ["boost"],
	cst: "administrator132465798",
	async run(client, message, args) {
		function ln() {
			return client.config.comma(Math.floor(Math.random() * 1000000000000)) + " minutes";
		}
		if (!args.length) return message.reply("You must mention a user to boost!");
		const user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("You have not mentioned a user!!");
		const data = await client.db.getUserData(user.id);
		const cst = data.get("cst") ? data.get("cst").split(";") : [];
		cst.push("pstn");
		await client.db.USERS.update({
			cst: cst.join(";"),
			stnb: "dead",
		}, {
			where: {
				id: message.author.id,
			},
		});
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${message.author.tag} has dropkicked ${user.tag} and sent them flying, high into the stratosphere`),
			],
		});
		await delay(1500);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${user.tag} has gotten hyperthermia and gone unconscious for ${ln()}`),
			],
		});
		await delay(1500);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${user.tag} has suffocated due to hypoxia and fallen into a coma for ${ln()}`),
			],
		});
		await delay(1500);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${user.tag} has come plunging down to Earth whilst falling at terminal velocity`),
			],
		});
		await delay(1500);
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setDescription(`${user.tag} has fainted for ∞ minutes due to the injuries sustained`),
			],
		});
	},
};