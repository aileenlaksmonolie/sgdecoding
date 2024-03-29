// Taken from https://stackoverflow.com/questions/33145762/parse-a-srt-file-with-jquery-javascript/33147421
const ParseSRT_JSON = function () {
	var pattern = /(\d+)\n([\d:,]+)\s+-{2}\>\s+([\d:,]+)\n([\s\S]*?(?=\n{2}|$))/gm;
	var _regExp;

	var init = function () {
		_regExp = new RegExp(pattern);
	};
	var parse = function (f) {
		if (typeof (f) != "string")
			throw "Sorry, Parser accept string only.";

		var result = [];
		if (f == null)
			return _subtitles;

		f = f.replace(/\r\n|\r|\n/g, '\n')

		while ((matches = pattern.exec(f)) != null) {
			result.push(toLineObj(matches));
		}
		return result;
	}
	var toLineObj = function (group) {
		return {
			line: group[1],
			startTime: group[2],
			endTime: group[3],
			text: group[4]
		};
	}
	init();
	return {
		parse: parse
	}
}();

const Statistics = require("./models/statistics.model");
async function setUpdatedFalse(userID) {
  try {
    const update = { updated: false };
    await Statistics.findByIdAndUpdate(userID, update);
  } catch(err) {
    console.log("set update to false failed");
    return err;
  }
}

module.exports = { ParseSRT_JSON, setUpdatedFalse };
