"use strict";
export default {
	allNumbers: function(data) {
		data = data.toString().split(";").map(Number);
		if (data.includes(NaN)) throw new Error("\n[CustomValidator => allNumbers] [Fail] All values must be numeric.");
	},
	isNumericString: function(data) {
		if (typeof data !== "string" || isNaN(data)) throw new Error(`\n[CustomValidator => isNumericString] [Fail] ID must be a numeric string. Received type: ${typeof data} (NaN?: ${isNaN(data)})`);
	},
	// had to be introduced because Sequelize didn't recognise standard form numbers as numbers :shrug:
	isNumber: function(data) {
		if (isNaN(Number(data))) throw new Error(`\n[CustomValidator => isNumber] [Fail] Value must be a valid JavaScript number. Received type: ${typeof data}`);
	},
};