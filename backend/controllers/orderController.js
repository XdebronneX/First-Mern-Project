const Order = require('../models/order')
const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')

// Create a new order   =>  /api/v1/order/new
exports.newOrder = async (req, res, next) => {
  const {
    orderItems,

    shippingInfo,

    itemsPrice,

    taxPrice,

    shippingPrice,

    totalPrice,

    paymentInfo
  } = req.body
  // console.log(req.body);

  const order = await Order.create({
    orderItems,

    shippingInfo,

    itemsPrice,

    taxPrice,

    shippingPrice,

    totalPrice,

    paymentInfo,

    paidAt: Date.now(),

    user: req.user._id
  })

  res.status(200).json({
    success: true,

    order
  })
}

exports.getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (!order) {
    return next(new ErrorHandler('No Order found with this ID', 404))
  }

  res.status(200).json({
    success: true,

    order
  })
}

exports.myOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })

  // console.log(req.user)

  res.status(200).json({
    success: true,

    orders
  })
}

exports.allOrders = async (req, res, next) => {
  const orders = await Order.find()

  // console.log(orders)

  let totalAmount = 0

  orders.forEach(order => {
    totalAmount += order.totalPrice
  })

  res.status(200).json({
    success: true,

    totalAmount,

    orders
  })
}
exports.allSellerOrders = async (req, res, next) => {
  const loggedInUserId = req.user.id; // Assuming the user ID is stored in req.user.id

  const orders = await Order.find()
  .populate({
    path: 'orderItems.product',
    select: 'user', // Only select the 'user' property if it exists
    match: { user: { $exists: true } } // Only populate documents that have a 'user' property
  })
    .exec();

  console.log('Orders:', orders); // Log orders to inspect the retrieved orders

  const sellerOrders = orders.filter(order => {
    const products = order.orderItems.map(item => item.product);
    const productUserIds = products.map(product => {
      console.log('Product:', product);
      if (!product || !product.user) { // Skip null or undefined product objects or product objects with missing user property
        return null;
      }
      console.log('Product user:', product.user);
      return product.user.toString();
    });
    console.log('Product user IDs:', productUserIds);
    return productUserIds.includes(loggedInUserId.toString());
  });

  console.log('Seller Orders:', sellerOrders); // Log sellerOrders to inspect the filtered orders

  let totalAmount = 0;

  sellerOrders.forEach(order => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders: sellerOrders
  });
}


exports.updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('You have already delivered this order', 400))
  }

  order.orderItems.forEach(async item => {
    await updateStock(item.product, item.quantity)
  })

  ;(order.orderStatus = req.body.status), (order.deliveredAt = Date.now())

  await order.save()

  res.status(200).json({
    success: true
  })
}

async function updateStock (id, quantity) {
  const product = await Product.findById(id)

  product.stock = product.stock - quantity

  await product.save({ validateBeforeSave: false })
}

exports.deleteOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHandler('No Order found with this ID', 404))
  }

  await order.remove()

  res.status(200).json({
    success: true
  })
}

exports.totalOrders = async (req, res, next) => {
  const totalOrders = await Order.aggregate([
      {
          $group: {
              _id: null,
              count: { $sum: 1 }
          }
      }
  ])
  if (!totalOrders) {
      return next(new ErrorHandler('error total orders', 404))

  }
  res.status(200).json({
      success: true,
      totalOrders
  })

}

exports.totalSales = async (req, res, next) => {
  const totalSales = await Order.aggregate([
      {
          $group: {
              _id: null,
              total: { $sum: "$totalPrice" }
          }
      }
  ])
  if (!totalSales) {
      return next(new ErrorHandler('error total saless', 404))

  }
  res.status(200).json({
      success: true,
      totalSales
  })

}

exports.customerSales = async (req, res, next) => {
  const customerSales = await Order.aggregate([

      {
          $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'userDetails'
          },
      },

      { $unwind: "$userDetails" },

      {
          $group: {
              _id: "$user",
              total: { $sum: "$totalPrice" },
              doc: { "$first": "$$ROOT" },

          }
      },

      {
          $replaceRoot: {
              newRoot: { $mergeObjects: [{ total: '$total' }, '$doc'] },
          },
      },

      { $sort: { total: -1 } },
      {
          $project: {
              _id: 1,
              "userDetails.name": 1,
              total: 1,

          }
      }

  ])
  if (!customerSales) {
      return next(new ErrorHandler('error customer sales', 404))

  }
  // return console.log(customerSales)
  res.status(200).json({
      success: true,
      customerSales
  })

}

exports.salesPerMonth = async (req, res, next) => {
  const salesPerMonth = await Order.aggregate([
      {
          $group: {
              _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
              total: { $sum: "$totalPrice" },
          },
      },

      {
          $addFields: {
              month: {
                  $let: {
                      vars: {
                          monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', ' Sept', 'Oct', 'Nov', 'Dec']
                      },
                      in: {
                          $arrayElemAt: ['$$monthsInString', "$_id.month"]
                      }
                  }
              }
          }
      },
      { $sort: { "_id.month": 1 } },
      {
          $project: {
              _id: 1,
              month: 1,
              total: 1,

          }
      }

  ])
  if (!salesPerMonth) {
      return next(new ErrorHandler('error sales per month', 404))

  }
  // return console.log(customerSales)
  res.status(200).json({
      success: true,
      salesPerMonth
  })

}