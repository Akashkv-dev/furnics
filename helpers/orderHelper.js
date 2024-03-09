const User = require("../modals/User");
const Order = require("../modals/Order");
const Product =require("../modals/Products")

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
      const user =await User.findOne({_id:userid})
      const cart = user.cart;
        if (!cart || cart.length === 0) {
            throw new Error("Cart is empty");
        }
      for (const item of cart) {
        const proid = item.productId;
        const orderedqty = item.quantity;

        await Product.findOneAndUpdate(
            { _id: proid },
            { $inc: { quantity: -orderedqty } }
        );
    }
      const result = await User.updateOne(
        { _id: userid },
        { $set: { cart: [] } }
      );
    } catch (error) {
      console.error("empty cart error", error);
    }
  },
  orderfinding: async (userId) => {
    const result = await Order.find({
        userid: userId,
        status: { $ne: 'pending' }
    }).lean(); // Using lean() to return plain JavaScript objects
    
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
},
// filterorder: async (low, high)=>{
//   const orders = await Order.find({totalprice: {$gt: low, $lt: high}}).populate('orderid').lean()
//   return orders;
// },

// filterOrderType: async (payType)=>{
//   const orders = await Order.find({paymentmethod: payType}).populate('orderid').lean()
//     return orders;
// },
// filterOrderStatus: async (status1)=>{
//   const orders = await Order.find({status: status1}).populate('orderid').lean()
//     return orders;
// },
filterOrders: async (filters) => {
 const orders =await Order.find(filters).populate('orderid').lean();
  return orders;
},
totalsum: async ()=>{
  const result = await Order.aggregate([
    {
        $group: {
            _id: null,
            totalSum: { $sum: "$totalprice" }
        }
    }
]);
const totalSum = result.length > 0 ? result[0].totalSum : 0;
return totalSum;
},
monthlysum: async (thirtyDaysAgo)=>{
  const result = await Order.aggregate([
    {
        $match: {
            orderdate: { $gte: thirtyDaysAgo }
        }
    },
    {
        $group: {
            _id: null,
            totalSum: { $sum: "$totalprice" }
        }
    }
]);
const sum = result.length > 0 ? result[0].totalSum : 0;
return sum;
},
totalOD:async ()=>{
  const result = await Order.aggregate([
    {
        $group: {
            _id: null,
            totalOrders: { $sum: 1 }
        }
    }
]);
const totalOrders = result.length > 0 ? result[0].totalOrders : 0;
return totalOrders;
},
deliveredOD:async ()=>{
  const result =await Order.aggregate([
    {
      $match:{
        status: "Delivered"
      }
    },
    {
      $group:{
        _id:null,
        count:{$sum: 1 }
      }
    }
    
  ]);
  const deliveredOD = result.length > 0 ? result[0].count : 0;
  return deliveredOD;
},
placedOD:async ()=>{
  const result =await Order.aggregate([
    {
      $match:{
        status:"placed"
      }
    },
      {
        $group:{
          _id:null,
          count:{$sum:1}
        }
      }
    
  ])
  const placedOD = result.length > 0 ? result[0].count : 0;
  return placedOD
},
cancelledOD:async()=>{
  const result = await Order.aggregate([
    {
      $match:{
        status:"Cancelled"
      }
    },
    {
      $group:{
        _id:null,
        count:{$sum:1}
      }
    }
  ])
  const cancelledOD = result.length > 0 ? result[0].count : 0;
  return cancelledOD;

},
monthtotal: async () => {
  try {
    const result = await Order.aggregate ([
      {
        $group: {
          _id: {
            year: { $year: "$orderdate" },
            month: { $month: "$orderdate" }
          },
          totalMonthlyPrice: { $sum: "$totalprice" }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalMonthlyPrice: 1
        }
      },
      {
        $sort: {
          year: 1,
          month: 1
        }
      }
    ]);


    // Create an array of all months (1-12)
    const allMonths = [...Array(12).keys()].map(month => month + 1);

    // Create an array to hold the final result
    const finalResult = allMonths.map(month => {
      const monthData = result.find(item => item.month === month);
      return monthData ? monthData : { month, totalMonthlyPrice: 0 };
    });

    return finalResult;
  } catch (error) {
    console.error("Error occurred while fetching month totals:", error);
    throw error;
  }
}

};
