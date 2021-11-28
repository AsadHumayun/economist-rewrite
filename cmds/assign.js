const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "assign",
    aliases: [ 'assign' ],
    description: "Assigns access to your currently owned or co-owned dragon aliases",
    category: 'pet',
    async run(client, message, args) {
        if (args.length < 2) return message.reply({ content: "Please use the following format to assign users access: `" + message.guild.prefix + "assign <user> <dragon alias>`" })
        const user = await client.config.fetchUser(args[0]).catch(x => {});
        const kw = args[1];
        if (!user) return message.reply({ content: `Unknown user "${args[0]}"` });
        let upgr = await client.db.get("upgr" + message.author.id);
        if (!upgr || (upgr.split(";").length < 2)) return message.reply({ content: "You have no assignable upgrades." });
        upgr = client.config.listToMatrix(upgr.split(";"), 2);
        let keys = upgr.map((f) => f[0]);
        if (!keys.includes(kw)) return message.reply({ content: `Unknown upgr "${kw}", \`${message.guild.prefix}upgrs\` to view a list of assignable upgrades.` });
        let cst = await client.db.get("cst" + user.id);
            cst = cst ? cst.split(";") : [];
        let tupgr = upgr.find((f) => f[0] === kw);
        if (cst.includes(tupgr[1])) {
            cst = cst.filter((f) => ![tupgr[1]].includes(f));
            await client.db.set("cst" + user.id, cst.join(";"));
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${user.tag} has lost the ${kw} upgrade`)
            ]});
        } else {
            cst.push(tupgr[1]);
            await client.db.set("cst" + user.id, cst.join(";"));
            message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(message.author.color)
                    .setDescription(`${user.tag} has received the ${kw} upgrade`)
                ]
            });
        };
    },
};