const ProductsModel = require('../models/ProductsModel')
const CategoryModel = require('../models/categoryModel')
const UserModel = require('../models/userModel');
const ProductController = {};


ProductController.createProduct = async (req, res) => {
    try {
console.log(req.usuario)
console.log(req.usuario._id)
        let { categories} = req.body
        const producto = await ProductsModel.create({...req.body,
            userId: req.usuario._id
        })
        let createNewProduct = await CategoryModel.findByIdAndUpdate(categories, {
            $push: {
                products: producto._id
            }
        }, { new: true })
        let vendedorCreaProducto = await UserModel.findByIdAndUpdate(req.usuario._id, {
            $push: {
                products: producto._id
            }
        }, { new: true })
        console.log(vendedorCreaProducto)
        console.log(createNewProduct)

        res
            .status(201)
            .json({ producto, message: '' })

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
        const productData = await ProductsModel.findById(id)
            .populate('categories')
            .populate('userId')
            .populate('commentsOfProduct.userId')

        if (!productData) {
            return res
                .status(200)
                .json({ message: 'There is no such product mmg' })
        }
        res
            .json({ productData })

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

        let { id } = req.params;
        let producto = await ProductsModel.findById(id)
        console.log(producto.userId)
        console.log(producto)
        let categoria = await CategoryModel.findByIdAndUpdate(producto.categories, {
            $pull: {
                products: producto._id
            }
        }, { new: true })
        console.log(categoria)

        let vendedor = await UserModel.findByIdAndUpdate(producto.userId, {
            $pull: {
                products: producto._id
            }
        }, { new: true })

        console.log(vendedor)
        await ProductsModel.findByIdAndDelete(req.params.id)
        res
            .json({ message: 'eliminado' })
    } catch (error) {
        console.log(console.error(error))
        res
            .status(500)
            .json({ message: 'Hubo un problema al eliminar el producto' })
    }
};

//producto por vendedor (se le pasa id vendedor)
ProductController.readProductPvendedor = async (req, res) => {
    try {

        let { id } = req.params;
        const vendedor = await UserModel.findById(id)
        console.log(vendedor)
        const productData = await ProductsModel.find({ userId: id }).populate('categories')

        if (!productData) {
            return res
                .status(200)
                .json({ message: 'no existe este producto para algún vendedor' })
        }
        res
            .json({ productData })

    }
    catch (error) {
        console.error(error)
        res
        status(500)
            .json({ message: 'problem when viewing product data' });

    }
};
//Producto por categoria (se le pasa id de categoria)
ProductController.readProductPcategoria = async (req, res) => {
    try {

        let { id } = req.params;
        const categoria = await CategoryModel.findById(id)
        console.log(categoria)
        const productData = await ProductsModel.find({ categories: id }).populate('categories')

        if (!productData) {
            return res
                .status(200)
                .json({ message: 'no existe este producto para algún categoria' })
        }
        res
            .json({ productData })

    }
    catch (error) {
        console.error(error)
        res
        status(500)
            .json({ message: 'problem when viewing product data' });

    }
};

ProductController.readProductByName = async (req, res) => {
    try {
        console.log(req.params)
        // Product.find({ name: /.*req.params.name.*/i })
        const name = new RegExp(`${req.params.name}`, 'i')
        console.log(name)
        const productoName = await ProductsModel.aggregate([{
            $match: {
                name
            }
        },])
        res
            .json({ productoName })
    } catch (error) {
        console.error(error)
        res
        status(500)
            .json({ message: 'problem when viewing product data' });

    }

};

ProductController.createComments = async (req, res) => {
    try {
        //if (req.file) req.body.image_path = req.file.filename;
        const product = await ProductsModel.findByIdAndUpdate(req.params._id, {
            $push: {
                commentsOfProduct: {
                    ...req.body, commentsDate: new Date(), userId: req.usuario._id
                }
            }
        },
            { new: true });
        res
            .json({ product });

    } catch (error) {
        console.error(error)
        res
        status(500)
            .json({ message: 'problem when viewing product data' });
    }
};

ProductController.deleteComments = async (req, res) => {
    try {
        //if (req.file) req.body.image_path = req.file.filename;
        const product = await ProductsModel.findByIdAndUpdate(req.params._id, {
            $pull: {
                commentsOfProduct: {
                    ...req.body
                }
            }
        },
            { new: true });
        res
            .json({ product });

    } catch (error) {
        console.error(error)
        res
        status(500)
            .json({ message: 'problem when viewing product data' });
    }
};

ProductController.addTowishList = async (req, res) => {
    try {
        const product = await ProductsModel.findByIdAndUpdate(req.params._id, {
             $push: {
                  wishListP: req.usuario._id 
                } 
            }, 
            { new: true });
        const usuario = await UserModel.findByIdAndUpdate(req.usuario._id, { 
            $push: { 
                 wishListU: req.params._id 
                } 
            },
             { new: true });
        console.log(usuario)
        console.log(product)
        res.json({ product })
    } catch (error) {
        console.error(error)
        res
        status(500)
            .json({ message: 'problem when add wish list' });
    }
};

ProductController.deleteTowishList= async (req, res) => {
    try {
        const product = await ProductsModel.findByIdAndUpdate(req.params._id, { 
            $pull: {
                 wishListP: req.usuario._id 
                } 
            }, 
            { new: true });
        const usuario = await UserModel.findByIdAndUpdate(req.usuario._id, { 
            $pull: { 
                wishListU: req.params._id 
            } 
        }, 
        { new: true });
        console.log(usuario)
        console.log(product)
        res.json({product});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'problem when delete wish list' })
    }
};
    module.exports = ProductController;
