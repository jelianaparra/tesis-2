import jwt from 'jsonwebtoken'

const middle = (req, res, next) => {
    const tokenString = req.header('Authorization')
    if(!tokenString) return res.status(401).json({msg: "usuario no autenticado"})

    try{
        const verified = jwt.verify(tokenString.split(' ')[1], process.env.SECRET )
        req.user = verified
        next()
    }catch(err)
    {
        res.status(401).json({"Message" : "Invalid Token"})
    }
}

export default middle;