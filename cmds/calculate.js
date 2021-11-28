const { MessageEmbed, Message } = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: 'calculate',
    aliases: [ 'calculate', 'calc', 'math', 'maths' ],
    description: "Calculates a calculation and returns the numerical answer",
    async run(client, message, args) {
        if (!args.length) return message.reply("You must specify a calculation!");
        const calc = args.join(' ');
        let number = math.evaluate(calc);
        message.reply({
            embed: new MessageEmbed()
            .setColor(message.author.color)
            .setDescription(client.noExponents(number))
        })
    }
}