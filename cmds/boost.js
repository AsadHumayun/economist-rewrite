const { MessageEmbed } = require("discord.js");
const delay = require("delay");

module.exports = {
  name: "boost",
  aliases: [ "boost" ],
  cst: "administrator132465798",
  async run(client, message, args) {
    function ln() {
      return client.comma(Math.floor(Math.random()*1000000000000)) + " minutes";
    };
    if (!args.length) return message.reply("You must mention a user to permstun!");
    const user = await client.config.fetchUser(args[0]).catch((err) => {});
    if (!user) return message.reply("You have not mentioned a user!!");
    let cst = await client.db.get("cst" + user.id);
        cst = cst ? cst.split(";") : [];
    cst.push("pstn");
    await client.db.set("cst" + user.id, cst.join(";"));
    await client.db.set("stnb" + user.id, "dead");
   message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${message.author.tag} has kicked ${user.tag}'s ass and sent them flying high into the stratosphere`)
    });
    await delay(1500)
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has gotten hyperthermia and gone unconscious for ${ln()}`)
    });
    await delay(1500)
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has suffocated due to hypoxia and fallen into a coma for ${ln()}`)
    });
    await delay(1500)
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has come plunging down to Earth whilst falling at terminal velocity`)
    });
    await delay(1500)
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag} has died for ∞ minutes due to the injuries sustained`)
    });
  },
};
