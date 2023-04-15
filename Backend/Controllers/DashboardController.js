const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const ContactModel = require("../Models/ContactModel");
const OrderModel = require("../Models/OrderModel");
const ProductModel = require("../Models/ProductModel");
const UserModel = require("../Models/UserModel");
const { intToString, getFullMonth } = require("../utils/Helper");

exports.showOnDashboard = catchAsyncErrors(async(req,res,next)=>{
    const users = await UserModel.find({});
    const products = await ProductModel.find({});
    const orders = await OrderModel.find({}).populate("user","name");;
    const contacts = await ContactModel.find({});

    //Cards
    let earning =0;
    let balance =0;

    orders.forEach((order)=>{
        earning+=order.totalPrice;
    })
    products.forEach(product=>{
        if(product.stock>0){
            balance += (product.stock*product.price);
        }
    })
    const cards = [
        {
            title:'users',
            count:intToString(users.length),
            text:'See all users',
            content:'Users'
        },
        {
            title:'products',
            count:intToString(products.length),
            text:'View all Products',
            content:'Products'
        },
        {
            title:'orders',
            count:intToString(orders.length),
            text:'View all Orders',
            content:'Orders'
        },
        {
            title:'contacts',
            count:intToString(contacts.length),
            text:'See all contacts',
            content:'Contacts'
        },
        {
            title:'earning',
            count:'₹'+intToString(earning),
            text:'View net earnings',
            content:'Delivery'
        },
        {
            title:'my balance',
            count:'₹'+intToString(balance),
            text:'See Details',
            content:'Stats'
        }
    ]

    //Table
    const transactions = []
    orders.reverse().slice(0,5).forEach((e,i)=>{
        transactions.push({
            trackingId:e._id,
            products:e.orderItems[0],
            cusomer:e.user.name,
            date:`${e.paidAt.getDate()} ${getFullMonth(e.paidAt.getMonth())} ${e.paidAt.getFullYear()}`,
            amount:'₹'+e.totalPrice,
            status:e.orderStatus
        })
    })


    //Graph
    const currentDate = new Date(Date.now());
    const currentMonth = currentDate.getMonth();
    const chartData = [];
    let currMonthRev =0;
    let prevMonthRev =0;

    for(let j =0;j<6;j++){
        let rev = 0;
        orders.forEach((order)=>{
            if(order.paidAt.getMonth() === currentMonth-5+j){
                rev += order.totalPrice
                if(j===5){
                    currMonthRev += order.totalPrice;
                }
                if(j==4){
                    prevMonthRev += order.totalPrice;
                }
            }
        })
        chartData.push({
            month: getFullMonth(currentMonth-5+j),
            income: rev
        })
    }

    //Revenue Change
    const revVal = (prevMonthRev!==0)?Math.floor(((currMonthRev-prevMonthRev)/prevMonthRev)*100):100;
    const ordStat = (transactions.length>0)? transactions[0].status:'';

    const revData = {
        revVal,
        currMonthRev:intToString(currMonthRev),
        statusText:(ordStat!=="")?((ordStat==='Processing')?'Previous delivery processing, last order has not been delivered.':'Previous Order has been Delivered, transaction is done already.'):''
    }
    res.status(200).json({
        success:true,
        message:'All data Recieved.',
        cards,
        transactions,
        chartData,
        revData
    })

});

exports.delivery = catchAsyncErrors(async(req,res,next)=>{
    const orders = await OrderModel.find({}).populate('user' , 'name email avatar');
    const products = await ProductModel.find({});
    let earning = 0;
    let balance = 0;
    const invoicesOrders = [];
    orders.forEach((order)=>{
        earning += order.totalPrice;
        if(order.orderStatus !== 'Processing'){
            invoicesOrders.push(order);
        }
    })

    products.forEach(product =>{
        balance += (product.stock*product.price);
    })

    res.status(200).json({
        success:true,
        message:'All Data Recived',
        earning:intToString(earning),
        balance:intToString(balance),
        orders,
        invoicesOrders
    })

})

exports.stats = catchAsyncErrors(async(req,res,next)=>{
    const Allproducts = await ProductModel.find({});
    const Allorders = await OrderModel.find({});
    const Allusers = await UserModel.find({});
    const Allcontacts = await ContactModel.find({});
    let outOfStock = 0;
    Allproducts.forEach((product)=>{
        if(product.stock <=0){
            outOfStock++;
        }
    });

    //Graph
    const currentDate = new Date(Date.now());
    const currentMonth = currentDate.getMonth();
    const chartData = [];
    let productPrev =0;
    let contactPrev =0;
    let orderPrev =0;

    let productCurrent =0;
    let contactCurrent =0;
    let orderCurrent =0;

    for(let j =0;j<6;j++){
        let balance = 0;
        let earning = 0;
        let productsCount = 0;
        let contactsCount = 0;
        let ordersCount = 0;
        let deliveredOrdersCount = 0;
        Allorders.forEach((order)=>{
            if(order.paidAt.getMonth() === currentMonth-5+j){
                earning += order.totalPrice;
                ordersCount++;
                if(j===5){
                    orderCurrent++;
                }
                if(j==4){
                    orderPrev++;
                }
            }
            if(order.deliveredAt){
                if( order.deliveredAt.getMonth() === currentMonth-5+j){
                    if(order.orderStatus !=='Processing'){
                        deliveredOrdersCount++;
                    }
                }
            }
        })
        Allcontacts.forEach((contact)=>{
            if(contact.sentAt.getMonth() === currentMonth-5+j){
                contactsCount++;
                if(j===5){
                    contactCurrent++;
                }
                if(j==4){
                    contactPrev++;
                }
            }
        })

        Allproducts.forEach((product)=>{
            if(product.createdAt.getMonth() === currentMonth-5+j){
                productsCount++;
                balance += (product.stock*product.price)
                if(j===5){
                    productCurrent++;
                }
                if(j==4){
                    productPrev++;
                }
            }
        })

        chartData.push({
            month: getFullMonth(currentMonth-5+j),
            earning,
            balance,
            products:productsCount,
            orders:ordersCount,
            contacts:contactsCount,
            deliveredOrders:deliveredOrdersCount
        })
    }

     const productChange = (productPrev!==0)?((Math.abs(productCurrent-productPrev))/productPrev)*100:100;
     const contactChange = (contactPrev!==0)?((Math.abs(contactCurrent-contactPrev))/contactPrev)*100:100;
     const orderChange = (orderPrev!==0)?((Math.abs(orderCurrent-orderPrev))/orderPrev)*100:100;

    res.status(200).json({
        success:true,
        message:'All Data Recieved',
        pieChartData:[
            {
                name:'In Stock',
                value:(Allproducts.length-outOfStock),
                fill:'var(--textColor)'
            },
            {
                name:'Out Of Stock',
                value:(outOfStock),
                fill:'var(--textColorWarn)'
            }
        ],
        chartData,
        radialData:[
            {
                name:'Products',
                increase:productChange,
                fill:'var(--textColor)'
            },
            {
                name:'Orders',
                increase:orderChange,
                fill:'var(--textColorDark)'
            },
            {
                name:'Contacts',
                increase:contactChange,
                fill:'var(--textColorWarn)'
            },
        ]
    })
})