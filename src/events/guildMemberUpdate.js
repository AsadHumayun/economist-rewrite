export default {
	name: "guildMemberUpdate",
	once: false,
	async execute(client, oldMember, newMember) {
		if (oldMember.guild.id != client.const.supportServer) return;
		// doesn't matter which one we use, oldMember.id and newMember.id will always remain the same.
		const user = await client.db.getUserData(oldMember.id);
		let cst = user.get("cst");
		cst = cst ? cst.split(";") : [];
		if (newMember.roles.cache.has(client.const.roles.SERVER_BOOSTER) && (!cst.includes("booster"))) {
			cst.push("booster");
		}
		else if (cst.includes("booster")) {
			cst = cst.filter((x) => !["booster"].includes(x));
		}
		if (!newMember.nickname) {
			client.db.USERS.update({
				nick: null,
			}, {
				where: {
					id: oldMember.id,
				},
			});
		}
		if (oldMember.nickname != newMember.nickname) {
			await client.db.USERS.update({
				nick: newMember.nickname,
			}, {
				where: {
					id: oldMember.id,
				},
			});
		}
		const oldRoles = [...oldMember.roles.cache.keys()].filter((r) => r != newMember.guild.id);
		const newRoles = [...newMember.roles.cache.keys()].filter((r) => r != newMember.guild.id);
		client.const.cstSpecials.forEach((s) => {
			cst = cst.map((f) => f == s[0] ? s[1] : f);
		});
		for (const f of cst) {
			if (oldRoles.includes(f) && (!newRoles.includes(f))) {
				cst = cst.filter((f0) => ![f].includes(f0));
			}
		}
		cst.push(newRoles.filter((f) => !oldRoles.includes(f)).join(";"));
		newRoles.forEach((f) => {
			if (!cst.includes(f)) cst.push(f);
		});
		for (const f in cst) {
			if (newMember.guild.roles.cache.get(cst[f]) && (!newRoles.includes(cst[f]))) cst = cst.filter((f0) => ![cst[f]].includes(f0));
		}
		cst = cst.filter((f) => !["", client.const.roles.memberRole].includes(f));
		client.const.cstSpecials.forEach((s) => {
			cst = cst.map((f) => f == s[1] ? s[0] : f);
		});
		// remove duplicates:
		cst = [...new Set(cst)];
		await client.db.USERS.update({
			cst: cst.join(";"),
		}, {
			where: {
				id: oldMember.id,
			},
		});
	},
};