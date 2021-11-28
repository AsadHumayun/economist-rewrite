const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "unpunish",
  aliases: ["unpunish", "unpnsh"],
  description: "Remove a user's offence",
  category: "mod",
  cst: "tmod",
  async run(client, message, args) {
    if (args.length < 2) return message.reply("Correct usage: `" + message.guild.prefix + "unpunish <user> <offence index>`; requires mod")
    let user = await client.config.fetchUser(args[0]).catch((x) => {});
    if (!user) return message.reply(`"${args[0]}" isn't a valid user??`);
    let ofncs = await client.db.get("ofncs" + user.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0";
        ofncs = ofncs.split(";");
    for (x in ofncs) {
      ofncs[x] = Number(ofncs[x])
    };
    const index = Number(args[1]);
    if (!Object.values(client.config.ofncs)[index - 1]) {
      return message.reply(`Index ${index} out of bounds for length ${Object.keys(client.config.ofncs).length}`)
  };

 //   if (typeof ofncs[index - 1] != "number") return message.reply(`Index ${index} out of bounds for length ${ofncs.length}`)
    ofncs[index - 1] = ofncs[index - 1] - 1;
    await client.db.set("ofncs" + user.id, ofncs.join(";"));
    message.reply(`Successfully updated ofncs${user.id} (indx. ${index - 1}) from ${ofncs[index - 1] + 1} to ${ofncs[index - 1]}`)
    const level = Object.values(client.config.ofncs)[index - 1][1];
    const mem = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(user.id)        
    if (!mem) return;
    async function unmute() {
      if (!mem.roles.cache.has(client.config.roles.muted)) return;
      mem.roles.remove(client.config.roles.muted)
        .catch((x) => {});
      message.reply({
        embed: new MessageEmbed()
        .setColor(message.author.color)
        .setDescription(`${user.tag}'s mute has been removed because of "User unpunished"; they were sent the following message:`)
      });
      const e = new MessageEmbed()
      .setColor(client.config.statics.defaults.colors.green)
      .setDescription("You have been unmuted. Yay!")
      .addField("Moderator", message.author.tag)
      .addField("Reason", "User unpunished by a Moderator.")
      message.reply(e)
      user.send({
        embed: e
      }).catch((x) => {});
    }
    if (level == 1 && (ofncs[index - 1] < 2)) {
      await unmute();
    } else if (level == 2) {
      await unmute();
    } else if (level == 3) {
      await unmute();
    };
  },
};