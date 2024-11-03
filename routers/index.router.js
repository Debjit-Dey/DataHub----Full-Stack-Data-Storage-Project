const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.middleware.js');
const uploadOnCloudinary = require('../utils/cloudinary.js');
const fileModel = require('../models/files.model.js');
const path = require('path');
const authMiddleware = require('../middlewares/auth.middleware.js');
const cloudinary = require('cloudinary').v2;

router.get('/', 
    authMiddleware, 
    async (req, res) => {
    
    const userFiles =await fileModel.find({user: req.user.id});
    // console.log(userFiles);
    res.render('home',{
        files: userFiles
    });
})

router.post('/upload-file',
    authMiddleware,
    upload.single('file'),
    async(req, res) => {
    // console.log(req.file.path);
    const fileP = req?.file?.path;
    if(!fileP) return res.status(400).render("messages//uploadError",
        {  
            message: "File not found",});

    const filePath = path?.resolve(fileP);
    // console.log(filePath);
    
    if(!filePath) return res.status(400).render("messages//uploadError",
        {  
            message: "File not found",});
    const response = await uploadOnCloudinary(filePath);
    // console.log(response);
    let optimizedUrl = response.url; // Default to the original URL

    // Check if the file format is PDF and apply transformations
    if (response.format === 'pdf') {
        optimizedUrl = cloudinary.url(response.public_id, {
            transformation: [
                { quality: "auto" },
                { fetch_format: "auto" }
            ]
        });
    }
   
    const newFile = await fileModel.create({
        path: optimizedUrl,
        originalName: response.original_filename,
        user: req.user.id,
        public_id: response.public_id,

    });
    // console.log(newFile);
    return res.status(200).render("messages//uploadError",
        {  
            message: "File uploaded Successfully",});
})

router.get('/download/:public_id',
    authMiddleware, 
    async (req, res) => {
        const loggedInUserId = req.user.id;
        const {public_id} = req.params;
        const file = await fileModel.findOne({
            public_id,
            user: loggedInUserId
        })
        if(!file) {
        return res.status(401).render("messages//uploadError",
            {  
                message: "Unauthorized access",});}
                
        
        res.redirect(file.path);
    })


router.get('/delete/:public_id',
    authMiddleware, 
    async (req, res) => {
        const loggedInUserId = req.user.id;
        const {public_id} = req.params;
        const file = await fileModel.findOne({
            public_id,
            user: loggedInUserId
        })
        if(!file) {
            return res.status(401).render("messages//uploadError",
                {  
                    message: "Unauthorized access",});}
        await cloudinary.uploader.destroy(file.public_id);
        await fileModel.deleteOne({public_id});
        res.redirect('/home');
        
    })

module.exports = router;