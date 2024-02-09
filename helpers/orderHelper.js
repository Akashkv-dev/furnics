const User = require("../modals/User");
const Order = require("../modals/Order");

module.exports = {
  addAddress: async (data, userid) => {
    const user = await User.findOne({ _id: userid });
    const Address = {
      name: data.name,
      phone: data.phone,
      pincode: data.pincode,
      landmark: data.landmark,
      address: data.address,
      city: data.city,
      state: data.state,
    };

    user.address.push(Address);
    await user.save();
  },
  addOrder: async (data) => {
    console.log(data);
    const result = await Order.insertMany(data);
    return result;
  },
  existAddress: async (data) => {
    console.log(data);
    console.log(data.userId);
    const result = await User.findOne({
      _id: data.userId,
      address: {
        $elemMatch: {
          name: data.address.name,
          phone: data.address.phone,
          pincode: data.address.pincode,
          landmark: data.address.landmark,
          address: data.address.address,
          city: data.address.city,
          state: data.address.state,
        },
      },
    });
    console.log("result", result);
    return result;
  },
  updatestatus: async (data, payment) => {
    console.log(data, payment);
    await Order.findOneAndUpdate(
      { orderid: data },
      {
        $set: { status: "placed", paymentid: payment },
      },
      { new: true }
    );
  },
  deleteCartorderd: async (userid) => {
    try {
      const result = await User.updateOne(
        { _id: userid },
        { $set: { cart: [] } }
      );
    } catch (error) {
      console.error("empty cart error", error);
    }
  },
  orderfinding: async (userId) => {
    const result = await Order.find({ userid: userId }).lean();
    return result;
  },
  findorder: async () => {
    const result = await Order.find().lean();
    return result;
  },

  productdetail: async (id) => {
    const findorder = await Order.findOne({ _id: id }).lean();
    const productid = findorder
      ? findorder.cart.map((item) => item.productId)
      : [];
    return productid;
  },
  confirm: async (data) => {
    const order = await Order.findById(data);
    if (order.status === "placed") {
        return await Order.findOneAndUpdate(
          { _id: data },
          { $set: { status: "Confirm" } },
          { new: true }
        );
    }
    else{
      return null; // or throw an error indicating invalid status transition

    }
},

shipped: async (data) => {
    const order = await Order.findById(data);
    if (order.status === "Confirm") {
        return await Order.findOneAndUpdate(
          { _id: data },
          { $set: { status: "Shipped" } },
          { new: true }
        );
    }
    else{
      return null; // or throw an error indicating invalid status transition

    }
},

delivered: async (data) => {
    const order = await Order.findById(data);
    if (order.status === "Shipped") {
        return await Order.findOneAndUpdate(
          { _id: data },
          { $set: { status: "Delivered" } },
          { new: true }
        );
    }
    else{
      return null; // or throw an error indicating invalid status transition

    }
},

cancelled: async (data) => {
    const order = await Order.findById(data);
    if (order.status !== "Delivered" && order.status !== "Cancelled") {
        return await Order.findOneAndUpdate(
          { _id: data },
          { $set: { status: "Cancelled" } },
          { new: true }
        );
    }
    else{
      return null; // or throw an error indicating invalid status transition

    }
}

};
