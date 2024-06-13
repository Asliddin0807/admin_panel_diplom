const Product = require("../models/tovar");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/admins");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const multer = require("multer");
const { generateCode } = require("../config/generateCode");

const addProduct = asyncHandler(async (req, res) => {
  const { title, price, desc, category, numbers } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "Изображение не найдено" });
  }

  let resultesss = price.replace(/,/g, '');
  let tap = parseFloat(resultesss);

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  const result = await cloudinary.uploader.upload(req.file.path);

  const createProduct = new Product({
    title: title,
    price: tap,
    image: result.secure_url,
    desc: desc,
    category: category,
    numbers: numbers,
    spece_code: generateCode()
  });

  await createProduct.save();
  res.status(200).json({ message: "Success!" });
});

//for users
const getProducts = asyncHandler(async (req, res) => {
  const findProduct = await Product.find();
  res.status(200).json({ message: "Success!", data: findProduct });
});

//for admin panel
const deleteProduct = asyncHandler(async (req, res) => {
  const { prod_id } = req.body;
  const { id } = req.admin;
  console.log(true, prod_id)
  const findAdmin = await Admin.findById({ _id: id });
  if (!findAdmin) {
    res.status(404).json({ message: "Failure" });
  } else {
    const findProduct = await Product.findById({ _id: prod_id });
    if (findProduct) {
      const deleteItem = await Product.findByIdAndDelete({ _id: prod_id });
      await deleteItem.save();
      res.status(200).json({ message: "Товар удален!" });
    } else {
      res.status(404).json({ message: "Продукт не найден!" });
    }
  }
});

//for admins
const updateProd = asyncHandler(async (req, res) => {
  const { prod_id } = req.params;
  const { id } = req.admin;
  const { image, price, title, viewers, numbers, desc, category } = req.body;
  const findAdmin = await Admin({ _id: id });
  if (!findAdmin) {
    res.status(404).json({ message: "Admin is not defined!" });
  }

  const findProd = await Product.findByIdAndUpdate(
    {
      _id: prod_id,
    },
    {
      image: image,
      price: price,
      title: title,
      viewers: viewers,
      numbers: numbers,
      desc: desc,
      category: category,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ message: "Success!" });
});

const getProductByCateg = asyncHandler(async (req, res) => {
  const { category } = req.body;
  console.log(category)
  const findProd = await Product.find({});
  if (findProd) {
    let base = findProd.filter(item => item.category == category)
    res.status(200).json({ message: "Success!", data: base });
  } else {
    res.status(404).json({ message: "Failed!" });
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.body;
  console.log(id);
  const findProd = await Product.findById({ _id: id });
  console.log(findProd);
  if (findProd) {
    res.status(200).json({ message: "Success!", data: findProd });
  } else res.status(404).json({ message: "Product is not defined!" });
});

module.exports = {
  addProduct,
  getProducts,
  deleteProduct,
  updateProd,
  getProductByCateg,
  getProductById,
};
