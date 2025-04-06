//ไฟล์ที่ใช้ในการกำหนดเส้นทางในการเรียกใช้ API เป็นการกำหนดตัว Endpoint ของ API
const express = require('express');
const kinkunController = require('../controllers/kinkun.controller')

const router = express.Router();

//เพิ่ม
router.post('/', kinkunController.upload,kinkunController.createKinkun)

//แก้ไข
router.put('/:kinkunId',kinkunController.upload,kinkunController.editKinkun)

//ลบ
router.delete('/:kinkunId',kinkunController.deleteKinkun)

//ค้นหา-ตรวจสอบ-ดึงดู
router.get('/kinkunall/:userId',kinkunController.showallKinkun)
router.get('/kinkunonly/:kinkunId',kinkunController.showOnlyKinkun)

//*******
module.exports = router