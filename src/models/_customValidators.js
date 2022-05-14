"use strict";

import { client } from "../index.js";

export function allNumbers(data) {
	data = data.toString().replaceAll("&", "").split(";").map(e => e == "" ? "0" : e).map(Number);
	if (data.includes(NaN)) throw new Error("\n[CustomValidator => allNumbers] [Fail] All values must be numeric.");
}

export function isNumericString(data) {
	if (typeof data !== "string" || isNaN(data)) throw new Error(`\n[CustomValidator => isNumericString] [Fail] ID must be a numeric string. Received type: ${typeof data} (NaN?: ${isNaN(data)})`);
}

export function _isNumber(data) {
	let invalid = false;

	if (isNaN(Number(data))) {
		invalid = true;
		return;
	}
	else if (data.toString().split("&").length !== 2 && isNaN(data)) {
		invalid = true;
	}
	if (invalid === true) throw new Error(`\n[CustomValidator => isNumber] [Fail] Value must be a valid JavaScript number or formatted via utils/Functions/format. Received type: ${typeof data}`);
	return data;
}