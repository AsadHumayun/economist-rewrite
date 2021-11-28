const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'upgrade',
	aliases: ['upgrade', 'improve', 'up', 'upgr'],
	description: `Upgrade one of your dragon's stat`,
	category: 'pet',
	cst: "dragon",
	async run(client, message, args) {
		let data = await client.db.get("pet" + message.author.id);
		if (!data) data = client.config.dpet;
		if (message.author.cst.includes("maxdragon888")) data = client.config.maxPet;
		data = data.split(';');
		let stat = (args[0] || "").toLowerCase();
		let Stat = client.config.upgr.find((x) => stat.startsWith(x.split(";")[0]));
		if (!Stat) return message.reply(`The different types of stats are: ${client.list(client.config.upgr.map((x) => x.split(";")[1]))}`);		
		Stat = Stat.split(";");
		const currAlias = await client.db.get("curralias" + message.author.id) || "default";
		let emojis;
		let display;
		if (currAlias) {
			const aliases = require('../petaliases.json');
			const names = Object.keys(aliases);
			if (names.includes(currAlias)) {
				display = aliases[currAlias].DISPLAY_NAME;
				selected = display;
				emojis = aliases[currAlias].EMOJIS;
			} else {
				display = "dragon";
				emojis = client.config.defaults.PET_EMOJIS;
			}
		}				
		let pn = await client.db.get(`petname${message.author.id}`) || display;
		display = pn;

		let amt = isNaN(args[1]) ? 1 : Number(args[1]);
		if (amt <= 0) amt = 1; 
		// level;health;energy;exp;credits;intel;endur;str;affec
		let credits = Number(data[4]);
		if (credits - amt < 0) return message.reply("You don't have enough credits for that!");
		data[4] = credits - amt; 
		data[Stat[2]] = Number(data[Stat[2]]) + amt;
		if (!message.author.cst.includes("maxdragon888")) await client.db.set("pet" + message.author.id, data.join(';'))
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has upgraded their ${display}'s ${Stat[1]} by ${amt} credits but lost ${emojis[3]} ${amt} in the process!`)
		});
	},
};