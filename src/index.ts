/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { EmailMessage } from 'cloudflare:email';
import PostalMime from 'postal-mime';
import { foldLines, getFoldedHeaderValue, headerValue } from './util';
import { createMimeMessage } from 'mimetext';

type EmailError =
	| { type: 'unrecoverable'; message: string }
	| {
			type: 'recoverable';
			message: string;
			retry_after: string;
	  };

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return new Response('Hello World!');
	},
	async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<Response> {
		let email_response = handle_email(message, env, ctx);
		if (email_response instanceof Promise) {
			return email_response
				.then(() => new Response())
				.catch((error: EmailError) => {
					switch (error.type) {
						case 'recoverable':
							console.error(`A recoverable error occurred, details: "${error.message}", retry after: ${error.retry_after}`);
							return new Response(error.message, {
								status: 503,
								headers: {
									'Retry-After': error.retry_after,
								},
							});

						case 'unrecoverable':
							console.error(`An unrecoverable error occurred, details: "${error.message}"`);
							message.setReject(error.message);
							return new Response();

						default:
							console.error(`Some unknown error has occurred, details: "${error}"`);
							message.setReject(error);
							return new Response();
					}
				});
		} else {
			return new Response();
		}
	},
}; // Note: `} satisfies ExportedHandler<Env>;` requireds `=> Promse<void>` for `email` which doesn't work for msoutlook
//					it just keeps sending emails, even if you `.setReject()`

const handle_email: EmailExportedHandler<Env> = async (message, env, ctx) => {
	console.log(`Message-ID: ${message.headers.get('Message-ID') || 'NONE'}`);

	let to_name = message.to.split('@')[0];
	switch (to_name) {
		case 'parse':
			console.log('handling parse');
			await handle_parse(message, env, ctx);
			return;

		case 'outlook_reply':
			console.log('handling reply');
			await handle_outlook_reply(message, env, ctx);
			return;

		case 'reject':
			console.log('setting reject');
			await message.setReject(
				'This email address rejects everything by design. You should expect a reply to your original message from your email provider explaining this, as well as informing you the message is undeliverable.'
			);
			return;

		case 'recoverable_exception':
			console.log('simulating recoverable exception');
			let recoverable_error: EmailError = {
				type: 'recoverable',
				message: 'you should signal when an inbound email encountered a recoverable error and she be retried vs aborted altogether',
				retry_after: '10',
			};
			throw recoverable_error;

		case 'unrecoverable_exception':
			console.log('simulating unrecoverable exception');
			let urecoverable_error: EmailError = {
				type: 'unrecoverable',
				message: 'you should signal when an inbound email encountered a recoverable error and she be retried vs aborted altogether',
			};
			throw urecoverable_error;

		default:
			console.log('unknown email');
			message.setReject('unknown email address');
			return;
	}
	return;
};

const handle_parse: EmailExportedHandler<Env> = async (message, env, ctx) => {
	let parsed_msg = await PostalMime.parse(message.raw, { rfc822Attachments: false });
	console.log('MESSAGE_ID');
	console.log(parsed_msg.messageId);
	console.log('IN_REPLY_TO');
	console.log(parsed_msg.inReplyTo);
	console.log('REFERENCES');
	console.log(parsed_msg.references);
	console.log('ALL HEADERS');
	console.log(JSON.stringify(parsed_msg.headers));
	return;
};

// TOOD: for some reason no reply body is being included in the actual reply I receive and I have no idea why
const handle_outlook_reply: EmailExportedHandler<Env> = async (message, env, ctx) => {
	let parsed_msg = await PostalMime.parse(message.raw, { rfc822Attachments: false });
	let in_reply_to_value = getFoldedHeaderValue('In-Reply-To', foldLines(`In-Reply-To: ${parsed_msg.messageId}`, 76, false, false));
	console.log(in_reply_to_value);
	console.log(parsed_msg.subject);
	let reply = createMimeMessage();
	reply.setSender(message.to);
	reply.setTo(message.from);
	reply.setSubject(`Re: ${message.headers.get('Subject') || 'Default subject'}`);
	reply.setHeader('In-Reply-To', in_reply_to_value);
	reply.addMessage({
		contentType: 'text/plain',
		data: `This is a response\r\n`,
	});
	return message
		.reply(new EmailMessage(message.to, message.from, reply.asRaw()))
		.then()
		.catch((error) => {
			console.error(error);
			return;
		});
};
