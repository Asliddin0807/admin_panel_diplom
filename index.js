const e = require('express');
const express = require('express')
const app = express()
const TelegramBot = require('node-telegram-bot-api');
const { connectingData } = require('./config/connect');
const token = '6516411920:AAFJV9gmaRhUIL4NOi7OQrEN7MO42bOtCKY';
const bot = new TelegramBot(token, {polling: true});
const userApi = require('./routes/client_router')
const prodApi = require('./routes/product')
const adminApi = require('./routes/admin_routes')
const cors = require('cors');


connectingData()

const { ru, uz } = require('./config/languages')

const { tovar, category, userCart } = require('./config/tovar')
app.use(express.json())

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; 
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{text: 'Товары'}, {text: 'Категория'}],
        [{text: 'Мои товары'}, {text: 'Продажа'}],
        [{text: "Мои информация"}, {text: 'Поиск'}],
        // [{text: ""}]
      ]
    })
  };

  // Отправка сообщения с кнопкой
  bot.sendMessage(chatId, 'Choose an option:', options);
});
let id;

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === 'Товары') {   
    tovar.forEach(obj => {
      bot.sendPhoto(chatId, `${obj.image}`, {
        caption: `📝 *Титул:* ${obj.title} \n 💰 *Цена:* ${obj.price} \n\n 📃 *Комментария:* ${obj.desc}`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{
              text: 'Добавить в корзину',
              callback_data: `add_to_cart_${obj.id}`
            }]
          ]
        }
      })
    })
  } 
  if (msg.text === 'Категория') {
    bot.sendMessage(chatId, 'You pressed Button 2!');
  }

  if(msg.text == 'Мои товары'){
    console.log(userCart)
    userCart.forEach(obj => {
      bot.sendPhoto(chatId, `${obj.image}`, {
        caption: `📝 *Называния:* ${obj.title} \n 💰 *Цена:* ${obj.price} \n\n 📃 *Комментария:* ${obj.desc}`,
        parse_mode: 'Markdown',
        product_id: obj.id
      })

    })
  }
});

bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const action = callbackQuery.data;
  const messageId = callbackQuery.message.caption

  const productId = parseInt(callbackQuery.data.split('_')[3]);
  const findProd = tovar.find(c => c.id == productId)
  if(userCart.length == 0){
    userCart.push(findProd) 
    // console.log(userCart) 
  }else{
    const alreadyAdded = userCart.find(product => product.id === productId);
    console.log(userCart)
    if(alreadyAdded){
      bot.sendMessage(chatId, 'Dobavlen uje!')
    }else{
      userCart.push(findProd)
      console.log(userCart)
    }
  }
  
});

app.use(cors());
app.use('/', userApi)
app.use('/', prodApi)
app.use('/', adminApi)


const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log('server is running')
})