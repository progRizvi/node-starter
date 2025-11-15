const fs = require("fs");
const path = require("path");

export const log = {
	info: (message: string) => {
		// open file in append mode
		writeLogToFile("info", message);
	},
	error: (message: string) => {
		writeLogToFile("error", message);
	},
	warn: (message: string) => {
		writeLogToFile("warn", message);
	},
};

const writeLogToFile = (level: string, message: string) => {
	const logPath = path.join(__dirname, "../loggers/node.log");
	fs.appendFile(logPath, level + ": " + message + "\n", "utf-8", (err: any) => {
		if (err) {
			console.error(err);
		}
	});
};
