// pages/goods_list/index.js
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 1,
        value: '综合',
        isActive: true
      },
      {
        id: 2,
        value: '销量',
        isActive: false
      },
      {
        id: 3,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },

  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pageSize: 10
  },
  //总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();


  },

  //获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    //获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pageSize);
    // console.log(this.totalPages);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    });
    //关闭下拉刷新的窗口
    //如果没有调用下拉刷新的窗口，直接关闭也不会报错的
    wx.stopPullDownRefresh();
  },

  //标题的点击事件，从子组件传递过来的
  handleTabsItemChange(e) {
    const { index } = e.detail;
    let tabs = this.data.tabs;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    });
  },

  //页面上滑，滚动条触底事件
  onReachBottom() {
    //判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // console.log('没有下一页数据了');
      wx.showToast({
        title: '没有下一页数据了'
      });

    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  //下拉刷新事件
  onPullDownRefresh() {
    this.setData({
      goodsList: []
    });
    this.QueryParams.pagenum = 1;
    //重新发生请求
    this.getGoodsList();
  }
})