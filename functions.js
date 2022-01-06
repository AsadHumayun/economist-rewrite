import { MessageEmbed } from "discord.js";

/**
 * Used to send an error to the exceptions channel and stderr
 * The function name is capitalised in order to prevent me from overusing it (yeah, I'm that lazy)
 * This function was not able to go in the `config.js` file due to certain complications
 * @param {String} e exception that is to be recorded
 * @param {?String} msgCont message content (only if this was used in a command - really helps with debugging)
 * @param {Discord.Client} client The currently instantiated Discord client-
 */
const Notify = (e, msgCont, client) => {
	const rn = new Date().toISOString();
	console.error(e);
	if (!msgCont || msgCont.toString().length == 0) {
		client.channels.cache.get(client.config.statics.defaults.channels.error).send({
			content: `[${rn}]: <type: unhandledRejection>:\n\`${e}\``,
			// very unliekly that a normal exception/error will exceed 2,000 characters in length.
		}).catch(() => {return;});
		// to prevent messageSendFailure erros from throwing. They flood the console and often I can't do anything about it so it's better to just ignore those.
	}
	else {
		client.channels.cache.get(client.config.statics.defaults.channels.error).send({
			content: `[${rn}]: <type: unhandledRejection>:\n\`${e}\``,
			embeds: [
				new MessageEmbed()
					.setColor("#da0000")
					.setDescription(msgCont instanceof Promise ? "Promse { <rejected> }" : msgCont.toString() || "Message content unavailable."),
			],
		})
			.catch(() => {return;});
	}
};

export {
	Notify,
};