const mc = require('minecraft-protocol');


export default function (ip, port) {
  return new Promise(
    function (resolve, reject) {
      mc.ping({
        host: ip,
        port: port,
      }, (err, results) => {
        if (err) {
          return reject(err);
        }

        return resolve(results);
      })
    }
  )

}
