"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.uploadAvatar = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.join(process.cwd(), 'public', 'uploads');
const avatarDir = path_1.default.join(uploadDir, 'avatars');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
if (!fs_1.default.existsSync(avatarDir)) {
    fs_1.default.mkdirSync(avatarDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarDir);
    },
    filename: (req, file, cb) => {
        const userId = req.user?.id || 'unknown';
        const timestamp = Date.now();
        const ext = path_1.default.extname(file.originalname);
        cb(null, `avatar_${userId}_${timestamp}${ext}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
};
const limits = {
    fileSize: 5 * 1024 * 1024
};
exports.uploadAvatar = (0, multer_1.default)({
    storage,
    fileFilter,
    limits
}).single('avatar');
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: '파일 크기는 5MB를 초과할 수 없습니다.'
            });
        }
    }
    else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};
exports.handleUploadError = handleUploadError;
//# sourceMappingURL=upload.js.map