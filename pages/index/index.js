Page({
  data: {
    startDate:"",
    endDate:"",
    nowDate:"",
    year:1901,
    month: 1,
    date: 1,
    lunaMonth: "",
    lunarDate:"",
    dates: [],
    sex: -1,
    time: -1,
  },
  onFate: function() {
    if (this.data.sex == -1 || this.data.time == -1){
      wx.showToast({ icon:"none", title: "请选择乾[男]坤[女]造和出生时辰^_^"});
      return;
    }
    wx.navigateTo({ url: "../../pages/fate/fate?date=" + this.data.nowDate + "&time=" + this.data.time + "&sex=" + this.data.sex});
  },
  onTimeSelect: function(e) {
    var time = e.currentTarget.dataset.time;
    this.setData({time: time});
  },
  onSexSelect: function(e) {
    var sex = e.currentTarget.dataset.sex;
    console.log("sex" + sex);
    this.setData({ sex: sex });
  },
  onDateChange: function(e){
    var str = e.detail.value;
    var str = e.detail.value.replace(/-/g, "/");
    var d = new Date(str);
    this.setDate(d);
  },
  onDateClick: function(e) {
    var str = e.currentTarget.dataset.date;
    var d = new Date(this.data.year + "/" + this.data.month + "/" + str);
    this.setDate(d);
  },
  onLoad: function () {
    var d = new Date();
    this.setDate(d);

  },
  setDate: function(now) {
    var TCal = require("../../utils/TCal.js");
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var startDate = "1901-01-01";
    var endDate = year+"-"+month+"-"+date;
    var nowDate=endDate;


    var firstDate = new Date(year + "/" + month + "/1");
    var fTradDate = TCal.getTradDate(firstDate);
    var wd = fTradDate.wd;

    var tradDate = TCal.getTradDate(now);

    console.log("wd" + wd);

    var yearMonth = year + "年" + month  + "月";
    var dates = [];
    for (var i = 0; i < wd; i++) {
      dates.push({
        select: false,
        date: "",
        lunarDay: ""
      });
    }
    console.log(dates.length);
    
    while(firstDate.getMonth() + 1===month) {
      var t = TCal.getTradDate(firstDate);
      var tdn = t.dn;
      if (tdn=="初一") tdn = t.mn;
      if (t.jq !="") tdn = t.jq;
      dates.push({
        select: firstDate.getDate() == date,
        date: firstDate.getDate(),
        lunarDay: tdn
      });
      firstDate = new Date(firstDate.getTime() + 24*60*60*1000);
    }

    this.setData({
      year: year,
      month: month,
      date: date,
      dates: dates,
      startDate: startDate,
      endDate: endDate,
      nowDate: nowDate,
      lunarMonth: tradDate.mn,
      lunarDate: tradDate.dn,
      sex: -1,
      time: -1
    });

  }
})