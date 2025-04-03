// one way of doing is by using promisses
const asyncHandler = (requestHandler) => {
    return (req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err));
    }
};


export {asyncHandler}


// another way of doing this(using trycatch)->

// const asyncHandler = (func)=> {()=>{}} this is an higher order function ie func passed as an arg inside a function

/* 
const asyncHandler = (fn) => async(req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (err) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
} 
*/