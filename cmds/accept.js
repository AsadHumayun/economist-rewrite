const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "accept",
  aliases: ["accept"],
  description: "Accept someone's staff app",
  cst: "srmod",
  ssOnly: true,
  async run(client, message, args) {
  if (!message.member.roles.cache.has(client.config.statics.defaults.roles.srmod)) return message.reply({ content: "You must be a **Senior Moderator** in order to accept/decline users' applications." });
  let user = await client.config.fetchUser(args[0]).catch(() => {return;});
  if (!user) return message.reply({ content: "You must mention a user whose application you wish to accept!" });
  let cst = await client.db.get("cst" + user.id) || "";
      cst = cst.split(";");
  if (!cst.includes("sbmt")) return message.reply({ content: "That user hasn't submitted their staff application yet!" });
  let ch = message.guild.channels.cache.find((x) => (x.topic || "").toLowerCase().split(";").includes(user.id));
  if (!ch) return message.reply({ content: "That user has not applied for staff." });
  client.channels.cache.get(client.config.statics.defaults.channels.appNotifs)
    .send({ content: `Application ${ch} submitted by ${user.tag} (${user.id}) has been **accepted** by ${message.author.tag} (${message.author.id})` });
    let em = new MessageEmbed()
    .setColor(client.config.statics.defaults.colors.green)
    .setDescription("Congratulations, your Staff Application has been accepted! Welcome to the team.")
    .addField("Senior Moderator", message.author.tag)
    message.reply({ embeds: [
    new MessageEmbed()
    .setColor(message.author.color)
    .setDescription(`${user.tag}'s Staff Application has been accepted by ${message.author.tag}; they have been sent the following message:`)
  ]});
  message.reply({ embeds: [em] });
  user.send({ embeds: [em] });
  message.guild.member(user.id).roles.add(client.config.statics.defaults.roles.mod.trial);
  }
};