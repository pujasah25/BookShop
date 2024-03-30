import Product from "../models/product.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import Order from "../models/order.js";
import nodemailer from "nodemailer";

dotenv.config();
// sgMail.setApiKey(process.env.SENDGRID_KEY);

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Create product, post method
// router.post("/product", requireSignin, isAdmin, formidable(), create);
export const create = async (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files);
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name.trim():
        return res.json({ error: "Name is required" });
      case !description.trim():
        return res.json({ error: "Description is required" });
      case !price.trim():
        return res.json({ error: "Price is required" });
      case !category.trim():
        return res.json({ error: "Category is required" });
      case !quantity.trim():
        return res.json({ error: "Quantity is required" });
      case !shipping.trim():
        return res.json({ error: "Shipping is required" });
      case photo && photo.size > 1000000:
        return res.json({ error: "Image should be less than 1mb in size" });
    }
    // create product
    const product = new Product({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

// GET ALL PRODUCT
// router.get("/products", list);
export const list = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .select("-photo") // select everything except the photo.
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

// GET SINGLE PRODUCT
// router.get("/product/:slug", read);
export const read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.json(product);
  } catch (err) {
    console.log(err);
  }
};

// GET PRODUCT PHOTO
// router.get("/product/photo/:productId", photo);
export const photo = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      "photo"
    );
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.send(product.photo.data);
    }
  } catch (err) {
    console.log(err);
  }
};

// DELETE PRODUCT
// router.delete("/product/:productId", requireSignin, isAdmin, remove);
export const remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.productId
    ).select("-photo");
    res.json(product);
  } catch (err) {
    console.log(err);
  }
};

// UPDATE PRODUCT
// router.put("/product/:productId", requireSignin, isAdmin, formidable(), update);
export const update = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    switch (true) {
      case !name.trim():
        res.json({ error: "Name is required" });
      case !description.trim():
        res.json({ error: "Description is required" });
      case !price.trim():
        res.json({ error: "Price is required" });
      case !category.trim():
        res.json({ error: "Category is required" });
      case !quantity.trim():
        res.json({ error: "Quantity is required" });
      case !shipping.trim():
        res.json({ error: "Shipping is required" });
      case photo && photo.size > 1000000:
        res.json({ error: "Image should be less than 1mb in size" });
    }

    // update product
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      // photo might not be there, so check if we have the photo
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

// filter products based on categories and price ranges
// router.post("/filtered-products", filteredProducts);
export const filteredProducts = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {}; // created empty object
    if (checked.length > 0) args.category = checked; // added property category to args object
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }; // radio = [100, 299]
    console.log("args => ", args);
    // args => { category: ['123456789','785432123'], price: { $gte: radio[0], $lte: radio[1] } }
    const products = await Product.find(args);
    console.log("filtered products query => ", products.length);
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

// to find the count of total product
// router.get("/products-count", productsCount);
// http://localhost:8800/api/products-count
export const productsCount = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.json(total);
  } catch (err) {
    console.log(err);
  }
};

// for load more page, 6 at each page, like pagination
// router.get("/list-products/:page", listProducts);
// http://localhost:8800/api/list-products/1
export const listProducts = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;

    const products = await Product.find({})
      .select("-photo") // not include photo
      // if total is 8, page is 3, perPage=3,
      // product => (3-1)*3 =>  2*3 = 6 (skip), remaining 2 will be displayed
      .skip((page - 1) * perPage)
      .limit(perPage) // 3 per page
      .sort({ createdAt: -1 }); // sort in

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

// router.get("/products/search/:keyword", productsSearch);
export const productsSearch = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Product.find({
      // find either by name or desc
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo"); // deselect the photo

    res.json(results); // send the response
  } catch (err) {
    console.log(err);
  }
};

// router.get("/related-products/:productId/:categoryId", relatedProducts);
export const relatedProducts = async (req, res) => {
  try {
    const { productId, categoryId } = req.params;
    const related = await Product.find({
      category: categoryId, // books having same category
      _id: { $ne: productId }, // not include, the viewed product/book
    })
      .select("-photo")
      .populate("category")
      .limit(3); // show only 3 related product

    res.json(related);
  } catch (err) {
    console.log(err);
  }
};

// router.get("/braintree/token", getToken);
// So this token is needed in order for us to show this drop in UI in react.
// So for this UI, we need the token that is generated by Braintree.
export const getToken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// router.post("/braintree/payment", requireSignin, processPayment);
// to finalize the transaction.
// nonce => This is basically a string written by the client SDK to represent the payment method.
export const processPayment = async (req, res) => {
  try {
    const { nonce, cart } = req.body;

    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    // // process payment
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          // create order, if the payment is successful
          const order = new Order({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          // decrement quantity, and increment sold, after the purchase
          decrementQuantity(cart); // fun call
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// func def
const decrementQuantity = async (cart) => {
  try {
    // build mongodb query
    const bulkOps = cart.map((item) => {
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { quantity: -0, sold: +1 } }, // after purchase
        },
      };
    });

    const updated = await Product.bulkWrite(bulkOps, {});
    // console.log("blk updated", updated);
  } catch (err) {
    console.log(err);
  }
};

// router.put("/order-status/:orderId", requireSignin, isAdmin, orderStatus);
export const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("buyer", "email name");

    // prepare email
    // using nodemailer
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let message = {
      from: process.env.MAIL_USERNAME,
      to: order.buyer.email, //
      subject: "Order status",
      html: `
        <h1>Hi ${order.buyer.name}, Your order's status is: <span style="color:red;">${order.status}</span></h1>
        <p>Visit <a href="${process.env.CLIENT_URL}/dashboard/user/orders">your dashboard</a> for more details</p>
      `,
    };

    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json(order);
  } catch (err) {
    console.log(err);
  }
};

// export const orderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const order = await Order.findByIdAndUpdate(orderId, { status });
//     res.json(order);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const emailData = {
//   from: process.env.EMAIL_FROM, //
//   to: order.buyer.email, //
//   subject: "Order status",
//   html: `
//     <h1>Hi ${order.buyer.name}, Your order's status is: <span style="color:red;">${order.status}</span></h1>
//     <p>Visit <a href="${process.env.CLIENT_URL}/dashboard/user/orders">your dashboard</a> for more details</p>
//   `,
// };

// try {
//   await sgMail.send(emailData);
// } catch (err) {
//   console.log(err);
// }
