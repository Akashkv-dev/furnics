const User = require("../modals/User");
const Trash = require("../modals/Trash");
const Wishlist = require("../modals/Wishlist");

module.exports = {
  validUser: async (data) => {
    var result = await User.findOne({ email: data }).lean();
    return result;
  },
  existUser: async (Email, Phone) => {
    var result = await User.findOne({
      $or: [{ email: Email }, { phone: Phone }],
    });
    return result;
  },
  alluser: async () => {
    const result = await User.find({ role: "user" }).lean();
    return result;
  },
  findedituserbyid: async (data) => {
    const result = await User.findOne({ _id: data }).lean();
    return result;
  },
  insertupdate: async (data, productid) => {
    const result = await User.updateOne(
      { _id: productid },
      {
        $set: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
      }
    );
    return result;
  },
  insertData: async (data) => {
    var result = await User.insertMany(data);
    return result;
  },
  findUser: async (data) => {
    var result = await User.findById(data);
    return result;
  },
  // existingItem:async (data)=>{
  //     var result =await User.findOne({'cart.productId':data})
  //     return result;
  // },
  pushTOcart: async (data, userid) => {
    const user = await User.findOne({ _id: userid });
    const productID = data.productid;
    const quantity = data.quantity;
    const price = data.price;

    const existingItemIndex = user.cart.findIndex(
      (cartItem) =>
        cartItem.productId && cartItem.productId.toString() === productID
    );
    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += 1;
    } else {
      user.cart.push({ productId: productID, quantity, price });
    }

    var result = await user.save();
    return result;
  },
  pushMultipleToCart: async (cartItems, userId) => {
    console.log("cartitems", cartItems);
    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            console.error("User not found");
            return;
        }

        cartItems.forEach(async (cartItem) => {
            const { productId, quantity, price } = cartItem;
            console.log("productid",productId);
            const existingItemIndex = user.cart.findIndex(
                (cartItem) => cartItem.productId.toString() === productId
            );

            if (existingItemIndex !== -1) {
                // If item already exists in cart, update quantity
                user.cart[existingItemIndex].quantity += 1;
            } else {
                // If item does not exist in cart, push new item
                user.cart.push({ productId, quantity, price });
            }
        });

        const result = await user.save();
        return result;
    } catch (error) {
        console.error("Error adding items to cart:", error);
        throw error;
    }
}


