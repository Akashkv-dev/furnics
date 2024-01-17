const noCache=((req,res,next)=>{
    res.setHeader('Cache-control', 'private, no-cache,no-store,must-revalidate');
    res.setHeader('Expires','-1');
    res.setHeader('Pragma', 'no-cache');
    next();
  
  })
  module.exports=noCache