import Config from './config';
import Ping from './ping-minecraft-server';

export default function(message, bot) {
  Ping(Config.server, Config.port).then(result => {
    let playersString = result.players.sample ?
    result.players.sample.map(player => ` - ${player.name}`).join('\n') : "";
    let msg = `*Full Server Report*
*Version*: ${result.version.name}
*Motd*: ${result.description.text}
*Jugadores*: ${result.players.online}/${result.players.max}
${playersString}`;
    bot.sendMessage({
      chat_id: message.chat.id,
      text: msg,
      parse_mode: "Markdown"
    })
  })
}
