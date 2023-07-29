import { MenuTemplate } from 'grammy-inline-menu';
import { backButtons } from '../general.js';
import type { MyContext } from '../../my-context.js';
import { createBackMainMenuButtons } from '../../../../node_modules/grammy-inline-menu/dist/source/index.js';
import axios from 'axios';
import { InlineKeyboard } from 'grammy';

export const menu = new MenuTemplate<MyContext>(ctx => ctx.t('pm2manager-body'));

export const listMenu = new MenuTemplate<MyContext>(ctx => ctx.t('settings-language'));

// const states = [
// 	{
// 		id: "1",
// 		name: "test",
// 		state: true
// 	},
// 	{
// 		id: "2",
// 		name: "test2",
// 		state: false
// 	}
// ]

function getAllProcess(): Promise<string[]> {
	return axios.get('http://localhost:3000/pm2/processes')
		.then(response => {
			console.log(response.data)
			if (response.data.error || !response.data.data)
				return []
			const processes = response.data.data.map((process: any) => `${process.id}: ${process.name} (${process.state})`);
			return processes;
		})
		.catch(error => {
			console.error(error);
			return [];
		});
}

const actionMenu = new MenuTemplate<MyContext>(ctx => `You chose process: ${ctx.match?.[1]}`)
actionMenu.interact('Start 🟢', 'start', {
	do: async ctx => {
		console.log('Start this process', ctx.match);

		await axios.get('http://localhost:3000/pm2/start/' + ctx.match?.[1]?.split(":")[0]).then(async (response) => {
			if (response.data.error) {
				await ctx.answerCallbackQuery('Error: ' + response.data.data);
			} else {
				await ctx.answerCallbackQuery('You started the process');
			}
		}).catch(async (error) => {
			await ctx.answerCallbackQuery('Error: ' + error);
		});
		return true;
	}
});

actionMenu.interact('Restart 🔁', 'restart', {
	joinLastRow: true,
	do: async ctx => {
		console.log('Restart this process', ctx.match);

		await axios.get('http://localhost:3000/pm2/restart/' + ctx.match?.[1]?.split(":")[0]).then(async (response) => {
			if (response.data.error) {
				await ctx.answerCallbackQuery('Error: ' + response.data.data);
			} else {
				await ctx.answerCallbackQuery('You restarted the process');
			}
		}).catch(async (error) => {
			await ctx.answerCallbackQuery('Error: ' + error);
		});
		return true;
	}
});

actionMenu.interact('Stop 🔴', 'stop', {
	joinLastRow: true,
	do: async ctx => {
		console.log('Stop this process', ctx.match);

		await axios.get('http://localhost:3000/pm2/stop/' + ctx.match?.[1]?.split(":")[0]).then(async (response) => {
			if (response.data.error) {
				await ctx.answerCallbackQuery('Error: ' + response.data.data);
			} else {
				await ctx.answerCallbackQuery('You stopped the process');
			}
		}).catch(async (error) => {
			await ctx.answerCallbackQuery('Error: ' + error);
		});
		return true;
	}
});

actionMenu.interact('Logs 📑', 'logs', {
	joinLastRow: true,
	do: async ctx => {
		console.log('Logs of process', ctx.match);

		await axios.get('http://localhost:3000/pm2/logs/' + ctx.match?.[1]?.split(":")[0]).then(async (response) => {
			if (response.data.error) {
				await ctx.answerCallbackQuery('Error: ' + response.data.data);
			} else {
				const inlineKeyboard = new InlineKeyboard().text("Delete", "delete-payload");

				ctx.reply(`Logs of process ${ctx.match?.[1]?.split(":")[0]}:\n\n${response.data.data}`, { reply_markup: inlineKeyboard });
			}
		}).catch(async (error) => {
			await ctx.answerCallbackQuery('Error: ' + error);
		});
		return true;
	}
});


actionMenu.manualRow(createBackMainMenuButtons());

menu.chooseIntoSubmenu('process', getAllProcess, actionMenu);

menu.manualRow(backButtons);
