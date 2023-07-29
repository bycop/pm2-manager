import * as process from 'node:process';
import {Bot, session} from 'grammy';
import {config as dotenv} from 'dotenv';
import {FileAdapter} from '@grammyjs/storage-file';
import {generateUpdateMiddleware} from 'telegraf-middleware-console-time';
import {html as format} from 'telegram-format';
import {MenuMiddleware} from 'grammy-inline-menu';
import {i18n} from '../translation.js';
import {menu} from './menu/index.js';
import type {MyContext, Session} from './my-context.js';

dotenv(); // Load from .env file
const token = process.env['BOT_TOKEN'];
if (!token) {
	throw new Error('You have to provide the bot-token from @BotFather via environment variable (BOT_TOKEN)');
}

const bot = new Bot<MyContext>(token);

bot.use(session({
	initial: (): Session => ({}),
	storage: new FileAdapter(),
}));

bot.use(async (ctx, next) => {
	if (ctx.update?.message?.from?.id.toString() !== process.env['OWNER_ID'] && ctx.update?.callback_query?.from?.id.toString() !== process.env['OWNER_ID']) return;
	return next();
});

bot.use(i18n.middleware());

if (process.env['NODE_ENV'] !== 'production') {
	// Show what telegram updates (messages, button clicks, ...) are happening (only in development)
	bot.use(generateUpdateMiddleware());
}

bot.command('help', async ctx => {
	console.log(ctx?.update?.message?.from)

	ctx.reply(ctx.t('help'))
});

bot.command('html', async ctx => {
	let text = '';
	text += format.bold('Some');
	text += ' ';
	text += format.spoiler('HTML');
	await ctx.reply(text, {parse_mode: format.parse_mode});
});

bot.callbackQuery("delete-payload", async (ctx) => {
	await ctx.deleteMessage();
  });

const menuMiddleware = new MenuMiddleware('/', menu);
bot.command('start', async ctx => menuMiddleware.replyToContext(ctx));
bot.command('settings', async ctx => menuMiddleware.replyToContext(ctx, '/settings/'));
bot.use(menuMiddleware.middleware());

// False positive as bot is not a promise
// eslint-disable-next-line unicorn/prefer-top-level-await
bot.catch(error => {
	console.error('ERROR on handling update occured', error);
});

export async function start(): Promise<void> {
	// The commands you set here will be shown as /commands like /start or /magic in your telegram client.
	await bot.api.setMyCommands([
		{command: 'start', description: 'open the menu'},
		{command: 'magic', description: 'do magic'},
		{command: 'html', description: 'some html _mode example'},
		{command: 'help', description: 'show the help'},
		{command: 'settings', description: 'open the settings'},
	]);

	await bot.start({
		onStart(botInfo) {
			console.log(new Date(), 'Bot starts as', botInfo.username);
		},
	});
}
