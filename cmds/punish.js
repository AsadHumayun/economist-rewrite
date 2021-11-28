const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "punish",
    aliases: [ 'punish', 'pnsh' ],
    description: "Punish a user for violating a specific rule; bot will automatically upgrade the intensity of the punishment based off of current offences in relation to that violation.",
    category: "mod",
    cst: "tmod",
    async run(client, message, args) {
        if (args.length < 2) return message.reply("Usage: `" + message.guild.prefix + "punish <user> <punishment index> <reason>`; requires moderator.")
        let user = await client.config.fetchUser(args[0]).catch((x) => {});
        if (!user) return message.reply(`Unrecognised user "${args[0]}"`);
        if (isNaN(args[1])) return message.reply("Your supplied index must be a valid number.")
        const index = Number(args[1]);
        let ofncs = await client.db.get("ofncs" + user.id) || `0;0;0;0;0;0;0;0;0;0;0;0;0;0`;
            ofncs = ofncs.split(';');
        for (x in ofncs) {
            ofncs[x] = Number(ofncs[x]);
        };    
        if (!Object.values(client.config.ofncs)[index - 1]) {
            return message.reply(`Index ${index} out of bounds for length ${Object.keys(client.config.ofncs).length}`)
        };
            message.reply({
                embed: new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${user.tag} has been punished for "${Object.values(client.config.ofncs)[index - 1][0]}"; they were sent the following message:`)
            });
            const mem = await client.guilds.cache.get(client.config.statics.supportServer).members.fetch(user.id)    
            let level = Object.values(client.config.ofncs)[index - 1][1]
            async function muted(hrs) {
                await client.db.set("mt" + user.id, `${(message.createdTimestamp + ms(`${hrs}h`)) - client.config.epoch};${Object.values(client.config.ofncs)[index - 1][0]}`);
                message.reply({
                    embed: new MessageEmbed()
                    .setColor(client.config.colors.red)
                    .setDescription(`You have received a ${hrs} hour mute from ${message.guild.name}. You may leave and re-join the server after said time has passed to have your mute auto-removed. If you believe this was an unjust punishment, please PM ${client.users.cache.get(client.config.owner).tag} (don't spam though).`)
                    .addField("Moderator", `${message.author.tag}`, true)
                    .addField("Reason", Object.values(client.config.ofncs)[index - 1][0])
                })
                client.users.cache.get(user.id).send({
                    embed: new MessageEmbed()
                    .setColor(client.config.colors.red)
                    .setDescription(`You have received a ${hrs} hour mute from ${message.guild.name}. You may leave and re-join the server after said time has passed to have your mute auto-removed. If you believe this was an unjust punishment, please PM ${client.users.cache.get(client.config.owner).tag} (don't spam though).`)
                    .addField("Moderator", `${message.author.tag}`, true)
                    .addField("Reason", Object.values(client.config.ofncs)[index - 1][0])
                })
                    .catch((x) => {});
                
            }
            function warn() {
                const em = new MessageEmbed()
                .setColor(client.config.colors.red)
                .setDescription(`You have received a warning from ${message.guild.name}. If you believe this was an unjust punishment, please PM ${client.users.cache.get(client.config.owner).tag} (don't spam though).`)
                .addField("Moderator", `${message.author.tag}`, true)
                .addField("Reason", Object.values(client.config.ofncs)[index - 1][0])
                message.reply(em)
                client.users.cache.get(user.id).send(em)
                    .catch((x) => {});
            }
            if (level == 1) {
                //spam
                //2 warnings; then 1h mutes
                if (ofncs[index - 1] > 2) {
                    mem.roles.add(client.config.roles.muted);
                    muted("1");
                } else {
                    warn();
                }
            } else if (level == 2) {
                //lvl 2; first 2 1h mutes then 3h mutes
                if (ofncs[index - 1] >= 2) {
                    mem.roles.add(client.config.roles.muted);
                    muted("3");
                } else {
                    mem.roles.add(client.config.roles.muted);
                    muted("1");    
                }
            } else if (level == 3) {
                //6h mutes then permed
                if (ofncs[index - 1] <= 3) {
                    mem.roles.add(client.config.roles.muted);
                    muted("6");
                } else {
                    mem.roles.add(client.config.roles.muted);
                    muted("10000000000000000");      
                };
            } else if (level == 4) {
                mem.roles.add(client.config.roles.muted)
                await muted("100000000000000000")
            }
            ofncs[index - 1] = Number(ofncs[index - 1]) + 1;
            ofncs = ofncs.join(';');
            await client.db.set('ofncs' + user.id, ofncs);    
    },
};