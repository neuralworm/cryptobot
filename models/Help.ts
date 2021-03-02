export default class HelpObject {
    returnHelpObject() {
      return {
        title: "Cryptobot Commands",
        fields: [
          {
            name: "cryptobot list",
            value: 'List current information on top 5 cryptos.'
  
          },
          {
            name: "cryptobot *coin_symbol || coin_name*",
            value: "List information about single coin. (Use like: cryptobot btc)"
          }
        ]
      }
    }
  }