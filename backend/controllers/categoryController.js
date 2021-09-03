import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
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

  const count = await Category.countDocuments({ ...keyword })
  const categories = await Category.find({ ...keyword })

  res.json({ categories, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    category.status = 2;

    await category.save();
    res.json({ message: 'category removed' })
  } else {
    res.status(404)
    throw new Error('category not found')
  }
})

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const localReq = {...req.body};
  const category = new Category(localReq)

  const createdCategory = await category.save()
  res.status(201).json(createdCategory)
})

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const {
    name
  } = req.body

  const category = await Category.findById(req.params.id)

  if (category) {
    category.name = name;

    const updatedCategory = await category.save()
    res.json(updatedCategory)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

export {
  getCategories,
  deleteCategory,
  createCategory,
  updateCategory
}
