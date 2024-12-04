const requireAuth = async (req, res, next) => {

    if (req.session && req.session.userId) {

        return next() // godkendt 
    
    } else {

        console.log("LOGIN AFVIST")
        res.set("Connection", "close").status(401).json({message: "Du har ikke adgang - cookie mangler"})
        
    }

    
}

module.exports = requireAuth