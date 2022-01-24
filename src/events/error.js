export default {
	name: "erorr",
	once: false,
	async execute(client, e) {
		client.utils.notify(e, null, client);
	},
};