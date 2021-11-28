const { MessageEmbed, escapeMarkdown } = require("discord.js");

module.exports = {
  name: "hugleaderboard",
  aliases: [ "hugleaderboard", "huglb" ],
  description: "Shows a list of people who get hugged the most",
  category: "fun",
  async run(client, message, args) {
    var hg =  await client.db.startsWith("hgs", { sort: ".data" })
      .catch((x) => console.log(x))
    let ids = [];
    const data = hg.map((d) => ids.push([ d.ID.slice(3), d.data ]));
    console.log(data)
    // [ "ID", "level" ]
    var counter = 1;
    Promise.all(
      ids.map(async(x) => {
        if (counter >= 5) return "";
        const user = await client.users.fetch(x[0]);
        return `#${counter++} — ${escapeMarkdown(user.tag)} — ${x[1]} hugs`
      })
    )
      .then((ar) => {
        if (ar.length < 5) {
          ar.push("No data", "No data", "No data", "No data", "No data", "No data")
        }
        return ar.slice(0, 5).join("\n")
      })
        .then((data) => {
          console.log(data)
          const embed = new MessageEmbed()
          .setColor(message.author.color)
          .setTitle('HUG LEADERBOARD')
          .setDescription("Here are the people who **get** hugged the most:\n\n" + data)
           message.reply(embed);      
        })
          .catch((err) => message.reply(`${client.config.statics.defaults.emoji.err} There was an error whilst executing this function: \`${err}\``))
  }
}