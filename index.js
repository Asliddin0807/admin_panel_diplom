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

const PORT = process.env.PORT || 8000

connectingData()

const { ru, uz } = require('./config/languages')

const { tovar, category, userCart } = require('./config/tovar');
const { default: axios } = require('axios');
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
    let applications = async() => {
      let {data} = await axios.get(`http://localhost:8000/get_product`)
      let base = data.data
      const uniqueCategories = [...new Set(base.map(item => item.category))];
      const inlineKeyboard = uniqueCategories.map(category => [{ text: category, callback_data: category }]);
      bot.sendMessage(chatId, "Kategorys", {
        reply_markup: {
          inline_keyboard: inlineKeyboard
        }
      });
    }
    applications()
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

  let getProd = async() => {
    let { data } = await axios.post('http://localhost:8000/category', { category: callbackQuery.data })
    let base = data.data
    base.forEach(obj => {
      bot.sendPhoto(chatId, `${obj.image}`, {
        caption: `📝 *Титул:* ${obj.title} \n 💰 *Цена:* ${obj.price} \n\n 📃 *Комментария:* ${obj.desc}`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{
              text: 'Добавить в корзину',
              callback_data: `add_to_cart_${obj._id}`
            }]
          ]
        }
      })
    })
  }

  getProd()
});

bot.on('callback_query', (query) => {
  console.log(query)
  const chatId = query.message.chat.id
  const productId = query.data.replace('add_to_cart_', '')
  let addProduct = async() => {
    let {data} = await axios.post()
  }
})


app.use(cors());
app.use('/', userApi)
app.use('/', prodApi)
app.use('/', adminApi)


app.listen(PORT, () => {
  console.log('server is running')
})