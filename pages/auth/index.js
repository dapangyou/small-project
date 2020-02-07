import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { login } from '../../utils/asyncWx.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async handleGetUserInfo(e) {
    console.log(e);
    try {
      const { encryptedData, rawData, iv, signature } = e.detail;
      //2.获取小程序登录成功后的code
      const { code } = await login();
      //3.发送请求，获取用户的token
      const loginParams = { encryptedData, rawData, iv, signature, code };
      const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: 'POST' });
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
    //1.获取用户信息


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})