const express = require('express');
const cors = requrie('cors');
require('dotenv').config();

const app = express();

//กำหนดหมายเลขพอต เพื่อรอรับการเข้าใช้งาน wed server
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json())

app.use('/user',require('./routes/user'))
app.use('/kinkun',require('./routes/kinkun'))

app.use('/images/user',express.static('images/user'))
app.use('/image/kinkun',express.static('images/kinkun'))

app.get('/', (req,res)=>{
    res.json({message: 'ยินดีต้อนรับสู่ Web server ของเรา!...XD'});
});

app.listen(PORT, ()=> {
    console.log(`server is runnung on port ${PORT} ...`);
});