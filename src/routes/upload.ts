import { Router } from "express";
import multer from "multer";
const router = Router();
const imageUpload = multer({ dest: "/upload/image" });

router.post("/avatar", imageUpload.single("avatar"), (req, res) => {
    const uploadedFile = req.file;
    res.json({ filename: uploadedFile.filename });
});

export default router;
