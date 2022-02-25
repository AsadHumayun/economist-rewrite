"use strict";

export function allNumbers(data) {
	data = data.toString().split(";").map(e => e == "" ? "0" : e).map(Number);
	if (data.includes(NaN)) throw new Error("\n[CustomValidator => allNumbers] [Fail] All values must be numeric.");
}

export function isNumericString(data) {
	if (typeof data !== "string" || isNaN(data)) throw new Error(`\n[CustomValidator => isNumericString] [Fail] ID must be a numeric string. Received type: ${typeof data} (NaN?: ${isNaN(data)})`);
}

export function _isNumber(data) {
	if (isNaN(Number(data))) throw new Error(`\n[CustomValidator => isNumber] [Fail] Value must be a valid JavaScript number. Received type: ${typeof data}`);
}