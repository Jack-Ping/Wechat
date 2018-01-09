/*
* Developer: yunjie.ping
* FinalVersion: 2018/1/9
*
* */
Page({
  // BasicDate
  data: {
    placeholderColor: 'gray',
    codeLength: 7,
    regularExpression: {
      name: /[`~!@#$%^&*_+<>{}\/'[\]]/,
      phone: /^1(3|4|5|7|8)\d{9}$/,
      mail: /^[A-Za-z0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/
    },
    formInfo: {
      nameError: false,
      mobileError: false,
      mailError: false,
      nameFocus: false,
      mobileFocus: false,
      mailFocus: false,
      prename: '',
      premobile: '',
      premail: ''
    },
    formVal: {
      name:'',
      mobile:'',
      mail:'',
      pickerData: 'YYYY-MM-DD'
    }
  },
  // backup input value
  onLoad: function () {
    this.setData({
      backUp: {
        formVal: this.data.formVal,
        placeholderColor: this.data.placeholderColor
      }
    })
  },
  // bind Date Picker change event
  changeData: function (e) {
    this.setData({
      pickerData: e.detail.value,
      placeholderColor: 'black'
    })
  },
  // validation function
  validate: function (rule, text, reverse) {
    let isreverse = reverse || false;
    return isreverse ? !!text && !rule.test(text) : !!text && rule.test(text)
  },
  // error function
  showError: function (name, content, preContent) {
    let that = this,
      errorName = name + 'Error',
      focusName = name + 'Focus',
      preName = 'pre' + name,
      temp = this.data.formInfo;
    if (preContent !== temp[preName]) {
      temp[errorName] = true;
      temp[preName] = preContent;
      this.setData({formInfo: temp},function () {
        wx.showModal({
          title: 'Error',
          content: content,
          showCancel: false,
          success: function () {
            temp[focusName] = true;
            that.setData(temp)
          }
        })
      })
    }
  },
  // clean error style
  cleanError: function (name) {
    let errorName = name + 'Error',
      focusName = name + 'Focus',
      preName = 'pre' + name,
      temp = this.data.formInfo;
    temp[errorName] = false;
    temp[focusName] = false;
    temp[preName] = '';
    this.setData({formInfo: temp});
  },
  // input validation
  validateName: function (e) {
    this.validate(this.data.regularExpression.name, e.detail.value) ? this.showError('name','Invalid Name !',e.detail.value) : this.cleanError('name');
  },
  validateMobile: function (e) {
    this.validate(this.data.regularExpression.phone, e.detail.value, true) ? this.showError('mobile', 'Invalid Phone Number !',e.detail.value) : this.cleanError('mobile');
  },
  validateMail: function (e) {
    this.validate(this.data.regularExpression.mail, e.detail.value, true) ? this.showError('mail', 'Invalid Email !',e.detail.value) : this.cleanError('mail');
  },
  //validation function end
  //reset input value
  cleanForm: function () {
    this.setData(this.data.backUp)
  },
  //save function include repeatability detection
  saveDate: function (data) {
    let arr = wx.getStorageSync('LoginInfo') || [],
      checkArr = ['mobile','email'],
      isBreak = false;

    try{
      checkArr.forEach(function (value) {
        try{
          arr.forEach(function (item) {
            if (item[value] === data[value]) {
              throw value
            }
          })
        } catch (e) {
          isBreak = true;
        }

        if (isBreak) {
          throw value
        }
      });
    } catch(e) {
      wx.showModal({
        title: 'Error',
        content: 'Duplicate Information :' + e,
        showCancel: false
      });
    }

    if (!isBreak) {
      arr.push(data);

      wx.setStorage({
        key:'LoginInfo',
        data: arr
      });

      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })

      return true;
    } else {
      return false;
    }
  },
  //save button function include COUPON CODE create
  submit: function (e) {
    let isFillIn = true;

    for (let i in e.detail.value) {
      if (!e.detail.value[i]) {
        wx.showModal({
          title: 'Error',
          content: 'Please fill in the form !',
          showCancel: false
        });
        isFillIn = false;
        break;
      }
    }

    if (isFillIn && this.saveDate(e.detail.value)) {
      this.cleanForm();
      let CodeStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let COUPONCODE = '';

      for (let num = 0 ; num < this.data.codeLength ; num++) {
        COUPONCODE += CodeStr[Math.floor(Math.random()*CodeStr.length)]
      }

      wx.navigateTo({
        url: '../logs/logs?COUPONCODE=' + COUPONCODE
      })
    }
  }
});