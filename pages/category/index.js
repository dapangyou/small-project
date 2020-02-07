// pages/category/index.js
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //左侧菜单数据数组
    leftMenuList: [],
    //右侧菜单数据数组
    rightContent: [],
    //被点击的左侧的菜单
    currentIndex: 0,
    //右侧内容的滚动条
    scrollTop: 0
  },
  //接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取本地存储的数据
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      //不存在
      this.getCates();
    } else {
      //存在
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        this.getCates();
      } else {
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }
    }

  },
  // 获取分类数据
  async getCates() {
    // request({ url: "/categories" })
    //   .then(result => {
    //     this.Cates = result.data.message
    //     //把接口的数据存到本地存储中
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     });
    //   });
    const result = await request({ url: "/categories" });
    this.Cates = result;
    //把接口的数据存到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });
  },
  //左侧菜单的事件源
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    });

  }
})