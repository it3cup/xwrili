// pages/trans/trans.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = {};
    var d = new Date();
    data.year = d.getFullYear();
    data.month = d.getMonth() + 1;
    data.date = d.getDate();
    
    var TCal = require("../../utils/TCal.js");
    var td = TCal.getTradDate(d);

    data.week = td.wdn[1];
    data.tmonth=td.mn;
    data.tdate=td.dn;
    data.ygz = td.ygz;
    data.mgz = td.mgz;
    data.dgz = td.dgz;
    data.jq=td.jq;
    this.setData(data);
  }
})