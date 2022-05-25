import { Util, WebhookClient } from "discord.js";

export default {
	name: "debug",
	once: false,
	async execute(client, dbg) {
		process.logger.updateLogsFile("debugger", null, false, dbg, null);
		/**
		 * Oirginally when I first tried using the client.Notify function here, it errored out saying: `TypeError: Cannot read properties of undefined (reading 'send')`. This error means that the client couldn't find the channel, which was awkward since it was getting the correct channel ID (hence the commented out console.log statement-that's me checking if the func is actually getting the right channel ID).
		 * As it wasn't an issue with the ID, it had to be an issue wit the Client not getting the channel from Discord. I had a read of the [discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome) and realised that this event must...
		 * send the debug message via a webhook and NOT the client because this event will emit before the client is ready, and since this relied on the client, it became an issue as the client hadn't loaded yet.
		 * Thus, a webhook is used instead. A webhook has, in essence, is only used to send a message via a single HTTP POST request, and is independent to the client itself. This isn't really much of an issue, and is only really apparent here.
		 * -I've added it to the config.js file anyway, simply because I would like to keep such conf values in one place, where I can easily manage them.
		 */
		const webh = new WebhookClient({ url: client.const.webhooks.debugger });
		const send = Util.splitMessage(dbg, { maxLength: 2_000, char: "" });

		send.forEach(async (message) => {
			await webh.send({
				content: "`" + message + "`",
			});
		});
	},
};