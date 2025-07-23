"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    res.status(501).json({ message: '로그인 기능은 현재 구현되지 않았습니다.' });
});
router.post('/logout', (req, res) => {
    res.status(501).json({ message: '로그아웃 기능은 현재 구현되지 않았습니다.' });
});
router.post('/refresh', (req, res) => {
    res.status(501).json({ message: '토큰 갱신 기능은 현재 구현되지 않았습니다.' });
});
router.get('/me', (req, res) => {
    res.status(501).json({ message: '사용자 정보 조회 기능은 현재 구현되지 않았습니다.' });
});
exports.default = router;
//# sourceMappingURL=auth.js.map