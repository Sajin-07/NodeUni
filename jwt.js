const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    // first check request headers has authorization or not
    const authorization = req.headers.authorization //webpage access er shomoy HTTP req er header te authorization a bearer token thake. Ei token thakle next step a jabe token verify korar jonno. jodi http req.headers.authorization a token na thake then access denied.
    if(!authorization) return res.status(401).json({ error: 'Token Not Found' }); //token header a na paile ei response send korbo.

    // Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1]; //header theke only token kivabe nibo? token format  "Bearer <token>". so, 0 index a Bearer and 1 index a token. split kore only token ta nibo. only token er vitor abar 3ta part. header,playload,signature.
    if(!token) return res.status(401).json({ error: 'Unauthorized' });

    try{
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //token jeita pailam oita verify korar jonno secret key lage. verify hoile server user ke playload return kore. decoded variable a playload ase user er.

        // Attach user information to the request object
        req.user = decoded // verify er por playload return pawar por user jei api/url access/req korte chay shei request header a ei playload diye dite hobe.
        next(); //next dile decode ta ei middleware hoye server a jabe.
    }catch(err){
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
}


// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30000});
}

module.exports = {jwtAuthMiddleware, generateToken};