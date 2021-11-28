const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'dragon',
	aliases: ['dragon', 'd'],
	category: 'pet',
	description: "View your dragon's stats",
	cst: "dragon",
	async run(client, message, args) {
		async function Embed(id, tag, bot = false) {
			let data = await client.db.get('pet' + id);
			let cst = await client.db.get("cst" + id) || "";
			if (cst.includes("dragon") && (!data)) {
				await client.db.set("pet" + id, client.config.dpet);
				data = client.config.dpet;
			};
			if (!cst.includes("dragon") || (!data)) {
				return message.reply(`${message.author.id == id ? `You don't own a dragon!` : `${tag} does not own a dragon!`} Why not tame one by using \`${message.guild.prefix}tame\``)
			};
			if (bot == true || (cst.includes("maxdragon888"))) {
				data = client.config.maxPet;
			};
			const currAlias = await client.db.get("curralias" + id) || "default";
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
			};
			let pn = await client.db.get(`petname${id}`) || display;
			display = pn;	
			data = data.split(";");
			if (data.length < 10) return message.reply("Your dragon's data must be at least 10 elements long. To fix this, please contact `" + client.users.cache.get(client.config.owner).tag + "`.");
			//"level;health;energy;exp;credits;intel;endur;str;affec;glycogenesis"
			let health = data[1];
			let affec = data[8];
			let energy = data[2];                                     
			let level = Number(data[0]);
			let xp = data[3];
			let cred = data[4];
			let intel = data[5];
			let endur = data[6];
			let str = data[7];
			let glyc = data[9];
			let nextLevel = client.config.reqs[level - 1] || "∞";
			let emb = new MessageEmbed()
				.setColor(message.author.color)
				.setTitle(`${tag}'s ${client.capital(display)} [${cst.includes("maxdragon888") ? "MAXED" : level}]`)
				.setDescription(`\`${message.guild.prefix}disown\` to disown your ${display} and delete it.\n\`${message.guild.prefix}feed\` to feed your ${display} and completely refill its energy.\n\`${message.guild.prefix}name <new name>\` to name your ${display}. (requires Supreme)\n\`${message.guild.prefix}stroke\` to stroke your ${display} and increase its affection by 1.\n\`${message.guild.prefix}search\` to get your ${display} to go out searching for fish and gain a certain amount of XP depending on your ${display}'s intellect.\n\`${message.guild.prefix}upgrade <stat> <amount>\` to upgrade \`<stat>\` by \`<amount>\` points, \`<amount>\` defaults to 1.\n\`${message.guild.prefix}downgrade <stat>\` to downgrade a stat by 1 point and receive ${emojis[3]} 1 in return \`${message.guild.prefix}deprive <stat>\` to completely remove all invested ${emojis[3]} on the stat and receive the appropriate amount of credits in return. For example, say a user has 5 total points on strength: \`${message.guild.prefix}deprive strength\` would set the strength stat to 1 and return 4 credits to the user.\n\`${message.guild.prefix}defend\` to toggle your ${display}'s protection     —     your ${display} must have at least 200 health in order for it successively to protect you from attackers.
				`)
				.addField(
					"Basic Stats",
`
${emojis[0]} Health     —     ${client.noExponents(health)}/10000
${emojis[1]} Energy     —     ${client.noExponents(energy)}/100
`
, true
				)
				.addField(
					"Advanced Stats",
`
${emojis[2]} Experience     —     ${message.author.com == 1 ? client.noExponents(xp) : client.comma(client.noExponents(xp))}/${message.author.com == 1 ? client.noExponents(nextLevel) : client.comma(client.noExponents(nextLevel))}
${emojis[3]} Credits     —     ${message.author.com == 1 ? client.noExponents(cred) : client.comma(client.noExponents(cred))}
${emojis[4]} Intellect     —     ${client.noExponents(intel)}
${emojis[5]} Endurance     —     ${client.noExponents(endur)}
${emojis[6]} Strength     —     ${client.noExponents(str)}
${emojis[7]} Affection     —     ${client.noExponents(affec)}
${emojis[8]} Glycogenesis     —     ${client.noExponents(glyc)}
`					
				)
			return message.reply({ embed: emb })
		}
		if (!args.length) {
			return Embed(message.author.id, message.author.tag)
		};
		if(!args.length) args = [message.author.id];
		let usr = await client.config.fetchUser(args[0]).catch((x) => {});
		if (!usr) usr = message.author;
		 Embed(usr.id, usr.tag, usr.bot);
	},
};