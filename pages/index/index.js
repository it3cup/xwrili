var TCal = require("../../utils/TCal.js");
Page({
  data: {
    lunarIndex: [0, 0, 0, 0],
    currIdx: 1,
    sex: -1,
    time: -1
  },
  onColunmChange: function() {},
  toToday: function() {
    var date = new Date();
    this.setDates(date);
  },
  touchstart: function(e) {
    this.data.touchStartX = e.touches[0].pageX;
  },

  touchmove: function(e) {
    this.data.touchMoveX = e.touches[0].pageX;
  },
  touchend: function(e) {
    if (this.data.touchMoveX == null || this.data.touchStartX == null) {
      return;
    }

    var diff = this.data.touchMoveX - this.data.touchStartX;
    //console.log("diff" + diff + "move" + this.data.touchMoveX );

    var date = this.data.currCal.selectDate;
    //console.log("d========" + date);
    var nextDate = diff > 0 ? this.addMonth(date, -1) : this.addMonth(date, 1);
    this.setDates(nextDate);

    this.data.touchStartX = null;
    this.data.touchMoveX = null;
  },
  touchcancel: function(e) {
    this.touchend({});
  },
  onFate: function() {
    if (this.data.sex == -1 || this.data.time == -1) {
      wx.showToast({
        icon: "none",
        title: "请先选择八字性别和出生时辰"
      });
      return;
    }
    wx.navigateTo({
      url: "../../pages/fate/fate?date=" + this.data.currCal.selectDateStr + "&time=" + this.data.time + "&sex=" + this.data.sex
    });
  },
  onTimeSelect: function(e) {
    var time = e.currentTarget.dataset.time;
    if (this.data.time === time) {
      time = -1;
    }
    this.setData({
      time: time
    });
  },
  onSexSelect: function(e) {
    var sex = e.currentTarget.dataset.sex;
    if (this.data.sex === sex) {
      sex = -1;
    }
    this.setData({
      sex: sex
    });
  },
  onDateChange: function(e) {
    var str = e.detail.value;
    var str = e.detail.value.replace(/-/g, "/");
    var d = new Date(str);
    this.setDates(d);
  },
  onDateClick: function(e) {
    var str = e.currentTarget.dataset.date;
    var currCal = this.data.currCal;
    var d = new Date(currCal.year + "/" + currCal.month + "/" + str);
    this.setDates(d);
    //console.log("@@@@@@@@@@@@@")
  },
  onLoad: function() {
    //var dateList = this.getDateList(new Date());
    // console.log(dateList);

    var years = [];

    for (var i = 1901; i < 2101; i++) {
      years.push(i);
    }


    var MN = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
    var DN = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
      "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
      "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
    ];

    var lunarArray = [years, MN, DN, ["非闰月", "闰月"]];
    this.setData({
      lunarArray: lunarArray
    });

    this.setDates(new Date());

  },
  addMonth: function(date, count) {
    // console.log(date);
    var y = date.getFullYear() + parseInt(count / 12);
    var d = date.getDate();
    var m = date.getMonth() + 1 + count % 12;
    //console.log(count + "--------"+m);
    if (m === 13) {
      y++;
      m = 1;
    }
    if (m === 0) {
      y--;
      m = 12;
    };
    if (d === 31 && "4|6|9|11".includes(m) > -1) {
      d = 30;
    }
    if (d > 28 && m === 2 ) {
      d = this.isLeapYear(y) ? 29 : 28;
    }
    
    return new Date(y + "/" + m + "/" + d);
  },
  isLeapYear: function(y) {
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  },
  getMonthCalendars: function(inputDate) {

    var year = inputDate.getFullYear();
    var month = inputDate.getMonth() + 1;
    var date = inputDate.getDate();
    var startDate = "1901-01-01";
    var selectDate = new Date(year + "/" + month + "/" + date);
    var selectDateStr = year + "-" + month + "-" + date;
    var iterator = new Date(year + "/" + month + "/1");
    var fTradDate = TCal.getTradDate(iterator);
    var wd = fTradDate.wd;
    var tradDate = TCal.getTradDate(inputDate);
    var yearMonth = year + "年" + month + "月";
    var calendar = [];
    var key = 1;
    for (var i = 1; i < wd; i++) {
      calendar.push({
        key: key++,
        select: false,
        date: "",
        lunarDay: ""
      });
    }

    var now = new Date();

    //// var rrrr = 0
    while (iterator.getMonth() + 1 === month) {
      var t = TCal.getTradDate(iterator);
      var tdn = t.dn;
      if (tdn == "初一") tdn = t.mn;
      if (t.jq != "") tdn = t.jq;
      var isToday = iterator.getFullYear() === now.getFullYear() && iterator.getMonth() === now.getMonth() && iterator.getDate() === now.getDate();
      calendar.push({
        key: key++,
        isToday: isToday,
        select: iterator.getDate() == date,
        date: iterator.getDate(),
        lunarDay: tdn
      });
      iterator = new Date(iterator.getTime() + 24 * 60 * 60 * 1000);
      ////if (++rrrr > 200) {
      ////  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      ////}
    }

    //// console.log(calendar);

    return {
      year: year,
      month: month,
      date: date,
      selectDateStr: selectDateStr,
      selectDate: selectDate,
      tradDate: tradDate,
      calendar: calendar
    };
  },
  setDates: function(date) {
    var currCal = this.getMonthCalendars(date);
    var lunarIndex = [currCal.tradDate.y - 1900 - 1, currCal.tradDate.m - 1, currCal.tradDate.d - 1, currCal.tradDate.leap ? 1 : 0];
    this.setData({
      currCal: currCal,
      lunarIndex: lunarIndex
    });
  },
  findDate(lunarDate) {
    var tmpDate = lunarDate.d;
    if (tmpDate > 28) tmpDate = 28;
    var dateStr = lunarDate.y + "/" + lunarDate.m + "/" + tmpDate;
    //console.log(dateStr);
    var d = new Date(lunarDate.y + "/" + lunarDate.m + "/" + tmpDate);

    var tradDate = TCal.getTradDate(d);
    var step = 1;
    if (this.compareLunar(lunarDate, tradDate)<0) {
      step = -1;
    }

    
    for (var i=0; i<400; i++) {
      if (this.sameLunarDate(lunarDate, tradDate)) {
        console.log("i" + i);
        return d;
      }
      d = new Date(d.getTime() + step * 24 * 60 * 60 * 1000);
      tradDate = TCal.getTradDate(d);
    }

    return null;
  },

  compareLunar: function(a, b) {
    if(a.y>b.y) return 1;
    if(a.y===b.y && a.m > b.m) return 1;
    if(a.y===b.y && a.m===b.m && a.d>b.d) return 1;
    if(a.y === b.y && a.m === b.m && a.d === b.d) return 0;
    return -1;
  },
  sameLunarDate: function(a, b){
    if (this.compareLunar(a,b)===0 && a.leap===b.leap) return true;
    return false; 
  },
  onLunarChange: function(e) {

    var y = e.detail.value[0] + 1900 + 1;
    var m = e.detail.value[1] + 1;
    var d = e.detail.value[2] + 1;
    var leap = e.detail.value[3] === 1 ? true : false;

    var lunarDate = {
      y: y,
      m: m,
      d: d,
      leap: leap
    };
    // console.log(lunarDate);
    var date = this.findDate(lunarDate);

    // console.log("-----" + e.detail.value[3]);
    if (date == null) {
      wx.showToast({
        icon: "none",
        title: "找不到该农历日",
      });
      return;
    }

    //console.log(e.detail);
    this.setDates(date);
  }
})