import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
        status: 1
      }
    : {status: 1}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('category')

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    product.status = 2;

    await product.save();
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const localReq = {...req.body};
  localReq.user = req.user._id;
  const product = new Product(localReq)

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    category,
    videoUrl,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.videoUrl = videoUrl
    product.price = price
    product.description = description
    product.images = images
    product.category = category

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const getProductsCustomer = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  let cats = [];
  if (req.body && req.body.categories) {
    cats = req.body.categories;
  }

  const filterData = {
    status: 1
  };

  if (req.query.keyword) {
    filterData.name = {
      $regex: req.query.keyword,
      $options: 'i',
    }
  };

  if (cats.length) {
    filterData.category = {$in: cats}
  };

  const count = await Product.countDocuments({ ...filterData })
  const products = await Product.find({ ...filterData })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('category')

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductsCustomer
}
