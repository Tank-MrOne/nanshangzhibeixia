// pages/login/login.js
import Message from 'tdesign-miniprogram/message/index';
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
        nickname: "",
        comeFrom: "",
        isLogin: false,
    },
    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail
        this.setData({
            avatarUrl,
        })
    },
    getNickname(e) {
        this.setData({
            nickname: e.detail.value
        })
    },
    registerUser() {
        if (this.data.nickname.trim().length > 0) {
            users.add({
                data: {
                    avatarUrl: this.data.avatarUrl,
                    nickname: this.data.nickname,
                    address: [],
                    balance: 0,
                    integral: 0
                },
                success: function (res) {
                    // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                    console.log('注册成功', res)
                    app.globalData.isLogin = true
                    wx.navigateBack()
                }
            })

        } else {
            Message.error({
                context: this,
                offset: [20, 32],
                align: "center",
                duration: 5000,
                content: '用户名不能为空',
            });
        }
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

    }
})