const winston = require('winston')
const chalk = require('chalk')
const norrisbot = require('./norrisbot')


const logger = new winston.Logger({
  transports: [
    new(winston.transports.Console)({
      timestamp(){
        return (new Date()).toISOString();
      },
    }),
  ],
})

if (!process.env.NORRISBOT_TOKEN) {
  logger.error('You must setup NORRISBOT_TOKEN enviroment variable before you run this application!')

  process.exit(1)
}

const options = { logger }

if (process.env.NORRISBOT_TRIGGERS){
  options.triggerWords = process.env.NORRISBOT_TRIGGERS.split(',')
}
if (process.env.NORRISBOT_CATEGORIES){
  options.specialCategories = process.env.NORRISBOT_CATEGORIES.split('')
}
if (process.env.NORRISBOT_NO_PICTURES) {
  options.usePictures = false;
}

if (process.env.NORRISBOT_MESSAGE_COLOR){
  options.messageColor = process.env.NORRISBOT_MESSAGE_COLOR
}

const bot = norrisbot(process.env.NORRISBOT_TOKEN, options)

bot.start()
