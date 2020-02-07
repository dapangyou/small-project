// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx.js';
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    //计算全选
    // const allCheced = cart.length != 0 ? cart.every(v => v.checked) : false;
    //过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  //点击支付
  async handleOrderPay() {
    //判断缓存中有没有token
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    //创建订单
    const header = { Authorization: token }
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }));
    const orderParams = { order_price, consignee_addr, goods };
    const res = await request({ url: "/my/orders/create", method: "POST", data: orderParams, header: header });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //设置购物车的状态
  setCart(cart) {
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum,
      cart
    });
    wx.setStorageSync("cart", cart);
  }
})