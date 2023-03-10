// #de8cdc
App({
    onLaunch() {
        let that = this
        console.log('xxxxx')
        wx.cloud.init({
            env: 'cloud1-9g0beoqm1e8c1685'
        })
        let openId = wx.getStorageSync('user_open_id')
        if (openId) {
            that.globalData.openId = openId
            wx.cloud.database().collection('users').where({
                    _openid: that.globalData.openId
                })
                .get({
                    success: function (res) {
                        if (res.data.length) {
                            that.globalData.isLogin = true
                        }
                    }
                })
        } else {
            wx.cloud.callFunction({
                name: 'getUserInfo'
            }).then(res => {
                that.globalData.openId = res.result.event.userInfo.openId
                wx.setStorageSync('user_open_id', that.globalData.openId)
                wx.cloud.database().collection('users').where({
                        _openid: that.globalData.openId
                    })
                    .get({
                        success: function (res) {
                            if (res.data.length) {
                                that.globalData.isLogin = true
                            }
                        }
                    })
            })
        }
    },
    // onShow() {

    // },
    globalData: {
        openId: '',
        distributionType: 0, // 配送方式 0 未选择，1 自取 ， 2 快递
        tabIndex: 0
    }
})