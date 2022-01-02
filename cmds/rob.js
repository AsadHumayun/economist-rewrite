const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "rob",
	aliases: ["rob", "ripoff"],
	category: "ecn",
	description: "Rob a user, stealing X amount of the User's balance",
	usage: "rob <user>",
	async run(client, message, args) {
		const result = Math.floor(Math.random(1) * 10);
		const cooldown = message.author.data.get("rbc");
		const cd = client.config.cooldown(message.createdTimestamp, cooldown * 60_000);
		if (cd) {
			return message.reply(`You must wait another ${cd} before robbing someone again!`);
		}
		if (!args.length) return message.reply("You must mention a user in order for this command to work!");
		const usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) return message.reply("You must mention a user in order for this command to work!");
		if (message.author.id == usr.id) return message.reply("You can't rob yourself!");
		const data = await client.db.getUserData(usr.id);
		let bal = data.get("bal");
		if (bal < 1000) return message.reply("That user is too poor to be robbed! Have some humanity. Rob someone richer!");
		const cst = message.author.data.get("cst") ? message.author.data.get("cst").split("") : [];
		if (cst.includes("dnr")) {
			return message.reply("You can't rob them :c");
		}
		let authorBal = message.author.data.get("bal");
		if (authorBal < 1000) return message.reply("You must have at least :dollar: 1,000 in your account before robbing from someone!");
		await client.db.USERS.update({
			// 3 hour cooldown (10800000ms = 3h)
			rbc: client.config.parseCd(message.createdTimestamp, 10800000),
		}, {
			where: {
				id: message.author.id,
			},
		});
		// 25% chance the robber gets caught by the police :cry:
		if (result <= 7.5) {
			const stolen = Math.floor((bal * Math.random()) * 0.5);
			authorBal += stolen;
			bal -= stolen;
			await client.db.USERS.update({
				bal: authorBal,
			}, {
				where: {
					id: message.author.id,
				},
			});
			await client.db.USERS.update({
				bal,
			}, {
				where: {
					id: usr.id,
				},
			});
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} has stolen :dollar: ${client.config.comma(client.config.noExponents(stolen))} from ${usr.tag}!`),
				],
			});
			client.config.dm(usr.id, {
				embeds: [
					new MessageEmbed()
						.setColor(client.config.statics.defaults.colors.red)
						.setTitle("Uh Oh!")
						.setDescription(`${message.author.tag} has stolen :dollar: ${client.config.comma(client.config.noExponents(stolen))} from you!`),
				],
			});
		}
		else {
			// user got caught by the police!
			await client.config.stn({
				userId: message.author.id,
				minutes: 5,
				stnb: "arrested",
			});
			await client.db.USERS.update({
				bal: authorBal - 1000,
			}, {
				where: {
					id: message.author.id,
				},
			});
			message.reply({
				embeds: [
					new MessageEmbed()
						.setColor(message.author.color)
						.setDescription(`${message.author.tag} tried to rob ${usr.tag} but got caught and has been arrested for 5 minutes! They bribed the cops with :dollar: 1,000 to get out of jail.`),
				],
			});
		}
	},
};