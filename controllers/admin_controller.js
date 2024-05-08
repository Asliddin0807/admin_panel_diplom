const Admin = require("../models/admins");
const asyncHandler = require("express-async-handler");
const { createToken, refreshToken } = require("../config/token");
const Message = require("../models/messages");
const Client = require("../models/client");
const { notificationUser } = require("../bot/bot");
const Archive = require("../models/archive_messages");

const regisAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const findAdmin = await Admin.find();
  if (findAdmin.length > 0) {
    res.status(400).json({ message: "Access closed!" });
  } else {
    const regisAdmin = new Admin({
      name: name,
      email: email,
      password: password,
    });

    let option = {
      name: regisAdmin.name,
      email: regisAdmin.email,
      token: createToken(regisAdmin._id),
    };

    await regisAdmin.save();
    res.status(200).json({ message: "Success!", data: option });
    option = {};
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await Admin.findOne({
    email: email,
    password: password,
  });

  if (findUser) {
    let option = {
      Name: findUser?.name,
      Email: findUser.email,
      Password: findUser.password,
      IsAdmin: `${findUser.isAdmin}`,
      Full_admin: `${findUser.full_Access}`,
      token: refreshToken(findUser._id),
    };

    res.status(200).json({ message: "OK", data: option });
    option = {};
  } else {
    res.status(401).json({ message: "Admin is not defined!" });
  }
});

const getAdmin = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  const findClient = await Admin.findById({ _id: id });
  console.log(findClient);
  if (findClient) {
    let option = {
      Name: findClient.name,
      Email: findClient.email,
      Password: findClient.password,
      IsAdmin: `${findClient.isAdmin}`,
      Full_admin: `${findClient.full_Access}`,
    };
    res.status(200).json({ message: "Success!", data: option });
  } else {
    res.status(401).json({ message: "Failure" });
  }
});

const addAdmins = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { id } = req.admin;

  const findUser = await Admin.findById({ _id: id });
  if (findUser) {
    const findData = await Admin.findOne({
      email: email,
    });

    if (findData) {
      res.status(404).json({ message: "Admin already exists!" });
    } else {
      const createNewAdmin = new Admin({
        name: name,
        email: email,
        password: password,
      });

      await createNewAdmin.save();
      res.status(200).json({ message: "Success!" });
    }
  } else {
    res.status(404).json({ message: "Failure" });
  }
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  const { email } = req.body;
  console.log(email);
  const findAdmin = await Admin.findById(id);
  if (findAdmin) {
    const findEmail = await Admin.findOne({ email: email });
    if (findEmail?.email == req.body.email) {
      const deleteAcc = await Admin.findOneAndDelete({ email: email });
      res.status(200).json({ message: "Success!" });
    } else {
      res.status(404).json({ message: "Admin email is not defined!" });
    }
  } else {
    res.status(404).json({ message: "Admin is not defined!" });
  }
});

const getAdmins = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  const findAcc = await Admin.findById({ _id: id });
  if (findAcc) {
    const findAdmins = await Admin.find();
    res.status(200).json({ message: "Success", data: findAdmins });
  } else {
    res.status(404).json({ message: "Admin is not defined!" });
  }
});

const getMessages = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  const findAdmin = await Admin.findById({ _id: id });
  if (!findAdmin) {
    res.status(401).json({ message: "Admin is not registred!" });
  }

  const messages = await Message.find();
  let reversedMas = messages.reverse();
  res.status(200).json({ message: "Success!", data: reversedMas });
});

const getMessageById = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  const { message_id } = req.params;
  console.log(message_id);
  const findAdmin = await Admin.findById({ _id: id });
  if (findAdmin) {
    const findMessage = await Message.findById({ _id: message_id });
    if (findMessage) {
      res.status(200).json({ message: "Success!", data: findMessage.message });
    } else {
      res.status(404).json({ message: "Failed message id" });
    }
  } else {
    res.status(401).json({ message: "Admin is not defined!" });
  }
});

const findFromCode = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  const { code } = req.body;
  const findCode = await Message.findOne({ code: code });
  if (findCode) {
    res.status(200).json({ message: "Success!", data: findCode });
  } else {
    res.status(404).json({ message: "Client is not defined!" });
  }
});

const deleteClient = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const findUser = await Client.findOne({ chatId: chatId });
  if (findUser) {
    let deleteUser = await Client.findOneAndDelete({ chatId: chatId });
    const deleteFromMessage = await Message.findOneAndDelete({
      chatId: chatId,
    });
    res.status(200).json({ message: "User success deleted!" });
  } else {
    res.status(404).json({ message: "User is not defined" });
  }
});

const deleteMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const deleteChatId = await Message.findOneAndDelete({ chatId: chatId });
  res.status(200).json({ message: "Success!", data: deleteChatId });
});

const orderUser = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const { id } = req.admin;
  let admin = await Admin.findById({ _id: id });
  if (admin) {
    let access = await Message.findOne({ chatId: chatId });
    access.isRead = true;
    await access.save();

    notificationUser(chatId, access.code);
    console.log(access._id);
    let pushArchive = new Archive({
      spaceId: access._id,
      chatId: access.chatId,
      user_name: access.user_name,
      phone_number: access.phone_number,
      date: access.date,
      time: access.time,
      code: access.code,
      message: access.message,
      total_price: access.total_price,
      isRead: access.isRead,
    });

    await pushArchive.save();
    let deleteMessage = await Message.findOneAndDelete({ chatId: chatId });
    res.status(200).json({ message: "Success uploaded product!" });
  } else {
    res.status(401).json({ message: "Admin unauthorized!" });
  }
});

//dostavka
const delivered = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  const { prodId } = req.body;
  const findAdmin = await Admin.findById({ _id: id });
  if (findAdmin) {
    const findMessage = await Archive.findOne({ "message.id": prodId });
    if (findMessage) {
      findMessage.status = "Taken"
      findMessage.message.forEach(e => {
        e.isDelevering = true
      })
      await findMessage.save();
      res.status(200).json({ message: "Success taken!" });
    } else {
      res.status(404).json({ message: "Failure!" });
    }
  } else {
    res.status(401).json({ message: "Admin unauthorized!" });
  }
});

const getArchive = asyncHandler(async (req, res) => {
  const messages = await Archive.find();
  let reversedMas = messages.reverse();
  res.status(200).json({ message: "Success!", data: reversedMas });
});

const getArchiveItems = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  const { archive_id } = req.params;

  const findAdmin = await Admin.findById({ _id: id });
  if (findAdmin) {
    const findMessage = await Archive.findById({ _id: archive_id });
    if (findMessage) {
      res.status(200).json({ message: "Success!", data: findMessage.message });
    } else {
      res.status(404).json({ message: "Failed message id" });
    }
  } else {
    res.status(401).json({ message: "Admin is not defined!" });
  }
});

module.exports = {
  regisAdmin,
  login,
  addAdmins,
  deleteAdmin,
  getAdmins,
  getMessages,
  getMessageById,
  getAdmin,
  findFromCode,
  deleteClient,
  deleteMessages,
  orderUser,
  delivered,
  getArchive,
  getArchiveItems,
};
