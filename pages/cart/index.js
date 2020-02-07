// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx.js';
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
    const cart = wx.getStorageSync("cart") || [];
    //计算全选
    // const allCheced = cart.length != 0 ? cart.every(v => v.checked) : false;
    this.setData({
      address
    });
    this.setCart(cart);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  async handleChooseAddress() {
    // wx.getSetting({
    //   success: (result) => {
    //     const scopreAddress = result.authSetting["scope.address"];
    //     if (scopreAddress === true || scopreAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (res) => {
    //           console.log(res);
    //         }
    //       });
    //     } else {
    //       //用户以前拒绝过
    //       wx.openSetting({
    //         success: (result2) => {
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3);
    //             }
    //           });
    //         }
    //       });

    //     }
    //   }
    // });

    try {
      const res1 = await getSetting();
      const scopreAddress = res1.authSetting["scope.address"];
      if (scopreAddress === false) {
        await openSetting();
      }
      const address = await chooseAddress();
      wx.setStorageSync("address", address);
      console.log(address.userName);
    } catch (error) {
      console.log(error);
    }


  },

  //商品的选中
  handleItemChange(e) {
    //获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },

  //设置购物车的状态
  setCart(cart) {
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;
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
  },
  //商品的全选功能
  handleItemAllCheck() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },
  //商品数量的编辑功能
  async handleItemNumEdit(e) {
    const { id, operation } = e.currentTarget.dataset;
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "是否要删除购物车中的商品" });
      console.log(res);
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }

  },

  //结算
  async handlepay() {
    //1.判断收获地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    //判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });

  }
})