//ไฟล์ที่ใช้ในการกำหนดเส้นทางในการเรียกใช้ API เป็นการกำหนดตัว Endpoint ของ API
const express = require('express');
const userController = require('../controllers/user.controller')

const router = express.Router();

//เพิ่ม
router.post('/',userController.upload, userController.createUser)

//ค้นหา-ตรวจสอบ-ดึงดู
router.get('/:userEmail/:userPassword',userController.checkLogin)

//แก้ไข
router.put('/:userId', userController.upload, userController.editUser)


//**************
module.exports = router