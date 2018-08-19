Page({
  data: {
    startDate:"",
    endDate:"",
    selectDateStr:"",
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
      wx.showToast({ icon:"none", title: "请先选择八字性别和出生时辰"});
      return;
    }
    wx.navigateTo({ url: "../../pages/fate/fate?date=" + this.data.selectDateStr + "&time=" + this.data.time + "&sex=" + this.data.sex});
  },
  onTimeSelect: function(e) {
    var time = e.currentTarget.dataset.time;
    if (this.data.time === time) {
      time = -1;
    }
    this.setData({time: time});
  },
  onSexSelect: function(e) {
    var sex = e.currentTarget.dataset.sex;
    if (this.data.sex === sex) {
      sex = -1;
    }
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
  setDate: function(inputDate) {
    this.data.currDate = inputDate;
    var TCal = require("../../utils/TCal.js");
    var year = inputDate.getFullYear();
    var month = inputDate.getMonth() + 1;
    var date = inputDate.getDate();
    var startDate = "1901-01-01";
    var endDate = year+"-"+month+"-"+date;
    var selectDateStr=endDate;


    var firstDate = new Date(year + "/" + month + "/1");
    var fTradDate = TCal.getTradDate(firstDate);
    var wd = fTradDate.wd;

    var tradDate = TCal.getTradDate(inputDate);


    var yearMonth = year + "年" + month  + "月";
    var dates = [];
    for (var i = 0; i < wd; i++) {
      dates.push({
        select: false,
        date: "",
        lunarDay: ""
      });
    }
    
    var now = new Date();
    while(firstDate.getMonth() + 1===month) {
      var t = TCal.getTradDate(firstDate);
      var tdn = t.dn;
      if (tdn=="初一") tdn = t.mn;
      if (t.jq !="") tdn = t.jq;
      var isToday = firstDate.getFullYear()===now.getFullYear() && firstDate.getMonth() === now.getMonth() && firstDate.getDate() === now.getDate();
      if (isToday){
        console.log("==============");
      }
      dates.push({
        isToday: isToday,
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
      selectDateStr: selectDateStr,
      lunarMonth: tradDate.mn,
      lunarDate: tradDate.dn
    });

  }
})