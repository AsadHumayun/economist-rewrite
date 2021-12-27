const { MessageEmbed, escapeMarkdown } = require("discord.js");
const delay = require('delay')

module.exports = {
	name: "sentence",
	aliases: ['sentence', 'sente'],
	cst: "judge",
	category: 'ecn',
	description: 'judge a user, stunning them in a range of 4-10 minutes.',
	async run(client, message, args) {
		let coold = await client.db.get(`sntc${message.author.id}`);
		if (coold) {
			let data = client.config.cooldown(message.createdTimestamp, coold*60_000);
			if (data) {
				return message.reply(`You should wait ${data} before imprisoning another user! Otherwise everyone would be in jail lol`)
			} else {

			}
		}
		async function dm(user, userColor, txt) {
			let embed = new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(txt)
			await client.users.cache.get(user.id)
				.send({ embed: new MessageEmbed(embed).setColor(userColor) })
					.catch(() => {return;});
			message.reply({ embed })
			await delay(1000);
		}
		if (!args.length) return message.reply("You need to ping someone to sentence, dum dum")
		let user = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!user) return message.reply("You need to ping someone to sentence, dum dum");
		await client.db.set("sntc" + message.author.id, client.config.parseCd(message.createdTimestamp, ms("6h")));
		let usercolor = await client.db.get('clr' + user.id) || client.config.defaultHexColor;
				usercolor = usercolor.split(";")[0];
		let didntWork = Math.floor(Math.random() * 100);

		let bal = await client.db.get("bal" + user.id) || 0;
			bal = Number(bal);
		let amtLost = bal / 5;
		if (bal - amtLost < 0) amtLost = bal;
		amtLost = Math.floor(amtLost);

		await dm(user, usercolor, `${message.author.tag} has summoned ${user.tag} in court`);
		await dm(user, usercolor, `It turns out ${user.tag} is a loser and ends up pissing on the floor, losing their dignity`);
		if (didntWork > 90) {
			await dm(user, usercolor, `${user.tag}'s lawyer was able to save ${user.tag}'s ass this time round!`)
			await dm(user, usercolor, `:skull_crossbones: ${message.author.tag} failed to sentence ${user.tag}`);
			return;
		} else {
		let stunTime = Math.floor(Math.random() * 10) + 1;
		if (stunTime < 4) stunTime = 4;
		stunTime *= 60_000;
				//		stn: function (id, amt, client) {
		await client.stn(user.id, stunTime/60_000, client);
		await client.db.set('stnb' + user.id, "in jail");
		await dm(user, usercolor, `After careful consideration, it is decided that ${user.tag} is punishable as a result of their insane ugliness; ${message.author.tag} has won the court case`)
		await dm(user, usercolor, `:dollar: ${client.config.comma(amtLost) || "0"} have been moved to ${message.author.tag}'s account since ${user.tag} was unable to win the court case lol`)
		await client.db.set("bal" + user.id, bal - amtLost)
		let oldBal = await client.db.get("bal" + message.author.id) || 0;
				oldBal = Number(oldBal);
		let newBal = (oldBal + amtLost);
		await client.db.set('bal' + message.author.id, newBal);
		await dm(user, usercolor, `${user.tag} has been put into jail for ${stunTime / 60_000} minutes`);
		};
	}
}