,
  findProduct: async (data) => {
    var cart = await User.findOne({ _id: data })
      .populate({ path: "cart.productId", model: "products" })
      .lean();

    if (cart.cart) {
      let totalPrice = 0;
      let totalsum;
      for (const cartItem of cart.cart) {
        if (cartItem.productId && cartItem.productId.price) {
          totalPrice += cartItem.quantity * cartItem.productId.price;
          totalsum = totalPrice + 5;
        }
      }
      return { cart, totalPrice, totalsum };
    } else {
      return { cart };
    }
  },
  updateCartInc: async (userid, productId, stock) => {
    const user = await User.findOne({
      _id: userid,
      "cart.productId": productId,
    });

    if (user) {
      const foundProduct = user.cart.find(
        (item) => item.productId.toString() === productId
      );

      if (foundProduct) {
        const currentQuantity = foundProduct.quantity;
        const availableStock = stock;

        if (currentQuantity < availableStock) {
          const remainingStock = availableStock - currentQuantity;
          const incrementQuantity = Math.min(1, remainingStock);

          const updatedUser = await User.findOneAndUpdate(
            { _id: userid, "cart.productId": productId },
            { $inc: { "cart.$.quantity": incrementQuantity } },
            { new: true }
          );

          console.log(updatedUser);
          console.log("Cart quantity incremented successfully");

          return updatedUser.cart.find(
            (item) => item.productId.toString() === productId
          ).quantity;
        } else {
          console.log(
            "Cannot increment cart quantity, reached maximum stock limit"
          );
          return currentQuantity;
        }
      }
    }
  },
  updateCartDec: async (userid, productId) => {
    // Find the user
    const user = await User.findOne({
      _id: userid,
      "cart.productId": productId,
    });
    // { $inc: { 'cart.$.quantity': -1 } },
    // { new: true })

    if (user) {
      console.log("sdfsfs", user);
      const foundProduct = user.cart.find(
        (item) => item.productId.toString() == productId
      );

      if (foundProduct) {
        // update the quantity
        let updatedQuantity = foundProduct.quantity - 1;

        if (updatedQuantity < 1) {
          updatedQuantity = 1;
        }

        // update the quantity in DB

        const updatedUser = await User.updateOne(
          { _id: userid, "cart.productId": productId },
          { $set: { "cart.$.quantity": updatedQuantity } }
        );

        // console.log(updatedQuantity);
        console.log("Cart quantity decremented successfully");

        return updatedQuantity;
      }
    } else {
      return 1;

      // console.log("cart is 0");;
    }
  },
  updateUserCart: async (userId, productId, updatedPrice) => {
    try {
      // Find the user by userId
      const user = await User.findById(userId);

      // Find the index of the product in the user's cart
      const productIndex = user.cart.findIndex(
        (item) => item.productId == productId
      );

      // If the product is found, update the price
      if (productIndex !== -1) {
        user.cart[productIndex].price = updatedPrice;
      } else {
        // If the product is not found, you might want to handle this case accordingly
        console.error("Product not found in the user's cart");
        return;
      }

      // Save the updated user document
      await user.save();

      console.log("User cart price updated successfully");
    } catch (error) {
      console.error("Error updating user cart price", error);
      throw error;
    }
  },
  removeItem: async (userid, productId) => {
    try {
      // Find the user
      const user = await User.findById(userid);
      console.log("user:", user);

      // Remove the product from the cart
      const updatedCart = user.cart.filter(
        (item) => item.productId.toString() !== productId
      );
      console.log("updatedCart", updatedCart);
      // Update the user's cart
      user.cart = updatedCart;
      await user.save();

      return updatedCart;
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  },
  insertdelete: async (data) => {
    const result = await Trash.insertMany(data);
    return result;
  },
  delete: async (data) => {
    await User.deleteOne({ _id: data });
  },
  verified: async (data) => {
    await User.updateOne({ _id: data }, { $set: { verification: true } });
  },
  gmail: async (email, name) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPW,
      },
    });
    var mailOptions = {
      from: "akashkv11@gmail.com",
      to: email,
      subject: "Welcome " + name,
      text: "Enjoy Your Shopping ",
    };
    transporter.sendMail(mailOptions, function (error, info) {});
  },
  forgotpassword: async (email1, password1) => {
    await User.updateOne({ email: email1 }, { $set: { password: password1 } });
  },
  otpfaileddelete: async (data) => {
    await User.findOneAndDelete({ phone: data });
  },
  findwishlist: async (userId, productId) => {
    const result = await Wishlist.findOne({
      user: userId,
      products: productId,
    });
    return result;
  },
  removeItemfromWishlist: async (userId, productId) => {
    const result = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true }
    );
  },
  findwishlistUser: async (userId) => {
    const result = await Wishlist.findOne({ user: userId });
    return result;
  },
  createemptyWishlist: (userId) => {
    const result = new Wishlist({
      user: userId,
      products: [],
    });
    return result;
  },
  findingwishlistProducts: async (userId) => {
    const result = await Wishlist.findOne({ user: userId })
      .populate({ path: "products", model: "products" })
      .lean();
    return result;
  },
  updateUsercoupon: async (userId, couponcode) => {
    console.log(userId);
    const result = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          couponCode: couponcode,
          coupon: "applied",
        },
      },
      { new: true }
    );
    console.log(result);
  },
  updateSuccesscoupon: async (userId) => {
    console.log(userId);
    const result = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          coupon: "redeemed",
        },
      },
      { new: true }
    );
  },
  removeUpdate: async (userId) => {
    const result = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          couponCode: "null",
          coupon: "null",
        },
      },
      { new: true }
    );
    console.log(result);
  },
  searchuser: async (data) => {
    try {
      const result = await User.find({
        name: { $regex: `^${data}`, $options: "i" },
      }).lean();
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};
