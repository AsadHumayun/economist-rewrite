const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "weapon",
  aliases: ["weapon", "gun"],
  description: "<description is hidden coz yk>",
  beta: true,
  async run(client, message, args) {
    let user = await client.config.fetchUser(args[0]).catch(() => {return;});
    if (!user) user = message.author;
    let g = await client.db.get("wpn" + user.id) || "0;1;0;2-5;null;1;0;0;0";
    let data = client.wpnd(g);
    message.reply({
      embed: new MessageEmbed()
      .setColor(message.author.color)
      .setTitle(`${user.tag}'s Active Weapon [${g.split(";")[1]}]`)
      .setDescription(`
      \`${message.guild.prefix}weapon\` to view your Weapon
      
      :map: Type - ${data.type}
      :eyes: Tier - ${data.tier}
      :gun: Uses - ${data.used}/${data.tier.length*1000}
      :cyclone: Stun range - ${data.stunrange[0]} - ${data.stunrange[1]} mins
      :smirk: Stun Message - "You can't use any commands while you're ${data.stnv == "null" ? "stunned" : data.stnv}!"

      `)
      .addField("Weapon Stats",`
      :comet: Experience - ${data.xp}/${data.nextLevel}
      :hammer: Parts - ${data.parts} 
      :moyai: Durability - ${data.durability}
      ${client.config.emoji.target} Bloom - ${data.blm}
      `)
    })
  }
}