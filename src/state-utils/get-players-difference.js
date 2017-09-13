export default function(newPalyers, oldPlayers) {
  return {
    joined: newPalyers.filter(player => (!oldPlayers.includes(player))),
    exited: oldPlayers.filter(player => (!newPalyers.includes(player)))
  }
}
