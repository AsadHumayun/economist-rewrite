const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "defend",
    aliases: [ "protect", "defend" ],
    category: 'pet',
    description: "Toggle your dragon's protection — whether or not it will defend you when someone attempts to attack you.",
    async run(client, message, args) {
        let p = await client.db.get("pet" + message.author.id);
        if (!p) return message.reply("You must have a dragon in order for it to defend you! tame one by using `" + message.guild.prefix + "tame`")
        p = p.split(";");
        const currAlias = await client.db.get("curralias" + message.author.id) || "default";
        let emojis;
        let display;
        if (currAlias) {
            const aliases = require('../petaliases.json');
            const names = Object.keys(aliases);
            if (names.includes(currAlias)) {
                display = aliases[currAlias].DISPLAY_NAME;
                emojis = aliases[currAlias].EMOJIS;
            } else {
                display = "dragon";
                emojis = client.config.defaults.PET_EMOJIS;
            }
        }
		let pn = await client.db.get(`petname${message.author.id}`) || display;
        display = pn;
        let cst = await client.db.get("cst" + message.author.id) || "";
            cst = cst ? cst.split(";") : [];
        if (Number(p[1]) < 200) return message.reply("Your " + display + " must have at least " + emojis[0] + " 200 in order to defend you from attackers.");
        if (!cst.includes("dfnd")) {
            cst.push("dfnd");
            await client.db.set("cst" + message.author.id, cst.join(";"));
            message.reply({
                embed: new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${message.author.tag}'s ${message.author.cst.includes("maxdragon888") ? "entirely maxed out" : ""} ${display} will now defend them from attackers.`)
            })
        } else {
            cst = cst.filter((x) => !["dfnd"].includes(x));
            await client.db.set("cst" + message.author.id, cst.join(";"));            
            message.reply({
                embed: new MessageEmbed()
                .setColor(message.author.color)
                .setDescription(`${message.author.tag}'s ${message.author.cst.includes("maxdragon888") ? "entirely maxed out" : ""} ${display} will no longer defend them from attackers.`)
            })            
        }
    }
}