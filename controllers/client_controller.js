const Client = require("../models/client");
const Product = require("../models/tovar");
const Message = require("../models/messages");
const asyncHandler = require("express-async-handler");
const { timeBase, dateBase } = require("../config/date");
const messages = require("../models/messages");
const { generateCode } = require("../config/generateCode");

const regis = asyncHandler(async (req, res) => {
  const { chatId, name, phone_number } = req.body;
  const findClient = await Client.findOne({
    phone_number: phone_number,
  });

  if (findClient) {
    res.status(200).json({ message: "Пользователь уже регистрирован!" });
  } else {
    const newClient = new Client({
      chatId: chatId,
      name: name,
      phone_number: phone_number,
    });

    await newClient.save();
    res.status(200).json({ message: "Пользователь успешно зарегистрирован!" });
  }
});

const getUser = asyncHandler(async(req, res) => {
  const { chatId } = req.body;
  const findUser = await Client.findOne({ chatId: chatId });
  if (findUser) {
    res.status(200).json({ message: "Success!", data: findUser });
  }else{
    res.status(401).json({ message: "Пользователь не регистрирован!" });
  }
  
});

const addToCart = asyncHandler(async (req, res) => {
  const { chatId, prodId } = req.body;
  const findProd = await Product.findById({ _id: prodId });
  if (!findProd) {
    res.status(404).json({ message: "Продукт не найден!" });
  } else {
    const findClient = await Client.findOne({ chatId: chatId });
    if (!findClient) {
      res.status(401).json({ message: "Пользователь не регистрирован!" });
    } else {
      const addCart = findClient.cart.find((c) => c._id == prodId);
      if (!addCart) {
        let addProd = findClient.cart.push(findProd);
        let total = 0;
        findClient.cart.forEach((item) => {
          total += item.price;
        });
        findClient.total_price = total;
        await findClient.save();
        res.status(200).json({ message: "Успешно добавлено на корзинку чтобы оформить товары нажмите на кнопку 'Оформить'!" });
      } else {
        res.status(200).json({ message: "Этот товар уже существует на корзинке!" });
      }
    }
  }
});

const deleteFromCart = asyncHandler(async (req, res) => {
  const { chatId, prodId } = req.body;
  console.log(chatId)
  const findClient = await Client.findOne({ chatId: chatId });
  if (!findClient) {
    res.status(401).json({ message: "Пользователь не регистрирован!" });
  }

  const verifyCart = findClient.cart.find((c) => c._id == prodId);
  if (verifyCart) {
    const indexItem = findClient.cart.indexOf(verifyCart);
    if (indexItem != -1) {
      let app = findClient.cart.splice(indexItem, 1);
      console.log(app);
      let total = 0;
      findClient.cart.forEach((item) => {
        total += item.price;
      });

      console.log(findClient.cart);
      findClient.total_price = total;
      await findClient.save();
      res.status(200).json({ message: "Успешно удалено!" });
    }
  } else {
    res
      .status(404)
      .json({ message: "Товар уже удален или не перемещен на карзинку!" });
  }
});

const getMyCart = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  console.log(chatId)
  const findUser = await Client.findOne({ chatId: chatId });
  if (findUser) {
    res.status(200).json({
      message: "Успешно!",
      data: findUser.cart,
      total_price: findUser.total_price,
    });
  }else{
    res.status(404).json({ message: "Пользователь не найден!" });
  }

});

const purchase = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const findUser = await Client.findOne({ chatId: chatId });
  const findInMessageUser = await Message.findOne({ chatId: chatId });
  if (findUser) {
    const findCart = findUser.cart;
    if (findCart.length > 0) {
        let month = [
          "Yanvar",
          "Fevral",
          "Mart",
          "Aprel",
          "May",
          "Iyun",
          "Iyul",
          "Avgust",
          "Sentabr",
          "Oktabr",
          "Noyabr",
          "Dekabr",
        ];

        let date = new Date();
        let getMonth = date.getMonth();
        let fullDate = `${date.getDate()}-${month[getMonth]}`;
        let fullTime = `${date.getHours()}:${date.getMinutes()}`;

        const createMessage = new Message({
          chatId: findUser.chatId,
          user_name: findUser.name,
          phone_number: findUser.phone_number,
          total_price: findUser.total_price,
          date: fullDate,
          time: fullTime,
          code: generateCode(),
        });

        findCart.forEach((item) => {
          createMessage.message.push({
            product_name: item.title,
            product_image: item.image,
            product_price: item.price,
            product_desc: item.desc,
            date: dateBase,
            time: timeBase,
            code: generateCode(),
          });
        });

        await createMessage.save();
        let query = {
          chatId: chatId,
        };

        let updateArray = {
          $set: {
            cart: [],
            total_price: 0,
          },
        };

        let updateBase = await Client.updateOne(query, updateArray);
        (async function sendNotification() {
          // notification message
          const message = {
            to: 'ExponentPushToken[E5Z9KSHpE8M5nF0GtCqoj4]',
            sound: "default",
            title: 'New order🔔',
            body: findUser.name,
            
          };
      
          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              host: "exp.host",
              accept: "application/json",
              "accept-encoding": "gzip, deflate",
              "content-type": "application/json",
            },
            body: JSON.stringify(message),
          })
        })()
        res.status(200).json({ message: "Успешно отправлено!" });
    } else {
      res.status(200).json({ message: "У вас нет товаров на корзинке!" });
    }
  } else {
    res.status(404).json({ message: "User is not defined!" });
  }
});

const getCategorys = asyncHandler(async (req, res) => {
  const findProd = await Product.find({});
  let category = findProd.reduce((acc, cur) => {
    acc[acc.category] = true;
    return cur;
  }, {});

  let uniqueCategoriesArray = Object.keys(category);
  console.log(category)
  // res.status(200).json({ message: 'Success!', data: uniqueCategoriesArray })
});


const searchProduct = asyncHandler(async(req, res) => {
  const { prodCode } = req.body
  const findProd = await Product.findOne({ spece_code: prodCode })
  if(findProd){
    res.status(200).json({ message: 'Success!', data: findProd })
  }else{
    res.status(404).json({ message: 'Товар не найден!' })
  }
})

module.exports = {
  regis,
  getUser,
  addToCart,
  deleteFromCart,
  getMyCart,
  purchase,
  getCategorys,
  searchProduct
};
