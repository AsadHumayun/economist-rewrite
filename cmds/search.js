const { MessageEmbed } = require("discord.js");
const delay = require("delay");
const ms = require("ms");

module.exports = {
	name: "search",
	aliases: ["search", "srch"],
	description: "Lets your dragon go out in search of things...",
	category: 'pet',
	cst: "dragon",
	async run(client, message, args) {
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
		let pet = await client.db.get("pet" + message.author.id);
		if (!pet) return message.reply("You must have a dragon in order to use this command.");
				"level;health;energy;exp;credits;intel;endur;str;affec"
  	async function upgradePet() {
			let data = await client.db.get(`pet${message.author.id}`);
			data = data.split(';')
			lvl = Number(data[0])

		let cred = Number(data[4]);
		if (isNaN(cred)) cred = 0;
		data[4] = Number(cred + 1);
		data[0] = lvl + 1;
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${display} has attained level ${data[0]} and gained ${emojis[3]} 1`)
		});
		await client.db.set("pet" + message.author.id, data.join(';'))
	};
	let cd = await client.db.get("srchc" + message.author.id);
	let scnd = client.cooldown(message.createdTimestamp, cd*client.config.exp);
	if (scnd) {
		return message.reply(`Please wait another ${scnd} before searching again!`);
	};
	let data = await client.db.get("pet" + message.author.id);
			data = data.split(";");
			console.log(message.author.cst)
	if (message.author.cst.includes("maxdragon888")) data = client.config.maxPet.split(";");
	if (!data && (!message.author.cst.includes("maxdragon888"))) return message.reply("You must own a dragon in order to use this command! See `" + message.guild.prefix + "shop` for more information")
	if (!data) data = client.config.dpet;
		let en = Number(data[2]);
		let endur = Number(data[6]);
		let lvl = Number(data[0]);
		let xp = Number(data[3]);
		let str = Number(data[7]);
		let intel = Number(data[5]);
		let consumed = Math.round((60 / (Math.log(endur + 9))));
		if (en - consumed < 0) {
			return message.reply("🥱 I'm too tired to go searching right now! Why not feed me by using `" + message.guild.prefix + "feed`?")
		};
		//parseFloat(((message.createdTimestamp + ms("20s"))/client.config.exp)).toFixed(2)
		await client.db.set("srchc" + message.author.id, client.parseCd(message.createdTimestamp, ms("20s"), true));		
		let f = await client.db.get("fsh" + message.author.id) || "0;0;0;0;0;0";
				f = f.split(";");
		const fishes = [':dolphin:',':shark:',':blowfish:',':tropical_fish:',':fish:'];		
		const Fish = Math.floor(Math.random() * fishes.length);
		const fish = fishes[Fish];
		const amtGained = Math.floor(Math.random() * 250 / 5) * str;
		f[Fish] = Number(f[Fish]) || 0;
		f[Fish] = f[Fish] + amtGained;
		let xpGained = Math.floor(intel * 2 * 50 * 0.5) * lvl;
		let pn = await client.db.get(`petname${message.author.id}`) || display;
		display = pn;
		data[2] = en - consumed;
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${display} elevates its wings in preparation to fly, consuming ${emojis[1]} ${consumed}`)
		})
		await delay(1500)
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${display} has discovered a lake and perched by it`)
		})		
		await delay(1500)
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${display} has found out that ${fish} ${client.config.noExponents(amtGained)} are dwelling in the lake`)
		});
		await delay(1500)
		await client.db.set("fsh" + message.author.id, f.join(";"))
		message.reply({
			embed: new MessageEmbed()
			.setColor(message.author.color)
			.setDescription(`${message.author.tag}'s ${display} instantaneously lets out a mighty roar, <a:ecn_fire:804378228336361476> searing ${fish} ${client.config.noExponents(amtGained)} and obtained ${emojis[2]} ${client.config.noExponents(xpGained) || "0"} in the process`)
		});
		data[3] = xp + xpGained;
		if (!message.author.cst.includes("maxdragon888")) {
			await client.db.set(`pet` + message.author.id, data.join(";"));
			xp = data[3];
			let levelups = 0;
			let loops = 0;
			
			if (lvl >= 50) return;
			client.config.reqs.forEach((req) => {
				if (xp - req <= 0) {
					levelups = loops + 1 - lvl;
				} else {
					loops += 1;
				}
			});
			for (i = 0; i < levelups; i++) {
				await upgradePet();
			};
		};
	},
};