//ไฟล์นี้จะประกอบด้วย ฟังชั่นในการทำงานกับตารางใน ฐานข้อมูล ผ่านทาง prisma
//ทำงานกับตารางได้แก่ C เพิม R ค้นหา-ตรวจสอบดึงดู U แก้ไข D ลบ
const multer = require('multer');
const path = require('path');
const router = require('../routes/kinkun.route');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

//อัปโหลดไฟล์รูปภาพ --------------------------------------------------------------------------------------------------------
//1. สร้างที่อยู่สำหรับเก็บไฟล์ที่อัปโหลด และเปลี่ยนชื่อไฟล์ที่อัปโหลดเพื่อไม่ให้ซ้ำกัน
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/kinkun');
    },
    filename: (req, file, cb) => {
        cb(null, 'kinkun_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
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
}).single('kinkunImage');;
//------------------------------------------------------------------------------------------------------------------------------------

//เพิ่มข้อมูลการกินในตาราง kinkun ----------------------------------------------------------------------------------------------------------------------------
exports.createKinkun = async (req, res) => {
    try {
        const result = await prisma.kinkun_tb.create({
            data: {
                kinkunTitle: req.body.kinkunTitle,
                kinkunState: req.body.kinkunState,
                kinkunDate: req.body.kinkunDate,
                kinkunCost: parseFloat(req.body.kinkunCost),
                kinkunImage: req.file ? req.file.path.replace("images\\kinkun\\", "") : "",
                userId: parseInt(req.body.userId)
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

//แก้ไขข้อมูลการกินในตาราง kinkun ---------------------------------------------------------------------------------------------------------
exports.editKinkun = async (req, res) => {
    try {
        let result = {}
        if (req.file) {
            result = await prisma.kinkun_tb.update({
                data: {
                    kinkunTitle: req.body.kinkunTitle,
                    kinkunState: req.body.kinkunState,
                    kinkunDate: req.body.kinkunDate,
                    kinkunCost: parseFloat(req.body.kinkunCost),
                    kinkunImage: req.file ? req.file.path.replace("images\\kinkun\\", "") : "",
                    userId: parseInt(req.body.userId)
                }, where: {
                    kinkunId: parseInt(req.params.kinkunId)
                }

            })
        }
        else {
            result = await prisma.kinkun_tb.update({
                data: {
                    kinkunTitle: req.body.kinkunTitle,
                    kinkunState: req.body.kinkunState,
                    kinkunDate: req.body.kinkunDate,
                    kinkunCost: parseFloat(req.body.kinkunCost),
                    userId: parseInt(req.body.userId)
                }, where: {
                    kinkunId: parseInt(req.params.kinkunId)
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

//ลบข้อมูลการกินในตาราง kinkun ---------------------------------------------------------------------------------------------------------
exports.deleteKinkun = async (req, res) => {
    try {
        const result = await prisma.kinkun_tb.delete({
            where: {
                kinkunId: parseInt(req.params.kinkunId)
            }
        })//คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
        res.status(200).json({
            message: "deletetOk",
            data: result
        })//คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    } catch (err) {
        res.status(500).json({ message: `พบปัยหาในการทำงาน ${err.message}` })
    }
}
//------------------------------------------------------------------------------------------------------------------------------------

//ดูข้อมูลการกินทั้งหมดในตาราง kinkun ของ user 1:1---------------------------------------------------------------------------------------------------------
exports.showallKinkun = async (req, res) => {
    try {
        const result = await prisma.kinkun_tb.findMany({
            where: {
                userId: parseInt(req.params.userId)
            }
        })//คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
        if (result) {
            res.status(200).json({
                message: "GetOk",
                data: result
            })
        }
        else {
            res.status(404).json({
                message: "Get not found",
                data: result
            })
        }
    } catch (err) {
        res.status(500).json({ message: `พบปัยหาในการทำงาน ${err.message}` })
    }
}
//------------------------------------------------------------------------------------------------------------------------------------

//ดูข้อมูลการกินหนึ่งในตาราง kinkun ---------------------------------------------------------------------------------------------------------
exports.showOnlyKinkun = async (req, res) => {
    try {
        const result = await prisma.kinkun_tb.findFirst({
            where: {
                kinkunId: parseInt(req.params.kinkunId)
            }
        })//คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
        if (result) {
            res.status(200).json({
                message: "GetOk",
                data: result
            })
        }
        else {
            res.status(404).json({
                message: "Get not found",
                data: result
            })
        }
    } catch (err) {
        res.status(500).json({ message: `พบปัยหาในการทำงาน ${err.message}` })
    }
}
//------------------------------------------------------------------------------------------------------------------------------------