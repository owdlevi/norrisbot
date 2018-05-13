const isMessage = event => Boolean(event.type === 'message' && event.text)

const isMessageToChannel = message => Boolean(typeof message.channel === 'string' && message.channel[0] === 'C')

const isFromUser = (event, userId) => event.user === userId

const messageContainsText = (message, possibleTexts) => {

  const messageText = message.text.toLowerCase()
  const texts = Array.isArray(possibleTexts) ? possibleTexts : [possibleTexts]

  for (const text of texts){
    if (messageText.indexOf(text.toLowerCase()) > -1){
      return true
    }
  }

  return false
}

const filterJokesByCategories = (jokes, categories) => jokes.filter((jokes) => {
  if (jokes.categories.length === 0){
    return true
  }

  for (const category of categories) {
    if (jokes.categories.includes(category)) {
      return true;
    }
  }

  return false
})

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]

module.exports = { isMessage, isMessageToChannel, isFromUser, messageContainsText, filterJokesByCategories, pickRandom }
