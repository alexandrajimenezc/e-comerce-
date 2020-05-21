const CategoryModel = require('../models/categoryModel')
const CategoryController = {};



CategoryController.createCategory = async (req, res) => {
    try {
        const createCategoria = await CategoryModel.create(req.body)
        res
            .status(201)
            .json({ createCategoria, message: 'category created' })

    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'There was a problem creating a user' })
    }

};

CategoryController.getAllCategories = async (req, res) => {
    try {

        let allCategories = await CategoryModel.find().populate('products')
        res
            .status(200)
            .json({ allCategories, message: '' })
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'There was a problem getting the categories' })
    }
};

CategoryController.readCategory = async (req, res) => {
    try {

        let { id } = req.params;
        const categoryData= await CategoryModel.findById(id)
        if (!categoryData) {
        return res
        .status(200)
        .json({ message: 'There is no such category mmg' })
        }
        res
        .json({categoryData})
    
    }
    catch (error) {
        console.error(error)
         res
            status(500)
            .json({ message: 'problem when viewing category data' });
    
    }
}
CategoryController.updateCategory = async (req, res) => {
    try {
        let updateCategory = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        console.log(updateCategory)
        res
            .status(200)
            .json({ updateCategory, message: 'updated the category' })
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'there was a problem updating the category' })
        }
};

CategoryController.deleteCategory = async (req, res) => {
    try {
        await CategoryModel.findByIdAndDelete(req.params.id)
        res
            .json({ message: 'category deleted' })
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'There was a problem deleting the category' })
        }
     

};
module.exports = CategoryController;
