const { MessageEmbed } = require('discord.js');
const Client = require('uptime-robot'); 
const moment = require('moment');

module.exports = {
	name: 'uptime',
	aliases: ['uptime', 'upt'],
	category: 'utl',
	description: 'View enhanced uptime info',
	async run(client, message, args) {
	return client.commands.get("info").run(client, message, args);
	var getUptime = function(millis) {
    var dur = {};
    var units = [{
            label: "milliseconds",
            mod: 1000
        },
        {
            label: "seconds",
            mod: 60
        },
        {
            label: "minutes",
            mod: 60
        },
        {
            label: "hours",
            mod: 24
        },
        {
            label: "days",
            mod: 31
        }
    ];

    units.forEach(function(u) {
        millis = (millis - (dur[u.label] = (millis % u.mod))) / u.mod;
    });

    var nonZero = function(u) {
        return dur[u.label];
    };
    dur.toString = function() {
        return units
            .reverse()
            .filter(nonZero)
            .map(function(u) {
                return dur[u.label] + " " + (dur[u.label] == 1 ? u.label.slice(0, -1) : u.label);
            })
            .join(', ');
    };
    return (dur);
};		
	const msg = await message.reply("Fetching uptime info...")
		const upt = getUptime(client.uptime);
		const Main = new Client(process.env.monitork);
		Main.getMonitors({ logs: 1, logs_limit: 14, timezone: 1, response_times: 1, response_times_limit: 25 }, (async(err, data) => {
			/*
			console.log(require('util').inspect(data[7], { depth: 10000000, colors: true }))
			console.log(err)*/
			const emb = new MessageEmbed()
			.setColor(message.author.color)
			.setTitle("Uptime Information")
			.addField("Uptime", upt)
			.addField("Last Restart", `${moment(client.readyTimestamp).format('MMMM Do YYYY, h:mm:ss A')} UTC`)
			.addField("Monitor Name", `\`${data[7].friendlyname}\``)
			.addField("Monitor ID", data[7].id, true)
			.addField("% Uptime", "`" + data[7].alltimeuptimeratio + "%`", true)
			.addField("URL", data[7].url)
			.addField("Status", data[7].status, true)
			.addField("Ping Interval", data[7].interval, true)
			.addField("Type", data[7].type, true)
			.addField("Logs", client.trim(data[7].log.map(x => {
				const type = x.type;
				const date = x.datetime;
				if (type == 1) {
					return `${client.config.statics.defaults.emoji.err} **DOWN:** ${moment(date).format('MMMM Do YYYY, h:mm:ss A')}`
				} else if (type == 2) {
					return `${client.config.statics.defaults.emoji.tick} **Online:** ${moment(date).format('MMMM Do YYYY, h:mm:ss A')}`
				} else if (type == 99) {
					return `${client.config.statics.defaults.emoji.err} **Paused:** ${moment(date).format('MMMM Do YYYY, h:mm:ss A')}`
				} else if (type == 98) {
					return `${client.config.statics.defaults.emoji.tick} **Started:** ${moment(date).format('MMMM Do YYYY, h:mm:ss A')}`
				}
			}).join('\n'), 1024))
//			.addField("Avg. Response Times", data[7].response_times_limit)
			msg.edit("", { embed: emb });
		}))
	//.catch((x) => message.reply("Error: " + x))
	},
};