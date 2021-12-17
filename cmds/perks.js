const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "perks",
	aliases: ["perks", "perk", "donateinfo"],
	description: "View bot's purchasable permissions with their according prices.",
	category: "utl",
	async run(client, message) {
		message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(message.author.color)
					.setTitle("Donation Information")
					.addField("Pricing", "Note that \"£\" refers to \"GBP\" (the \"Great British Pound\"). This is the only currency which will be accepted so you may have to convert from your current currency to GBP otherwise your payment may not be accepted and will be ignored.")
					.setDescription(
						`
					Here's a list of things which you may purchase listed with their corresponding prices in bold. If you're confused on a command or have any further enquiries, please PM \`${client.users.cache.get(client.config.owner).tag}\`.
		
					**__Colorist__** (**£2**)
						- Access to \`${message.guild.prefix}color\` - allows for an unlimited amount of colour preferences
		
					**__Supreme__** (**£5**)
						- Access to \`${message.guild.prefix}name <name>\`
						- Access to \`${message.guild.prefix}deprive <stat>\`
						- Access to \`${message.guild.prefix}cooldowns\`
		
					**__Rebel__** (**£1**)
						- Clears 3 second cooldown between using commands 
		
					**__Judge__** (**£4**)
						- Access to \`${message.guild.prefix}sentence <user>\`
					
					**__Nerd__*** (**£25**)
						- Access to logs in our suppot server (it's priced higher to prevent more people from purchasing it).
						`,
					)
					.addField("Additional Services",
						`
		You can also purchase "custom roles". These roles will be created and held within our [support server](${client.config.ssInvite}), each user is able to own an unlimited amount of roles; each role will have its own "keyword" which the bot will use in order to recognise the role you wish to use. As a result of this, only one keyword can be linked to a single role instantaneously. 
		
		**1x Custom Role** - £10
		`,
					)
					.addField("Custom Role Commands",
						`
		- \`${message.guild.prefix}roles\` - shows you a list of roles you own, with their keywords (in case you forget);
		- \`${message.guild.prefix}role <role keyword> <user>\` - Used to assign the role, if the user already has the role then the bot will remove it;
		- \`${message.guild.prefix}rolename <role keyword> <new name>\` - Edits the name of your owned role with said \`<role keyword>\`;
		- \`${message.guild.prefix}rolecolor <role keyword> <new color>\` - Edits the colour of your role; must be a **hex** colour code. For help choosing one, click [here](https://htmlcolorcodes.com/);
		- \`${message.guild.prefix}rolemembers <role name or ID>\` - Shows a list of all the members who have a certain role; note it works on any role (even if you don't own it) - make sure you specify a valid ID or name;
		- \`${message.guild.prefix}editrolekw <old role keyword> <new role keyword>\` - Edits the keyword of a role, changing it to what you have specified.
		`,
					)
					.addField("Custom Channels",
						`
		You may also purchase custom channels within our support server - these will be created and held within the "\`CUSTOM\`" category. You'll have the Manage Channel permission within that channel and you have full control over that channel. Note that bot staff reserve the right to edit the channel within reason. 
		
		Rules still apply within custom channels. Only a small selection of rules will not be applied to Custom Channels - this has not yet been decided and will be annnounced once it is.
		
		**1x Custom Channel (text)** - £10
		**1x Custom Channel (voice)** - £7
				`,
					)
					.addField("Alternative Payment Methods",
						`Please PM \`${client.users.cache.get(client.config.owner).tag}\` with your payment information/credentials
		**These payments __must__ bet in GBP or else they may be rejected.**
		
		**Discord Nitro Gift Codes** - Please PM these to \`${client.users.cache.get(client.config.owner).tag}\`.
		`,
					)
					.addField("Additional Notes",
						`
		Upon purchasing these permissions, you'll receive an additional role in our support server. If you haven't already, I suggest you join by simply clicking [here](${client.config.ssInvite}).
`),
			],
		});
	},
};