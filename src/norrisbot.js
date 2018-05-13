const { RTMClient, WebClient } = require('@slack/client')
const { isMessage, isMessageToChannel, isFromUser, messageContainsText, filterJokesByCategories, pickRandom } = require('./utils')
const jokes = require('./data/jokes')
const pictures = require('./data/pictures')

const defaultOptions = {
  triggerWords: ['Chuck Norris', 'norrisbot'],
  specialCategories: ['nerdy'],
  messageColor: '#590088',
  usePictures: true,
  logger: console,
  rtmOptions: {}
}

const norrisbot = (botToken, options = {}) => {
  let botId

  const opt = Object.assign({}, defaultOptions, options)
  const rtm = new RTMClient(botToken, opt.rtmOptions)
  const web = new WebClient(botToken)

  const allowedJokes = filterJokesByCategories(jokes, opt.specialCategories)

  rtm.on('message', (event) => {
    if (
      isMessage(event) &&
      isMessageToChannel(event) &&
      !isFromUser(event, botId) &&
      messageContainsText(event, opt.triggerWords)
    ) {
      const joke = pickRandom(allowedJokes)
      let msgOptions = {
        as_user: true,
        channel: event.channel,
        text: joke.text,
        attachments: [
          {
            color: opt.messageColor,
            title: joke.text
          }
        ]
      }


    if(opt.usePictures) {
      msgOptions.attachments[0].image_url = pickRandom(pictures)
    }
    web.chat.postMessage( msgOptions)
    .then((res) => {
      // `res` contains information about the posted message
      opt.logger.info(`Posting message to ${event.channel}`, msgOptions)
    })
    .catch(console.error);
  }
})

  rtm.on('authenticated', (rtmStartData) => {
    botId = rtmStartData.self.id
    opt.logger.info(`Logged in as ${rtmStartData.self.name} (id: ${botId} of team ${rtmStartData.team.name})`)
  })

  return {
    rtm,
    web,
    start() { rtm.start()},
  }
}

module.exports = norrisbot
