const User = require('../modals/User');

module.exports = {
    addAddress:async (data,userid) =>{
        const user = await User.findOne({ _id: userid });
        const Address ={
            name:data.name,
            phone:data.phone,
            pincode:data.pincode,
            landmark:data.landmark,
            address:data.address,
            city:data.city,
            state:data.state
        } 
        
            user.address.push(Address);
            await user.save();  
    
        
    }
}