import AllProduct from "../models/allproductmodels.js";
import carditems from "../models/carditems.js";
import orderedItems from "../models/orderedItems.js";
import { producer } from "../config/kafkaClient.js";
export const Postallproduct = async (req, res) => {
    try {
        const { name, description, price, image, category, subCategory, sizes } = req.body;

        if (!name || !description || !price || !image || !category || !subCategory || !sizes) {
            return res.status(400).json({ message: "Data Missing" });
        }

        const newProduct = new AllProduct({
            name, description, price, image, category, subCategory, sizes
        });

        await newProduct.save();

        res.status(200).json({ message: "Product created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Problem in backend", error: err.message });
    }
};

export const categories = async (req, res) => {
    try {
        const { category } = req.params;
       console.log(category)
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const findCategory = await AllProduct.find({category:category});

        if (findCategory.length === 0) {
            return res.status(404).json({ message: "No products found in this category" });
        }

        res.status(200).json(findCategory);
    } catch (err) {
        res.status(500).json({ message: "Backend Error", error: err.message });
    }
   
};

export const getallproduct = async(req,res)=>{
    try{ const getproducts = await AllProduct.find()
    if(!getproducts){
        res.status(404).json({message:"Products not found"})
    }
    res.status(200).json(getproducts)}catch (err) {
        res.status(500).json({ message: "Backend Error", error: err.message });
    }
}

export const getproductbyid = async(req,res)=>{
         const {id}=req.params;
         if(!id){
             res.status(404).json({message:"Products not id found"})
         }try{
         const findproductbyid = await AllProduct.findById(id)
         if(!findproductbyid){
              res.status(404).json({message:"Products not found"})
         }
         console.log(findproductbyid.category)
         const Relatedproducts = findproductbyid.category
         const getrelatedproducts = await AllProduct.find({Relatedproducts})
         console.log(getrelatedproducts)
         res.status(200).json({product: findproductbyid,
            related: getrelatedproducts}) 
         }catch (err) {
        res.status(500).json({ message: "Backend Error", error: err.message });
    }       
}

export const addcartproduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ message: "Product ID not found" });
  }

  try {
    const addcart = await AllProduct.findById(id);
    if (!addcart) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingCartItem = await carditems.findOne({ id: addcart._id });
    if (existingCartItem) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    const storeid = new carditems({
      id: addcart._id,
      price: addcart.price,
      total: addcart.price 
    });

    await storeid.save();
    res.status(200).json({ message: "Cart item created successfully" });

  } catch (err) {
    res.status(500).json({ message: "Backend Error", error: err.message });
  }
};

export const getcartproduct = async (req, res) => {
  try {
    const cartItems = await carditems.find();

    if (!cartItems.length) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    const productIds = cartItems.map(item => item.id);
    const products = await AllProduct.find({ _id: { $in: productIds } });

    let grandTotal = 0;

    const cartDetails = cartItems.map(item => {
      const product = products.find(p => p._id.toString() === item.id.toString());
      const quantity = item.quantity || 1;
      grandTotal += quantity * item.price;

      return {
        ...product._doc,
        quantity: quantity
        // Exclude individual total here if not needed
      };
    });

    res.status(200).json({ cartItems: cartDetails, totalAmount: grandTotal });

  } catch (err) {
    res.status(500).json({ message: "Backend Error", error: err.message });
  }
};



export const increaseCartItemQuantity = async (req, res) => {
  const { id } = req.params;

  try {
    const cartItem = await carditems.findOne({ id });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity += 1;
    cartItem.total = cartItem.quantity * cartItem.price;

    await cartItem.save();

    res.status(200).json({ message: 'Quantity increased', cartItem });
  } catch (err) {
    res.status(500).json({ message: 'Backend Error', error: err.message });
  }
};




export const decreaseCartItemQuantity = async (req, res) => {
  const { id } = req.params;

  try {
    const cartItem = await carditems.findOne({ id });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cartItem.total = cartItem.quantity * cartItem.price;
      await cartItem.save();
      res.status(200).json({ message: 'Quantity decreased', cartItem });
    } else {
      await carditems.deleteOne({ id });
      res.status(200).json({ message: 'Item removed from cart' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Backend Error', error: err.message });
  }
};


export const placeoder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      size,
      first_name,
      last_name,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phonenumber,
    } = req.body;

    if (!id) {
      return res.status(404).json({ message: "Product ID missing" });
    }

    const findproduct = await AllProduct.findById(id);
    if (!findproduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const saveorders = new orderedItems({
      OrderItemId: findproduct._id,
      size,
      first_name,
      last_name,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phonenumber,
      createdAt: new Date(),
    });

    await saveorders.save();

    // Connect & send Kafka message
    await producer.connect();
    await producer.send({
      topic: 'order-topic',
      messages: [
        {
          key: id,
          value: JSON.stringify({
            orderId: saveorders._id,
            product: findproduct.name,
            customer: `${first_name} ${last_name}`,
            createdAt: new Date(),
          }),
        },
      ],
    });
    await producer.disconnect();

    res.status(200).json(saveorders);
  } catch (err) {
    res.status(500).json({ message: "Backend Error", error: err.message });
  }
};

export const getplacedorder = async(req,res)=>{
    try{
    const findplacedorder = await orderedItems.find()
    if(!findplacedorder){
        res.status(404).json({message:"Order a product"})
    }
    res.status(200).json(findplacedorder)
    }catch(err){
        res.status(500).json({ message: "Backend Error", error: err.message });
    }
};

export const getProductByCategorySorted = async(req,res)=>{
  try{
    const {category}=req.params;
    const {sort}=req.query;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    let sortOrder = 1;
    if(sort == 'desc'){
      sortOrder=-1
    }
    const products = await AllProduct.find({category}).sort({price:sortOrder});
    if(products.length === 0){
      return res.status(404).json({message:"No products found in this category"})
    }
    res.status(200).json(products)
  }catch (err) {
    res.status(500).json({ message: "Backend Error", error: err.message });
  }
}