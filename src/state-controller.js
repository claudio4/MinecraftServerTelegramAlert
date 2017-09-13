import Ping from './ping-minecraft-server';
import getPlayersDifference from './state-utils/get-players-difference';

export default class StateController {
  constructor(bot, chats, alerts) {
    this.bot = bot;
    this.chats = chats;
    this.alerts = alerts;
    this.isServerOnline = null;
    this.players = null;
    this.message = "";
  }
  getMentionString() {
    return this.alerts['mention-on-server-online-status-change']
    ? this.chats.
      filter(chat => !chat.isGroupChat)
      .map(chat => `[@](tg://user?id=${chat.id})`)
      .join("")
    : "";
  }
  handleUpdate(update) {
    if(this.isServerOnline === false) {
      this.isServerOnline = true;

      this.message = "⚠️ Alert ⚠️\n\n🔵 The server is now *online*\n\n" + this.getMentionString();
      return this.sendMessage();
    } else if(this.isServerOnline === null) {
      this.isServerOnline = true;
    }

    if(this.alerts['players-join-or-exit'] && this.players !== null) {
      let playersNames = update.players.sample ? update.players.sample.map(player => player.name) : [];
      let playersDifference = getPlayersDifference(playersNames, this.players);
      this.players = playersNames;
      this.handlePlayersJoinOrExit(update.players, playersDifference);
    } else if(this.alerts['players-join-or-exit'] && this.players === null) {
      this.players = update.players.sample ? update.players.sample.map(player => player.name) : [];
    }

    if(this.message !== "") {
      this.sendMessage();
    }
  }
  handleServerOffline() {
    if(this.isServerOnline === false) {
      return;
    } else if(this.isServerOnline === null) {
      this.isServerOnline = false;
    }

    this.isServerOnline = false;

    this.message = "⚠️ Alert ⚠️\n\n🔴 The server is now *offline*\n\n" + this.getMentionString();
    return this.sendMessage();
  }
  handlePlayersJoinOrExit(players, playersDifference) {
    if (playersDifference.joined.length === 0 && playersDifference.exited.length === 0) {
      return;
    }

    var joinedPlayersString = "",
      exitedPlayersString = "",
      onlinePlayersList = "";
    if(playersDifference.joined.length !== 0) {
      joinedPlayersString = "The following players joined to the server:";
      playersDifference.joined.forEach(player => {
        joinedPlayersString += `\n- ${player}`
      });
      joinedPlayersString += "\n\n";
    }
    if(playersDifference.exited.length !== 0) {
      exitedPlayersString = "The following players left the server:";
      playersDifference.exited.forEach(player => {
        exitedPlayersString += `\n- ${player}`
      });
      exitedPlayersString += "\n\n";
    }
    if(this.alerts['players-join-or-exit']['include-online-players-list']) {
      onlinePlayersList = "Online players list:";
      this.players.forEach(player => {
        onlinePlayersList += `\n- ${player}`
      });
      onlinePlayersList += "\n\n";
    }
    this.message += `*Players alert*\n${joinedPlayersString}${exitedPlayersString}${onlinePlayersList}Total players online: ${players.online}/${players.max}\n`;
  }
  sendMessage( ) {
    let msg = this.message;
    this.message = "";

    this.chats.forEach(chat => {
      if (chat.sendMessages) {
        this.bot.sendMessage({
          chat_id: chat.id,
          text: msg,
          parse_mode: "Markdown"
        })
      }
    })
  }
}
