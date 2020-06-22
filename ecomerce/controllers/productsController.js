const ProductsModel = require('../models/ProductsModel')
const CategoryModel = require('../models/categoryModel')
const UserModel = require('../models/userModel');
const ProductController = {};


ProductController.createProduct = async (req, res) => {
    try {
console.log(req.usuario)
console.log(req.usuario._id)
        let { categories} = req.body
        const product = await ProductsModel.create({...req.body,
            userId: req.usuario._id
        })
        let createNewProduct = await CategoryModel.findByIdAndUpdate(categories, {
            $push: {
                products: product._id
            }
        }, { new: true })
        let vendedorCreaProducto = await UserModel.findByIdAndUpdate(req.usuario._id, {
            $push: {
                products: product._id
            }
        }, { new: true })
        console.log(vendedorCreaProducto)
        console.log(createNewProduct)

        res
            .status(201)
            .json({ product, message: 'Product created' })

    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'There was a problem creating the product' })
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
                //status?
                .json({ message: 'There is no such product mmg' })
        }
        res
            .status(200)
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
            .json({ message: 'There was a problem getting the products' })
    }
};

ProductController.upadateProduct = async (req, res) => {
    try {

        let updateProduct = await ProductsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        console.log(updateProduct)
        res.json({ updateProduct, message: 'updated product' })
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'There was a problem updating the product' })

    }
};

ProductController.deleteProduct = async (req, res) => {
    try {

        let { id } = req.params;
        let product = await ProductsModel.findById(id)
        console.log(product.userId)
        console.log(product)
        let categoriesP = await CategoryModel.findByIdAndUpdate(product.categories, {
            $pull: {
                products: product._id
            }
        }, { new: true })
        console.log(categoriesP)

        let vendedor = await UserModel.findByIdAndUpdate(product.userId, {
            $pull: {
                products: product._id
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
            .json({ message: 'Hubo un problema al eliminar el product' })
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

ProductController.readProductMasVendido= async(req,res)=>{
    try {
       let masvendidos= await ProductsModel.aggregate([

        {$project:
            {
                ventas:{$size:{"$ifNull":["$orderIds",[]]} },
                _id: "$_id",
                image_path : "$image_path",
                name : "$name",
            },
          
        },
        {$match: {
            ventas: {
                $gt:0
            }
        }},
        {$sort : {ventas : -1}}, 
        {$limit : 5 },
        
    ])  

      res
            .status(200)
            .json({'vendidos': masvendidos})

    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Hubo un problema al obtener los productos' })
    }
}

ProductController.getByPriceMayorAMenor = async (req, res) => {
    try {
        let getByPrice = await ProductsModel.find().sort({price: -1})

        res
            .status(201)
            .json(getByPrice)
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Hubo un problema al obtener los productos' })
    }
};

ProductController.getByPriceMenorAMayor = async (req, res) => {
    try {
        let getByPrice = await ProductsModel.find().sort({price: 1})

        res
            .status(201)
            .json(getByPrice)
    } catch (error) {
        console.error(error)
        res
            .status(500)
            .json({ message: 'Hubo un problema al obtener los productos' })
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
