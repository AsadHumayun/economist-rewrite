const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "hug",
  aliases: [ "hug" ],
  description: "Hug someone (only works in the support server)",
  category: "fun",
  async run(client, message, args) {
    const m = "You must mention somebody to hug!";
 //   if (!args.length) return message.reply(m);
    let cst = await client.db.get("cst" + message.author.id) || "";
        cst = cst.split(";");
    if (message.guild.id != client.config.statics.supportServer && (!cst.includes("hug"))) {
      return;
    } else if (message.guild.id == client.config.statics.supportServer || (cst.includes("hug"))) {
      const user = await client.config.fetchUser(args[0]).catch((x) => {});
      if (!user) return message.reply(m);
      let hgs = await client.db.get("hgs" + user.id) || "0";
          hgs = Number(hgs);
      hgs += 1;
      await client.db.set("hgs" + user.id, hgs)
      message.reply({
        embed: new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`:people_hugging: ${message.author.tag} has hugged ${user.tag}`)
      })
    };
  },
};