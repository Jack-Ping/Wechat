/*
* Developer: yunjie.ping
* FinalVersion: 2018/1/9
*
* */
Page({
  data: {
    code:''
  },
  onLoad: function (option) {
    this.setData({
      code: option.COUPONCODE
    })
  }
});