//ไฟล์นี้จะประกอบด้วย ฟังชั่นในการทำงานกับตารางใน ฐานข้อมูล ผ่านทาง prisma
//ทำงานกับตารางได้แก่ C เพิม R ค้นหา-ตรวจสอบดึงดู U แก้ไข D ลบ
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

//อัปโหลดไฟล์รูปภาพ --------------------------------------------------------------------------------------------------------
//1. สร้างที่อยู่สำหรับเก็บไฟล์ที่อัปโหลด และเปลี่ยนชื่อไฟล์ที่อัปโหลดเพื่อไม่ให้ซ้ำกัน
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/user');
    },
    filename: (req, file, cb) => {
        cb(null, 'user_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
});
//2. ตัวฟังก์ชันอัปโหลดไฟล์
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50 // ขนาดไฟล์สูงสุด 5MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/; //กำหนดประเภทของไฟล์ที่อนุญาตให้อัปโหลด
        const mimetype = filetypes.test(file.mimetype); //ตรวจสอบประเภทของไฟล์ที่อัปโหลด
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); //ตรวจสอบนามสกุลของไฟล์ที่อัปโหลด
        if (mimetype && extname) {
            return cb(null, true); //อนุญาตให้ไฟล์ที่อัปโหลดผ่านการตรวจสอบ
        } else {
            cb('Error: File upload only supports the following filetypes - ' + filetypes); //ไม่อนุญาตให้ไฟล์ที่อัปโหลดผ่านการตรวจสอบ
        }
    }
}).single('userImage');
//------------------------------------------------------------------------------------------------------------------------------------

//เพิ่ม user ----------------------------------------------------------------------------------------------------------------------------
exports.createUser = async (req, res) => {
    try {
        const result = await prisma.user_tb.create({
            data: {
                userFullname: req.body.userFullname,
                userEmail: req.body.userEmail,
                userPassword: req.body.userPassword,
                userImage: req.file ? req.file.path.replace("images\\user\\", "") : "",
            }
        })//คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
        res.status(201).json({
            message: "InsertOk",
            data: result
        })

    } catch (err) {
        res.status(500).json({ message: `พบปัยหาในการทำงาน ${err.message}` })
    }
}
//-------------------------------------------------------------------------------------------------------------------------------------

//login เพื่อตรวจสอบ อีเมลื รหัสผ่านในการเข้าใช้งานเข้าสู่ระบบของ user -----------------------------------------------------------------------------
exports.checkLogin = async (req, res) => {
    try {
        const result = await prisma.user_tb.findFirst({
            where: {
                userEmail: req.params.userEmail,
                userPassword: req.params.userPassword,
            }
        })//คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
        if (result) {
            res.status(200).json({
                message: "checkOk",
                data: result
            })
        }
        else {
            res.status(404).json({
                message: "check not found",
                data: result
            })
        }
    } catch (err) {
        res.status(500).json({ message: `พบปัยหาในการทำงาน ${err.message}` })
    }
}
//------------------------------------------------------------------------------------------------------------------------------------

//แก้ไขข้อมูล user ------------------------------------------------------------------------------------------------------------------------
exports.editUser = async (req, res) => {
    try {
        let result = {}
        if (req.file) {
            const user = await prisma.user_tb.findFirst({
                where:{
                    userId: parseInt(req.params.userId)
                }
            })
            result = await prisma.user_tb.update({
                data: {
                    userFullname: req.body.userFullname,
                    userEmail: req.body.userEmail,
                    userPassword: req.body.userPassword,
                    userImage: req.file ? req.file.path.replace("images\\user\\", "") : "",
                }, where: {
                    userId: parseInt(req.params.userId)
                }

            })
        }
        else {
            result = await prisma.user_tb.update({
                data: {
                    userFullname: req.body.userFullname,
                    userEmail: req.body.userEmail,
                    userPassword: req.body.userPassword
                }, where: {
                    userId: parseInt(req.params.userId)
                }

            })
        }

        //คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
        res.status(200).json({
            message: "UpdateOk",
            data: result
        })
    } catch (err) {
        res.status(500).json({ message: `พบปัยหาในการทำงาน ${err.message}` })
    }
}
//------------------------------------------------------------------------------------------------------------------------------------
