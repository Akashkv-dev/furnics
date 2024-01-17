const noCache=((req,res,next)=>{
    res.setHeader('Cache-Control', 'privite, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    console.log('clear cache');
    next();
  });
    
  module.exports=noCache