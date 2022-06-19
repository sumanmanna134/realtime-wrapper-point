const { default: axios } = require('axios');
const Noty = require('noty');

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');
let removeCart = document.querySelectorAll('.remove-to-cart');

async function updateCart(dish) {
  await axios
    .post('/update-cart', dish)
    .then((res) => {
      cartCounter.innerText =
        Number(res.data.totalQty) == 0 ? '' : Number(res.data.totalQty);
      new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Item added to cart',
      }).show();
    })
    .catch((e) => {
      new Noty({
        type: 'error',
        timeout: 1000,
        text: e.message,
      }).show();
    });
}

async function removeToCart(dish) {
  await axios
    .post('/remove-cart', dish)
    .then((res) => {
      console.log(res.data);
      cartCounter.innerText =
        Number(res.data.totalQty) == 0 ? '' : Number(res.data.totalQty);
      new Noty({
        type: 'info',
        timeout: 1000,
        text: 'Item Remove from Cart!',
      }).show();
      window.location.reload();
    })
    .catch((e) => {
      new Noty({
        type: 'error',
        timeout: 1000,
        text: e.message,
      }).show();
    });
}
addToCart.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    let dish = JSON.parse(btn.dataset.pizza);
    updateCart(dish);
  });
});

removeCart.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    let dish = JSON.parse(btn.dataset.pizza);
    removeToCart(dish);
  });
});
