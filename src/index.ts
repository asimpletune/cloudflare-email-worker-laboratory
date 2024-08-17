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

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return new Response('Hello World!');
	},
	async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
		let to_name = message.to.split('@')[0];
		switch (to_name) {
			case 'reject':
				return handle_reject(message, env, ctx);
			case 'exception':
				return handle_exception(message, env, ctx);
			default:
				return;
		}
	},
} satisfies ExportedHandler<Env>;

const handle_reject: EmailExportedHandler<Env> = (message, env, ctx) => {
	return message.setReject('reject everything');
};

const handle_exception: EmailExportedHandler<Env> = (message, env, ctx) => {
	throw 'ERROR';
};
