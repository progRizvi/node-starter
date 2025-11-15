const nodemailer = require("nodemailer");
const host = process.env.SMTP_HOST || "smtp.example.com";
const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 2525;
const user = process.env.SMTP_USER || "username";
const pass = process.env.SMTP_PASS || "password";
const from = process.env.SMTP_FROM || "hello@example.com";
const encryption = process.env.SMTP_ENCRYPTION || "tls";
const fromName = process.env.MAIL_FROM_NAME || "Example App";

let configOptions = {
	host,
	port,
	auth: {
		user,
		pass,
	},
	tls: {
		rejectUnauthorized: true,
		minVersion: "TLSv1.2",
	},
};
const transporter = nodemailer.createTransport(configOptions);
export const sendMails = async (
	to: string,
	subject: string,
	body: string,
	html: string,
	attachments?: any[],
	cc?: string
) => {
	const info = await transporter.sendMail({
		from: `"${fromName}" <${from}>`,
		to: `${to}, ${cc}`,
		subject: subject,
		text: body,
		html: html,
	});
};
