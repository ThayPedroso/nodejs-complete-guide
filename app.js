const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Relations between tables
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })

// sync() will syncronize to the database configured in the models 
// with define() and create tables if necessary
sequelize
    .sync()
    // .sync({ force: true }) // force to ensure tables will be recreated during development
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if(!user) {
            return User.create({ name: 'Thayla', email: 'test@test.com' })
        }
        return Promise.resolve(user)
    })
    .then(user => {
        // console.log(user)
        user.createCart()
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    })

