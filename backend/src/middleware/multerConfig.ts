// import multer from 'multer';
//
// // Konfiguracja multera
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });
//
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 20 }, // Limit rozmiaru pliku (20MB)
//     fileFilter: function (req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             const error = new Error('Only image files are allowed!');
//             cb(error);
//         }
//         cb(null, true);
//     }
// });
//
// export default upload;

import multer from "multer";
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20 }, // Limit rozmiaru pliku (20MB)
    fileFilter: function (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            // @ts-ignore
            cb(new Error('Only image files are allowed!'), undefined);
        } else {
            cb(null, true);
        }
    }
});

export default upload;