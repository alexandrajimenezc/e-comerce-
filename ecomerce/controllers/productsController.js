const ProductsModel = require('../models/ProductsModel')
const CategoryModel = require('../models/categoryModel')
const UserModel = require('../models/userModel');
const ProductController = {};

//Falta que solo tenga acceso el role: admin o vendedor, y el usuario solo pueda ver
// falta productos por vendedor
//falta roductos por categoria
ProductController.createProduct = async (req, res) => {
    try {

        let { _id,name,description, price, image_path, categories,stock,userId} = req.body
        const producto = await ProductsModel.create({
            id:_id,
            name:name,
            description:description,
            price:price,
            image_path:image_path,
            categories:categories,
            stock:stock,
            userId: userId
        })
        let createNewProduct = await CategoryModel.findByIdAndUpdate(categories, {
            $push: {
                products: producto._id
            }
        }, {new: true})
        let vendedorCreaProducto = await UserModel.findByIdAndUpdate(userId,{
            $push: {
                products: producto._id
            }
        },{new: true})
        console.log(vendedorCreaProducto)
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
        const productData= await ProductsModel.findById(id).populate('categories')
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

        let { id } = req.params;
        let producto = await ProductsModel.findById(id)
        console.log(producto.userId)
        console.log(producto)
        let categoria = await CategoryModel.findByIdAndUpdate(producto.categories, {
            $pull: {
                products: producto._id
            }
        }, {new: true})
        console.log(categoria)

         let vendedor = await UserModel.findByIdAndUpdate(producto.userId,{
            $pull:{
                products:producto._id
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
}

//producto por vendedor (se le pasa id vendedor)
ProductController.readProductPvendedor = async (req, res) => {
    try {

        let { id } = req.params;
       const vendedor = await UserModel.findById(id)
       console.log(vendedor)
        const productData= await ProductsModel.find({userId: id}).populate('categories')
  
        if (!productData) {
        return res
        .status(200)
        .json({ message: 'no existe este producto para algún vendedor' })
        }
        res
        .json({productData })
    
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
        const productData= await ProductsModel.find({categories: id}).populate('categories')
  
        if (!productData) {
        return res
        .status(200)
        .json({ message: 'no existe este producto para algún categoria' })
        }
        res
        .json({productData })
    
    } 
    catch (error) {
        console.error(error)
         res
            status(500)
            .json({ message: 'problem when viewing product data' });
    
    }
};


/* ProductController.borratodo = async (req, res) => {
    try {
        ProductsModel.deleteMany()

    } catch (error) {
        console.log(console.error(error))
        res
            .status(500)
            .json({ message: 'Hubo un problema al eliminar todos los producto' })
    }
}; */
module.exports = ProductController;
