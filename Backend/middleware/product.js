import multer from 'multer';


const storage = multer.diskStorage({});

const fileFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    } else{
        cb(new Error('Not an image! Please upload only images.'),false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limits to 5MB
});

export default upload;