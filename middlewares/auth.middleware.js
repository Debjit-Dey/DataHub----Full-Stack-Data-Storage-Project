const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies.token;
    // console.log(token);
    if (!token) {
       return res.status(401).render("messages//authError",
                {  
                    message: "Unauthorized access",});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decoded);
        req.user = decoded;
        next();
    } catch (error) {
       return res.status(401).render("messages//authError",
                {  
                    message: "Unauthorized access",});
    }
}

module.exports = auth;