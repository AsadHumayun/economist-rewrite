const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "decline",
  aliases: ["decline"],
  description: "decline someone's staff app",
  cst: "srmod",
  async run(client, message, args) {
		if (message.guild.id != client.config.statics.supportServer) {
      return message.reply("this command only works in our support server! Join by using `" + message.guild.prefix + "hub`");
  };    
  if (!message.member.roles.cache.has(client.config.statics.defaults.roles.srmod)) return message.reply("You must be a **Senior Moderator** in order to decline users' apps."); 
  let user = await client.config.fetchUser(args[0]).catch((x) => {});
  if (!user) return message.reply("You must mention a user whose application you wish to decline!");
    let cst = await client.db.get("cst" + user.id) || "";
        cst = cst.split(";");
    if (!cst.includes("sbmt")) return message.reply("That user hasn't submitted their staff application yet!");
    let ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(user.id));
    if (!ch) return message.reply("That user has not applied for staff.");
    client.channels.cache.get(client.config.channels.appNotifs)
      .send(`Application ${ch} submitted by ${user.tag} (${user.id}) has been **declined** by ${message.author.tag} (${message.author.id})`)
      let em = new MessageEmbed()
      .setColor(client.config.colors.red)
      .setDescription(`Sorry, but your Staff Application has been declined.`)
      .addField("Senior Moderator", message.author.tag)
      .addField("Reason", args.slice(1).join(" ") || "Please contact me for your reason.");
      message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setDescription(`${user.tag}'s Staff Application has been declined by ${message.author.tag}; they have been sent the following message:`)
    });
    message.reply({ embed: em });
    user.send({ embed: em });
  }
};