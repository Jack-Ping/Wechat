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