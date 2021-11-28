const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'offences',
    aliases: [ 'offences', 'offenses', 'ofncs' ],
    description: "View a user's offences (mod only)",
    category: 'mod',
    async run(client, message, args) {
        let user = await client.config.fetchUser(args[0]).catch((x) => {});
        if (!user) user = message.author;
        let ofncs = await client.db.get("ofncs" + user.id) || "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0";
        ofncs = ofncs.split(";");
        for (x in ofncs) {
            ofncs[x] = Number(ofncs[x])
        }
        if (user.bot) {
            ofncs = [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ]
        }
        if (message.content.toLowerCase().endsWith("-r")) {
            return message.reply(
                "[" + ofncs.map(x => x).join(", ") + "]",
            { code: "" })
           // return message.reply(client.inspect(ofncs).replace(/\n/g, " "), { code: "" })
        }
        message.reply({
            embed: new MessageEmbed()
            .setColor(message.author.color)
            .setTitle(`${user.tag}'s Offences [${ofncs.reduce((a, b) => a + b, 0)}]`)
            .setDescription(
                `
                \`${message.guild.prefix}punish <user> <offence>\` to punish a user for an offence;
                \`${message.guild.prefix}unpunish <user> <offence>\` to unpunish a user for an offence.
                
                [1] Spam - ${ofncs[0]}\n[2] Excessive Mentions - ${ofncs[1]}\n[3] Begging - ${ofncs[2]}\n[4] Impersonating Staff - ${ofncs[3]}\n[5] Discrimination - ${ofncs[4]}\n[6] Advertising - ${ofncs[5]}\n[7] NSFW - ${ofncs[6]}\n[8] Threats - ${ofncs[7]}\n[9] Joking about Mental Illnesses (or any other disability) - ${ofncs[8]}\n[10] Disrespecting Privacy - ${ofncs[9]}\n[11] Exploiting Glitches - ${ofncs[10]}\n[12] Bypassing Punishments w/ Alts - ${ofncs[11]}\n[13] Evading punishments - ${ofncs[12]}\n[14] Excessively Rude - ${ofncs[13]}`
            )
        })
    }
}