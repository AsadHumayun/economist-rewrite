const { MessageEmbed, escapeMarkdown, Permissions, UserFlags } = require('discord.js');

module.exports = {
	name: 'profile',
	aliases: ['profile', 'prof'],
	category: 'utl',
	description: 'shows a user\'s profile',
	async run(client, message, args) {
		if (!args) args = [message.author.id]
		let usr = await client.config.fetchUser(args[0]).catch(() => {return;});
		if (!usr) usr = message.author;
		let cmds = await client.db.get("cmds" + usr.id) || 1;
		let color = await client.db.get('color' + usr.id) || client.config.defaultHexColor;
		const bio = await client.db.get('bio' + usr.id) || 'Set a bio using `' + message.guild.prefix + "bio`"
		function format(str) {
			let newStr = str.replace(/_+/g, " ").toLowerCase();
			newStr = newStr.split(/ +/).map(x => `${x[0].toUpperCase()}${x.slice(1)}`).join(' ');
			return newStr.replace('Vad', 'VAD').replace('Tts', "TTS");
		};
		const mem = client.guilds.cache.get(client.config.statics.supportServer).members.cache.get(usr.id)
		let map;
		if (mem) {
			 map = Object.keys(Permissions.FLAGS).map(x => {
				 if (mem.hasPermission(x)) {
					 return format(x);
				 } else {
					 return 'false';
				 };
			 }).join(", ").replace(/false, /g,'').replace(", false",'');
		};
		let flags = Object.keys(UserFlags.FLAGS).map(x => {
        if (usr.flags.has(x)) {
            return format(x);
        } else {
            return 'false';
        };
    }).join(", ").replace(/false, /g,'').replace(", false",'');
		const emb = new MessageEmbed()
		.setColor(color)
		.setTitle(`${usr.tag}'s Profile`)
		.setDescription(bio.toString().length ? bio : null)
		.setThumbnail(usr.displayAvatarURL({ dynamic: true }))
		.addField("Roles", client.trim(message.guild.member(usr.id).roles.cache.map(x => x.toString()).join(', ') || "`None`", 1024))
		.addField("Commands Used", message.author.com == 1 ? cmds : client.config.comma(cmds), true)
		.addField("Colour Preferences", color.split(";") || client.config.defaultHexColor, true)
		.addField("Flags", flags)
		if (mem) {
			emb.addField("Permissions", map)
		};
		message.reply(emb);
  },
}