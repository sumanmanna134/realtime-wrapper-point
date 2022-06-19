function cartController() {
  return {
    cart(req, res) {
      res.render('customers/cart');
    },
    update(req, res) {
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
          payableAmt: 0,
          deliveryFee: 0,
        };
      }
      let cart = req.session.cart;
      if (!cart.items[req.body._id]) {
        (cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        }),
          (cart.totalQty = cart.totalQty + 1);
        cart.totalPrice = Number(cart.totalPrice) + Number(req.body.price);
        cart.deliveryFee = (cart.totalPrice * 2) / 100;
        cart.payableAmt =
          cart.totalPrice + (cart.totalPrice * 9) / 100 + cart.deliveryFee;
      } else {
        cart.items[req.body._id].qty += 1;
        cart.totalQty += 1;
        cart.totalPrice = Number(cart.totalPrice) + Number(req.body.price);
        cart.deliveryFee = (cart.totalPrice * 2) / 100;
        cart.payableAmt =
          cart.totalPrice + (cart.totalPrice * 9) / 100 + cart.deliveryFee;
      }
      return res.status(200).json({
        totalQty: cart.totalQty,
      });
    },

    removeFromCart(req, res) {
      let cart = req.session.cart;
      // console.log(req.body.item.price);
      if (cart.items[req.body.item._id].qty <= 1) {
        delete cart.items[req.body.item._id];
        cart.totalQty -= 1;
        cart.totalPrice = Number(cart.totalPrice) - Number(req.body.item.price);
        cart.deliveryFee = (cart.totalPrice * 2) / 100;
        cart.payableAmt =
          cart.totalPrice + (cart.totalPrice * 9) / 100 + cart.deliveryFee;
        if (cart.totalQty == 0) {
          delete cart.items;
          req.session.destroy();
        }
      } else {
        cart.totalQty -= 1;
        cart.items[req.body.item._id].qty -= 1;
        cart.totalPrice = Number(cart.totalPrice) - Number(req.body.item.price);
        cart.deliveryFee = (cart.totalPrice * 2) / 100;
        cart.payableAmt =
          cart.totalPrice + (cart.totalPrice * 9) / 100 + cart.deliveryFee;
      }

      return res.status(200).json({
        totalQty: cart.totalQty,
      });
    },
  };
}
module.exports = cartController;
