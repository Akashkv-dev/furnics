const User = require('../modals/User')

module.exports = {
    validUser: async (data) => {
        var result = await User.findOne({ email: data }).lean()
        return result;
    },
    insertData: async (data) => {
        var result = await User.insertMany(data)
        return result;
    },
    findUser: async (data) => {
        var result = await User.findById(data)
        return result;
    },
    // existingItem:async (data)=>{
    //     var result =await User.findOne({'cart.productId':data})
    //     return result;
    // },
    pushTOcart: async (data, userid) => {
        const user = await User.findOne({ _id: userid })
        const productID = data.productid
        const quantity = data.quantity

        const existingItemIndex = user.cart.findIndex(
            (cartItem) => cartItem.productId && cartItem.productId.toString() === productID)
        if (existingItemIndex !== -1) {
            user.cart[existingItemIndex].quantity += 1
        }
        else {
            user.cart.push({ productId: productID, quantity });


        }

        var result = await user.save();
        return result;

    },
    findProduct: async (data) => {
        var result = await User.findOne({ _id: data }).populate({ path: 'cart.productId', model: 'products' }).lean()
        console.log('found product');
        console.log(result.cart[0].productId);
        console.log('price:',result.cart[0].productId.price);

        

        return result
    },
    updateCartInc: async (userid, productId) => {
        const user = await User.findOneAndUpdate(
            { _id: userid, 'cart.productId': productId },
            { $inc: { 'cart.$.quantity': 1 } },
            { new: true })

            console.log(user);

        const foundProduct = user.cart.find(item => item.productId.toString() == productId);

        if (foundProduct) {
            
            const updatedQuantity = foundProduct.quantity;
            console.log(updatedQuantity);
            console.log('Cart quantity incremented successfully');

            return updatedQuantity;
        }


    },
    updateCartDec:async (userid,productId)=>{
        // Find the user
       const user = await User.findOne(
            { _id: userid, 'cart.productId': productId })
            // { $inc: { 'cart.$.quantity': -1 } },
            // { new: true })

            if(user){
                console.log('sdfsfs',user);
            const foundProduct = user.cart.find(item => item.productId.toString() == productId);


            if (foundProduct) {
                // update the quantity 
                let updatedQuantity = foundProduct.quantity -1;

                if(updatedQuantity <1){

                    updatedQuantity =1

                }

                // update the quantity in DB

                const updatedUser =await User.updateOne(
                    {_id:userid,'cart.productId':productId},
                    {$set:{'cart.$.quantity':updatedQuantity}}
                )
                
                    console.log(updatedQuantity);
                console.log('Cart quantity decremented successfully');

                    return updatedQuantity;
    
                
            }}
            else{

                return 1;

                // console.log("cart is 0");;
            }
            


    }
 

}