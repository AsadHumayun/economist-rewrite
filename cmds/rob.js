const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'rob',
  aliases: ['rob', 'ripoff'],
  category: 'ecn',
  description: 'Rob a user, stealing X amount of the User\'s balance',
  usage: 'rob <user>',
  async run(client, message, args) {
    const result = Math.floor(Math.random(1) * 10);
    let cooldown = await client.db.get('robc' + message.author.id);
		const data = client.cooldown(message.createdTimestamp, cooldown*client.config.exp);
		if (data) {
			return message.reply(`You must wait another ${data} before robbing someone again!`);
		} else {

    };

    function notEnough() {
      return message.reply("They don't have enough :dollar: in balance for you to rob!")
    }
    if (!args.length) return message.reply("You must specify a user who yo wish to rob!")
    let usr = await client.config.fetchUser(args[0]).catch((x) => {});
    if (!usr) return message.reply("Whoops! I can't find that user");
    if (message.author.id == usr.id) return message.reply(`You can't rob yourself!`);
    let cst = await client.db.get("cst" + usr.id) || "";
        cst = cst.split(";");
    if (cst.includes("dnr")) {
      return message.reply("You can't rob that guy, sorreh");
    }
    if (result > 8) {
    let authorBal = await client.db.get('bal' + usr.id) || 0;
    authorBal = Number(authorBal)
    let amt = authorBal - Math.floor(Math.random() * authorBal);
    amt = Number(Math.trunc(amt / 5))
    const amountLeft = Number(Number(authorBal) - Number(amt));
    if (amountLeft < 0) return notEnough();
    await client.db.set('bal' + usr.id, amountLeft);
    let oldBal = await client.db.get('bal' + message.author.id) || 0;
    oldBal = Number(oldBal)
    const newBal = Number(oldBal + amt);
    await client.db.set('bal' + message.author.id, newBal)
    message.reply({
      embed: new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${message.author.tag} has robbed :dollar: ${message.author.com == 1 ? amt : client.comma(amt)} (${amt.toString().length} digits) from ${usr.tag}'s account`)
    })
    usr.send({
      embed: new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${message.author.tag} has robbed :dollar: ${message.author.com == 1 ? amt : client.comma(amt)} (${amt.toString().length} digits) from ${usr.tag}'s account`)
    }).catch((x) => console.log(x));
  } else {
				//		stn: function (id, amt, client) {
    await client.stn(message.author.id, 5, client);
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${message.author.tag} tried to rob ${usr.tag} but got caught and has been arrested for 5 minutes!`)
    });
    await client.db.set("stnb" + message.author.id, "arrested");
    };
    await client.db.set(`robc${message.author.id}`, client.parseCd(message.createdTimestamp, ms("3h")));
  },
};