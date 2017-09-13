import TelegramBot from 'nodetgbot';

import Config from './config';
import Ping from './ping-minecraft-server';
import StateController from './state-controller'

const bot = new TelegramBot(Config["bot-token"], Config["telegram-polling-ratio"]),
  state = new StateController(bot,Config.chats,Config.alerts);

async function poll() {
  await Ping(Config.server, Config.port)
    .then(results => {
      state.handleUpdate(results);
    })
    .catch(err => {
      if(err.code === 'ETIMEDOUT') {
        state.handleServerOffline();
      } else if(err.code === 'ENOTFOUND') {

      } else {
        console.log(err)
      }
    });

    setTimeout(poll, Config["minecraft-polling-ratio"])
}

poll();

console.log(`The bot is watching the minecraft server located at ${Config.server}:${Config.port}`);
