const ProductsModel = require('../models/ProductsModel')
const CategoryModel = require('../models/categoryModel')
const ProductController = {};

ProductController.createProduct = async (req, res) => {
    try {
        let { _id,name, price, image_path, categories } = req.body
        const producto = await ProductsModel.create({
            id:_id,
            name:name,
            price:price,
            image_path:image_path,
            categories:categories
        })
        let createNewProduct = await CategoryModel.findByIdAndUpdate(categories, {
            $pull: {
                products: producto._id
            }
        }, {
            new: true
        })
        

        console.log(createNewProduct)

        res
            .status(201)
            .json({producto, message: ''})

    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Hubo un problema al crear el producto' })
    }
};

ProductController.readProduct = async (req, res) => {
    try {

        let { id } = req.params;
        const productData= await ProductsModel.findById(id)
        if (!productData) {
        return res
        .status(200)
        .json({ message: 'There is no such product mmg' })
        }
        res
        .json({productData})
    
    }
    catch (error) {
        console.error(error)
         res
            status(500)
            .json({ message: 'problem when viewing product data' });
    
    }
};




ProductController.getAllProducts = async (req, res) => {
    try {
            let getAllProducts = await ProductsModel.find().populate('categories')

            res
                .status(201)
                .json(getAllProducts)
    } catch (error) {
            console.error(error)
            res
                .status(500)
                .json({ message: 'Hubo un problema al obtener los productos' })
    }
};

ProductController.upadateProduct = async (req, res) => {
    try {

        let updateProduct = await ProductsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        console.log(updateProduct)
        res.json({ updateProduct, message: 'actualizado el producto' })
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Hubo un problema al actualizar el producto' })

    }
};

ProductController.deleteProduct = async (req, res) => {
    try {
        await ProductsModel.findByIdAndDelete(req.params.id)
        res
            .json({ message: 'eliminado' })
    } catch (error) {
        console.log(console.error(error))
        res
            .status(500)
            .json({ message: 'Hubo un problema al eliminar el producto' })
    }
}


ProductController.borratodo = async (req, res) => {
    try {
        ProductsModel.deleteMany()

    } catch (error) {
        console.log(console.error(error))
        res
            .status(500)
            .json({ message: 'Hubo un problema al eliminar todos los producto' })
    }
};
module.exports = ProductController;
