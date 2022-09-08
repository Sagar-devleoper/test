const express = require("express");
const app = express();
const morgan = require('morgan')
const config = require("./config/config");

require('./database/db')

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(morgan('dev'))
app.use(express.static("uploadfile"))
port = config.port || 80
// var multer = require('multer');


const userRoutes = require('./routes/userRoutes')
const cosumerRoutes = require('./routes/cosumerRoutes')
const agentRoutes = require('./routes/agentRoutes')
const adminRoutes = require('./routes/adminRoutes')
const bussinesRoutes = require('./routes/bussinesRoutes')
// 

const CatgeoryRouter = require('./routes/CategoryRoutes')
const Menu = require('./routes/MenuRoutes')
const product = require('./routes/ProductRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const couponRoutes = require('./routes/couponRoutes')
const addressRoutes = require('./routes/addressRoute')
const subcategoryRoutes = require('./routes/subCategory')
const subsubcategoryRoutes = require('./routes/subSubCategoryRoutes')
const agentStatusRoutes = require('./routes/agentStatusRoute')
const wishlistRoutes = require('./routes/wishlistRoutes')

app.use('/api/v1',CatgeoryRouter)
app.use('/api/v1',Menu)
app.use('/api/v1',product)

app.use('/api/v1', userRoutes)
app.use('/api/v1', cosumerRoutes)
app.use('/api/v1', agentRoutes)
app.use('/api/v1', adminRoutes)
app.use('/api/v1', bussinesRoutes)
app.use('/api/v1', cartRoutes)
app.use('/api/v1', orderRoutes)
app.use('/api/v1', couponRoutes)
app.use('/api/v1', addressRoutes)
app.use('/api/v1', subcategoryRoutes)
app.use('/api/v1', subsubcategoryRoutes)
app.use('/api/v1', agentStatusRoutes)
app.use('/api/v1', wishlistRoutes)

app.get('/app', (req, res) => {
    return res.status(200).send({ "message": "App Response from server1!" });
});

app.listen(port, () => {
    console.table([
        {
            port: `${port}`
        }
    ])
}); 
