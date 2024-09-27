import ProductModel from '../models/ProductModel.js';

class ProductController {

  // Get all products
  static getData = async (req, res) => {
    try {
      const result = await ProductModel.find();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Add a new product
  static addData = async (req, res) => {
    try {
      const { name, description, price,     weight, stock } = req.body;
      const imageUrls = req.file.filename; 
      const product = new ProductModel({
        name,
        description,
        price,
        weight,
        stock,
        image:imageUrls
      });

      await product.save();
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

// Update a product by ID
static updateData = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price,    weight, stock } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = req.file.filename;
    }

    // Create update object
    const updateFields = {
      name,
      description,
      price,
      weight,
      stock
    };

    if (imageUrl) {
      updateFields.image = imageUrl;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true, runValidators: true } // Added runValidators for validation
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  // View a single product by ID
  static viewSingleData = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await ProductModel.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        // Only update the stock field of the product
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { stock },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", user: updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

  // Delete a product by ID
  static deleteData = async (req, res) => {
    try {
      const productId = req.params.id;
  
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default ProductController;
