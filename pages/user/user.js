// pages/user/user.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp()
const db = wx.cloud.database()
const users = db.collection('users')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: defaultAvatarUrl,
        nickname: '',
        balance: 0,
        integral: 0,
        isLogin: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let that = this
        if (app.globalData.isLogin) {
            this.setData({
                isLogin: app.globalData.isLogin
            })
            users.where({
                _openid: app.globalData.openId
            }).get({
                success: function (res) {
                    console.log('get', res.data)
                    that.setData({
                        avatarUrl: res.data[0].avatarUrl,
                        nickname: res.data[0].nickname,
                        integral: res.data[0].integral
                    })
                }
            })
        }

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    routerToLogin() {
        wx.navigateTo({
            url: '/pages/login/login',
        })
    },
    navToOrder(event) {
        app.globalData.tabIndex = parseInt(event.currentTarget.dataset.tab)
        wx.switchTab({
            url: '/pages/order/order',
        })
    }
})