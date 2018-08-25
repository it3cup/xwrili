// pages/fate/fate.js
var tcal = require("../../utils/TCal.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  SWSJ: "长沐冠临帝衰病死墓绝胎养",
  GAN: "甲乙丙丁戊己庚辛壬癸",
  ZHI: "子丑寅卯辰巳午未申酉戌亥",
  GANWX: "木木火火土土金金水水",
  ZHIWX: "水土木木土火火土金金土水",
  GANYY:"+-+-+-+-+-",
  ZHIYY:"--+-++--+-++",
  WX: "木火土金水",
  SS: "官煞印枭财才伤食劫比",
  CG: ["癸", "癸己辛", "丙甲戊", "乙", "乙戊癸", "戊丙庚", "丁己", "乙己丁", "戊庚壬", "辛", "辛戊丁", "壬甲"],
  YYWX:{
    "甲":{yy: 1, wx: 0},
    "乙": { yy: 0, wx: 0 },
    "丙": { yy: 1, wx: 1 },
    "丁": { yy: 0, wx: 1 },
    "戊": { yy: 1, wx: 2 },
    "己": { yy: 0, wx: 2 },
    "庚": { yy: 1, wx: 3 },
    "辛": { yy: 0, wx: 3 },
    "壬": { yy: 1, wx: 4 },
    "癸": { yy: 0, wx: 4 },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.sex);

    var d = new Date(options.date.replace(/[-][0]*/g, "/"));
    var td = tcal.TCal.getTradDate(d);

    var ygz = td.ygz;
    var mgz = td.mgz;
    var dgz = td.dgz;
    var tgz = this.getTimeGanZhi(dgz[0], options.time); //时干支

     var dateStr = "公元"+d.getFullYear() + "年"+(d.getMonth()+1)+"月"+d.getDate()+"日";   
     var lunarStr = ygz +"年" + td.mn +  td.dn + "日";


     var ssArray = [];
    ssArray.push("");
    ssArray.push(this.getShiShen(dgz[0], ygz[0]));
    ssArray.push(this.getShiShen(dgz[0], mgz[0]));
    ssArray.push("日");
    ssArray.push(this.getShiShen(dgz[0], tgz[0]));

    var tgArray = [];
    tgArray.push("天：");
    tgArray.push(ygz[0]);
    tgArray.push(mgz[0]);
    tgArray.push(dgz[0]);
    tgArray.push(tgz[0]);

    var dzArray = [];
    dzArray.push("地：");
    dzArray.push(ygz[1]);
    dzArray.push(mgz[1]);
    dzArray.push(dgz[1]);
    dzArray.push(tgz[1]);

    var cgArray = [];
    cgArray.push("人：");
    cgArray.push(this.CG[this.ZHI.indexOf(ygz[1])]);
    cgArray.push(this.CG[this.ZHI.indexOf(mgz[1])]);
    cgArray.push(this.CG[this.ZHI.indexOf(dgz[1])]);
    cgArray.push(this.CG[this.ZHI.indexOf(tgz[1])]);

    var wxArray = ["五行：", "木", "火", "土", "金", "水"];
    var wcArray = this.getWXCount(ygz + mgz + dgz + tgz);

    var dayun = this.getDayun(options.sex, ygz, mgz);

    var yssArray = [];
    var ytgArray = [];
    var ydzArray = [];
    var yswArray = [];
    var ydyArray = [];
    var qiyunYear = this.getDayunYear(options.sex, ygz, d, options.time);

    for(var i=0; i<dayun.length; i++) {
      ydyArray.push(qiyunYear);
      yssArray.push(this.getShiShen(dgz[0],dayun[i][0]));
      ytgArray.push(dayun[i][0]);
      ydzArray.push(dayun[i][1]);
      yswArray.push(this.getShengWang(dgz[0], dayun[i][1]));
      qiyunYear += 10;
    }


    var lnssArray = [];
    var lngzArray = [];
    var lnyArray = [];

    var lny = parseInt(new Date().getFullYear() - 1);
    for(var i=0; i<8; i++, lny++){
      lnyArray.push(lny);
      var lnIdx = (lny - 1900 + 36)%60;
      var lnGZ = this.getGanzhi(lnIdx);
      lngzArray.push(lnGZ);
      var ss = this.getShiShen(dgz[0], lnGZ[0]);
      lnssArray.push(ss);
    }
     this.setData({
      dateStr: dateStr, 
      lunarStr: lunarStr, 
      sex : options.sex,
      ssArray: ssArray,
      tgArray: tgArray,
      dzArray: dzArray,
      cgArray: cgArray,
      wxArray: wxArray,
      wcArray: wcArray,
      yssArray: yssArray,
      ytgArray: ytgArray,
      ydzArray: ydzArray,
      yswArray: yswArray,
      ydyArray: ydyArray,
      lnssArray: lnssArray,
      lnyArray: lnyArray,
      lngzArray: lngzArray      
     });

  },
  getShengWang: function(me, dizhi){
    var table = [11,6, 2, 9, 2, 9, 5, 0, 8, 3];
    var ganIdx = this.GAN.indexOf(me);
    var zhiIdx = this.ZHI.indexOf(dizhi);
    var index = -1;
    if (ganIdx%2===0) {
      index = table[ganIdx] + zhiIdx;
    } else {
      index = table[ganIdx] - zhiIdx;
    }
    index = (index + 12 ) % 12;
    return this.SWSJ[index];
  },
  getDayun: function (sex, ygz, mgz) {
      var dayun = [];
      var step = -1;
    //console.log(this.GANYY[this.GAN.indexOf(ygz[0])] );
    if (sex == 0 && this.GANYY[this.GAN.indexOf(ygz[0])] ==="+") {
        step = 1;
    } else if (sex == 1 && this.GANYY[this.GAN.indexOf(ygz[0])] === "-") {
        step = 1;
      }
      var idx = this.getGanZhiIndex(mgz);
      for (var i=0; i<8; i++){
        idx += step;
        dayun.push(this.getGanzhi((idx+60)%60));
      }
      return dayun;
  },
  getGanZhiIndex: function(gz){
    if(this.LSJZ==null){
      this.LSJZ = {};
      for(var i=0; i<60; i++){
        this.LSJZ[this.getGanzhi(i)] = i;
      }
    }
    return this.LSJZ[gz];
  },
  getGanzhi: function(idx){
    return this.GAN[idx%10] + this.ZHI[idx%12];
  },
  getWXCount: function(str){
    var array = ["", 0, 0, 0, 0, 0];
    for (var k = 0; k < str.length; k++) {
      var wxIdx = -1;
      if (this.GAN.indexOf(str[k]) >= 0) {
        wxIdx = this.WX.indexOf(this.GANWX[this.GAN.indexOf(str[k])]);
      } else {
        wxIdx = this.WX.indexOf(this.ZHIWX[this.ZHI.indexOf(str[k])]);
      }
      array[wxIdx+1] += 1;
    }
    return array;
  },
  getTimeGanZhi: function(dateGan, timeIdx) {
      var dateGanIdx = this.GAN.indexOf(dateGan);
      var zhi = this.ZHI.charAt(timeIdx);
      var zhiIndex = this.ZHI.indexOf(zhi);
      var ganIndex = (2 * (dateGanIdx % 5) + zhiIndex )% 10;
      return this.GAN[ganIndex] + this.ZHI[zhiIndex];
  },
  getShiShen: function(me, gan){
    var result = "";
    
    var a = this.YYWX[me];
    var b = this.YYWX[gan];

    var yy = (a.yy != b.yy) ? 0 : 1;
    var diff = (b.wx +5 - a.wx)%5;

    var table = [["劫", "比"], ["伤", "食"], ["财", "才"], ["官", "煞"], ["印", "枭"]];
    return table[diff][yy];
  },
  getDayunYear: function(sex, ygz, date, time) {
    var step = -1; 
    var ygzIdx = this.GAN.indexOf(ygz[0]);
    if ((sex == 0 && ygzIdx%2===0) || (sex == 1 && ygzIdx %2===1)){
      step =1;
    }
    //console.log("sex : " + sex + "step:" + step);
    var jqArray = "立春|惊蛰|清明|立夏|芒种|小暑|立秋|白露|寒露|立冬|大雪|小寒";
    var dayCount = 0;
    var dateDiff = 0;

    var secs = 24 * 60 * 60 * 1000;
    for (var i = date; ; i = new Date(tcal.TCal.getTime(i) + step * secs)) {
      var td = tcal.TCal.getTradDate(i); 
      if(td.jq!="" && jqArray.indexOf(td.jq)>-1) {
        dateDiff = Math.abs(((tcal.TCal.getTime(i) - tcal.TCal.getTime(date)) / secs));
        break;
      }
    }

    var hour = step > 0 ? (12 - time - 1) : time;
    if (dateDiff == 0) {
      return parseInt(date.getFullYear());
    }

    //var totalHours = (dateDiff-1)*12 + hour;

    //console.log("dateDiff" + dateDiff);
    var totalDays = parseInt(dateDiff/3) * 365 + (dateDiff%3) * 120 + hour * 10;

    //console.log(totalDays);

    var qiyunDate = new Date(tcal.TCal.getTime(date) + totalDays * secs);
    return parseInt(qiyunDate.getFullYear());
  }
})