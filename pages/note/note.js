// pages/note/note.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      notes: ["千里之行，始于足下", "天行健，君子以自强不息"],
      curr: -1,
      addFlag: false,
      inputValue: ""
  },
  onAdd: function(e) {
    
    this.setData({ addFlag: true, inputValue: ""});
  },
  onSubmit: function (e) {
    this.setData({ addFlag: false });
    var note = e.detail.value.noteText;
    var notes = this.data.notes;
    notes.push(note);
    this.setData({notes: notes});
    wx.setStorage({
      key: "notes",
      data: notes,
    });
  },
  onTxtClick: function (e) {
    var curr = e.currentTarget.dataset.curr;
    if (curr == this.data.curr) {
      curr = -1;
    }
    this.setData({ curr: curr });
    wx.setStorage({
      key: "notes",
      data: notes,
    });
  },
  onDel: function (e) {
    var curr = parseInt(e.currentTarget.dataset.curr);
    if (curr >= 0){
      this.data.notes.splice(curr, 1);
    }
    this.setData({ notes: this.data.notes });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var notes = wx.getStorageSync("notes");
    if (notes !="") {
     this.setData({ notes: res.data });
    }

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