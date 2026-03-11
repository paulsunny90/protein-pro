import express from 'express';
import { upload as diskUpload } from '../config/upload.config';
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import multer from 'multer';

const router = express.Router();
const upload = diskUpload;

router.post('/', authMiddleware, adminMiddleware, (req: Request, res: Response, next: NextFunction) => {
    upload.single('image')(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
           
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' });
            }
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
           
            return res.status(400).json({ message: err.message || 'Upload failed' });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

           
            const imageUrl = req.file.path;

            res.status(200).json({
                message: 'Image uploaded successfully',
                imageUrl,
                
                public_id: (req.file as any).filename || (req.file as any).public_id
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ message: 'Upload failed' });
        }
    });
});

export default router;

