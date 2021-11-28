const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
	name: "rules",
	aliases: ['rules', 'rls', 'rule'],
	description: 'Displays server rules',
	category: 'utl',
	async run(client, message, args) {
		const em = new MessageEmbed()
    .setTitle("Rules:")
    .setColor(message.author.color)
    .setDescription(
      `
    ‣ **No Advertising** - This includes sending users a private message AKA DM / PM

    ‣ **No Discrimination** - This includes but is not limited to any discrimination against race, ethnicity, colour and sexual orientation (LGBTQ+). Violations of this rule are taken seriously and may result in mutes

    ‣ **No Raiding** - This includes flooding a channel completely unusable

    ‣ **No excessive emojis** - Please use a maximum of 5 emojis per message 

    ‣ **Respect Staff Members** - "Staff" are users who have one of two roles: <@&706847178978623499> / <@&706848940225462323>  

    ‣ **Do not threaten other users** - 2 violations of this rule will get you permanently banned

    ‣ **Be considerate** - Swearing is allowed, but keep this to a minimum and be mindful of younger members

‣ **No NSFW (18+) content outside of NSFW channels** - Constant violations of this rule will get you banned 

    ‣ **Do NOT DM staff for the removal of your punishment(s)** - If you feel you've been wrongly punished, bring it up with ${client.users.cache.get(client.config.owner).tag}

If you have any issues with staff or the rules posted above, please contact ${client.users.cache.get(client.config.owner).tag} 

This server abides by the [Discord ToS](https://discord.com/new/terms, "Discord Terms Of Service") and the [Discord Community Guidelines](https://discord.com/new/guidelines, "Discord Community Guidelines")
      `
    )
    .addField("Info", `If you would like to get mentioned for future updates, use the command \`${message.guild.prefix}updates\`. The same command may be used to remove the role`)
	.setFooter(`Last Updated: ${moment(client.config.x).format('MMMM Do YYYY, h:mm:ss A')} UTC`)
		message.reply(em)
	}
}