const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'downgrade',
	aliases: ['downgrade', 'decondition'],
	description: `downgrade one of your dragon's stat and receive one credit in return`,
	category: 'pet',
	cst: "dragon",
	async run(client, message, args) {
		const cd = await client.db.get('dgrc' + message.author['id']) || 0;
		let data = client.cooldown(message.createdTimestamp, cd*client.config.exp);
		if (data) {
			return message.reply(`You must wait another ${data} before downgrading another one of your dragon's stat!`);
		};
		data = await client.db.get("pet" + message.author.id);
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
		data[4] = Number(data[4]);
		data[4] = data[4] + 1;
		data[Stat[2]] = Number(data[Stat[2]]) - 1;
		if (data[Stat[2]] <= 1) return message.reply(`Each of your ${display}'s stats must have at least 1 point.`);
		if (!message.author.cst.includes("maxdragon888")) {
			await client.db.set("dgrc" + message.author.id, client.parseCd(message.createdTimestamp, ms("30m")));
			await client.db.set("pet" + message.author.id, data.join(';'));
		};
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag} has reduced their ${display}'s ${Stat[1]} and received ${emojis[3]} 1!`)
		}).catch((x) => {});
	},
};