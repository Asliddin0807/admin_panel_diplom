const TelegramBot = require("node-telegram-bot-api");
const token = "7144167777:AAG5hpfbyhF5LL9qFDf3JPt1t2PfIs74H7Y";
const bot = new TelegramBot(token, { polling: true });
const { default: axios } = require("axios");

let baseUrl = "https://admin-panel-diplom.onrender.com";

let createdBot = () => {
  bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
  });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    let datas = {
      chatId: chatId,
    };

    let apiFunction = async () => {
      try {
        let { data } = await axios.post(`${baseUrl}/get_user`, datas);
        const options = {
          reply_markup: JSON.stringify({
            keyboard: [
              [{ text: "Товары" }, { text: "Категория" }],
              [{ text: "Мои товары" }, { text: "Оформить" }],
              [{ text: "Моя информация" }, { text: "Поиск" }],
            ],
          }),
        };

        bot.sendMessage(chatId, "Пожалуйста выберите пункты:", options);
      } catch (err) {
        if (err.response.status == 401) {
          const options = {
            reply_markup: JSON.stringify({
              keyboard: [[{ text: "Регистрация", request_contact: true }]],
              resize_keyboard: true,
            }),
          };
          bot.sendMessage(chatId, "Пожалуйста зарегистрируйтесь!", options);
        }
      }
    };

    apiFunction();
  });

  bot.on("polling_error", (err) => {
    console.log(err);
  });

  bot.on("contact", (msg) => {
    let chatId = msg.chat.id;
    let apiFunctins = async () => {
      let str = chatId;
      let response = await axios.post(`${baseUrl}/regis`, {
        chatId: str,
        name: msg.chat.username,
        phone_number: msg.contact.phone_number,
      });

      if (response.status == 200) {
        const options = {
          reply_markup: JSON.stringify({
            keyboard: [
              [{ text: "Товары" }, { text: "Категория" }],
              [{ text: "Мои товары" }, { text: "Оформить" }],
              [{ text: "Моя информация" }, { text: "Поиск" }],
            ],
          }),
        };

        bot.sendMessage(chatId, "Пожалуйста выберите пункты:", options);
      }
    };
    apiFunctins();
  });

  bot.on("message", (msg) => {
    let chatId = msg.chat.id;
    if (msg.text == "Мои товары") {
      let str = chatId.toString();
      console.log(typeof str);
      let myCart = async () => {
        let { data } = await axios.post(`${baseUrl}/get_my_cart`, {
          chatId: chatId,
        });

        let database = data.data;
        if (database.length == 0) {
          bot.sendMessage(chatId, "У вас нет добавленных товаров!");
        }
        database.forEach((obj) => {
          bot.sendPhoto(chatId, `${obj.image}`, {
            caption: `📝 *Называния:* ${obj.title} \n 💰 *Цена:* ${obj.price} \n\n 📃 *Комментария:* ${obj.desc}`,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Удалить из корзинки",
                    callback_data: `delete_${obj._id}`,
                  },
                ],
              ],
            },
          });
        });
        setTimeout(() => {
          bot.sendMessage(
            chatId,
            "Общая сумма товаров " + data.total_price + " сумм"
          );
        }, 2000);
      };

      myCart();
    }

    let datas = {
      chatId: chatId,
    };

    if (msg.text == "Моя информация") {
      const getMyInfo = async () => {
        let { data } = await axios.post(`${baseUrl}/get_user`, datas);
        let base = data.data;
        bot.sendMessage(
          chatId,
          `Общая информация о пользователя: \n id: ${base.chatId} \n Имя пользователя: ${base.name} \n Телефон номер: ${base.phone_number} \n Корзинке товаров: ${base.cart.length}`
        );
      };

      getMyInfo();
    }
  });

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === "Товары") {
      let getProd = async () => {
        let { data } = await axios.get(`${baseUrl}/get_product`);
        let base = data.data;
        base.forEach((obj) => {
          bot.sendPhoto(chatId, `${obj.image}`, {
            caption: `📝 *Титул:* ${obj.title} \n 💰 *Цена:* ${obj.price} \n\n 📃 *Комментария:* ${obj.desc}`,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Добавить в корзину",
                    callback_data: `add_to_cart_${obj._id}`,
                  },
                ],
              ],
            },
          });
        });
      };
      getProd();
    }
    if (msg.text === "Категория") {
      let applications = async () => {
        let { data } = await axios.get(`${baseUrl}/get_product`);
        let base = data.data;
        const uniqueCategories = [
          ...new Set(base.map((item) => item.category)),
        ];
        const inlineKeyboard = uniqueCategories.map((category) => [
          { text: category, callback_data: category },
        ]);
        bot.sendMessage(chatId, "Выберите категорию: ", {
          reply_markup: {
            inline_keyboard: inlineKeyboard,
          },
        });
      };
      applications();
    }
  });

  bot.on("callback_query", (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    console.log(callbackQuery.data);
    let getProd = async () => {
      let { data } = await axios.post(`${baseUrl}/category`, {
        category: callbackQuery.data,
      });
      let base = data.data;

      base.forEach((obj) => {
        bot.sendPhoto(chatId, `${obj.image}`, {
          caption: `📝 *Титул:* ${obj.title} \n 💰 *Цена:* ${obj.price} \n\n 📃 *Комментария:* ${obj.desc}`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Добавить в корзину",
                  callback_data: `add_to_cart_${obj._id}`,
                },
              ],
            ],
          },
        });
      });
    };

    getProd();
  });

  bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    if (query.data.includes("add_to_cart_")) {
      const productId = query.data.replace("add_to_cart_", "");
      let addProduct = async () => {
        let str = chatId;
        let { data } = await axios.post(`${baseUrl}/add_to_cart`, {
          chatId: str,
          prodId: productId,
        });
        bot.sendMessage(chatId, data.message);
      };

      addProduct();
    }
    if (query.data.includes("delete_")) {
      let prodId = query.data.replace("delete_", "");
      console.log(prodId);
      let deleteFromCart = async () => {
        try {
          let { data } = await axios.post(`${baseUrl}/delete_from_cart`, {
            chatId: chatId,
            prodId: prodId,
          });
          bot.sendMessage(chatId, data.message);
        } catch (err) {
          console.log(err.response.data.message);
          bot.sendMessage(chatId, err.response.data.message);
        }
      };

      deleteFromCart();
    }
  });

  bot.on("message", (msg) => {
    let chatId = msg.chat.id;
    if (msg.text == "Оформить") {
      let purchase = async () => {
        let { data } = await axios.post(`${baseUrl}/purchase`, {
          chatId: chatId,
        });
        console.log(data);
        bot.sendMessage(chatId, data.message);
      };
      purchase();
    }
  });

  bot.on("message", (msg) => {
    if (msg.text == "Поиск") {
      bot.sendMessage(msg.chat.id, "Введите код продукта!");
    }
  });

  // bot.on("message", (msg) => {
  //   let chatId = msg.chat.id;
  //   let parseNumber = parseInt(msg.text);
  //   if (typeof parseNumber == "number") {
  //     let apiHandler = async () => {
  //       try {
  //         let { data } = await axios.post(`${baseUrl}/search`, {
  //           prodCode: parseNumber,
  //         });
  //         console.log(true, data);
  //         let obj = data.data
  //         bot.sendPhoto(chatId, `${obj.image}`, {
  //           caption: `📝 *Титул:* ${obj.title} \n 💰 *Цена:* ${obj.price} \n\n 📃 *Комментария:* ${obj.desc}`,
  //           parse_mode: "Markdown",
  //           reply_markup: {
  //             inline_keyboard: [
  //               [
  //                 {
  //                   text: "Добавить в корзину",
  //                   callback_data: `add_to_cart_${obj._id}`,
  //                 },
  //               ],
  //             ],
  //           },
  //         });
  //       } catch (err) {
  //         bot.sendMessage(chatId, err.response.data)
  //       }
  //     };

  //     apiHandler();
  //   }
  // });
};

let notificationUser = async (id, code) => { 
  bot.sendMessage(id, "Ваш заказ приехал!");
  setTimeout(() => {
    bot.sendMessage(id, "Ваш код " + code);
  }, 2000);
};

module.exports = { createdBot, notificationUser };
