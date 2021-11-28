const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "dragonalias",
    aliases: ["dragonalias"],
    category: 'pet',
    cst: "dragon",
    description: "Choose a dragon alias to be displayed on your dragon!",
    async run(client, message, args) {
        let aliases = await client.db.get("petaliases" + message.author.id) || "default";
   /*     if (aliases == "default") {
            return message.reply("You do not have permission to access any dragon aliases.");
        };
        */
            if (!args.length || (isNaN(args[0]))) {
        //    if (aliases == "default") return message.reply("You do not have access to any dragon aliases.")
            let list = aliases.split(";");
            if (!list.includes("default")) list.push("default");
            const prompt = `\`\`\`\n{\n${list.map((x) => `    "${list.indexOf(x)}": "${x}"`).join(',\n')}\n}\`\`\``;
            return message.reply({
              embed: new MessageEmbed()    
              .setColor(message.author.color)
              .setTitle(`${message.author.tag}'s Dragon Aliases`)
              .setDescription("These can be created by messaging `" + client.users.cache.get(client.config.owner).tag + "`. To create, they cost £10 each.\n`" + message.guild.prefix + "dragonalias <id>` in order to select an alias to display." + prompt)
            })
        };
        let list = aliases.split(";");
        if (!list.includes("default")) list.push("default");
        const index = Number(args[0]);
        const petalias = list[index];
        if (!petalias) {
            return message.reply(`Invalid Index "${index}"`)
        } else {
            await client.db.set("curralias" + message.author.id, petalias)
            await client.db.set("petname" + message.author.id, client.capital(petalias))
            message.reply({
                embed: new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`Successfully chosen "${petalias}" as preferred dragon alias`)
            })
        }
    }
}