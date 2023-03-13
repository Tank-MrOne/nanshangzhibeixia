// pages/order/order.js
const app = getApp()
const db = wx.cloud.database()
const buy_orders = db.collection('buy_orders')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showWarnConfirm: false,
        showMultiTextAndTitle: false,
        orderList: [],
        defaultValue: 0,
        orderInfo: [],
        orderId: '',
    },
    onShow() {
        if (app.globalData.isLogin) {
            this.setData({
                defaultValue: app.globalData.tabIndex
            }, () => {
                this.findOrder()
            })
        } else {
            wx.cloud.callFunction({
                name: 'getUserInfo'
            }).then(res => {
                let that = this
                let openId = res.result.event.userInfo.openId
                app.globalData.openId = openId
                wx.setStorageSync('user_open_id', openId)
                wx.cloud.database().collection('users').where({
                        _openid: openId
                    })
                    .get({
                        success: function (res) {
                            if (res.data.length) {
                                app.globalData.isLogin = true
                            } else {
                                that.setData({
                                    showWarnConfirm: true
                                })
                            }
                        }
                    })
            })
        }
    },
    findOrder() {
        if (this.data.defaultValue == 4) {
            buy_orders.where({
                _openid: app.globalData.openId,
            }).get().then(res => {
                this.setData({
                    orderList: res.data.reverse()
                })
            })
        } else {
            buy_orders.where({
                _openid: app.globalData.openId,
                orderStatus: this.data.defaultValue
            }).get().then(res => {
                this.setData({
                    orderList: res.data.reverse()
                })
            })
        }

    },
    onTabsChange(event) {
        this.setData({
            defaultValue: parseInt(event.detail.value)
        }, () => {
            this.findOrder()
        })
    },
    onTabsClick(event) {
        // console.log(`Click tab, tab-panel value is ${event.detail.value}.`);
    },
    changeOrderInfo(event) {
        this.setData({
            showMultiTextAndTitle: true,
            orderInfo: event.currentTarget.dataset.order,
            orderId: event.currentTarget.dataset.oid
        })
    },
    closeDialog(event) {
        if (this.data.orderId) {
            if (event.detail.index === 2 && wx.getStorageSync('order')) {
                wx.showToast({
                    title: '购物车存在冲突',
                    icon: 'error',
                    duration: 2000
                })
                this.setData({
                    showMultiTextAndTitle: false
                });
                return
            }
            if (event.detail.index !== 0) {
                buy_orders.doc(this.data.orderId).remove({
                    success: (res) => {
                        if (event.detail.index === 1) {
                            this.findOrder()
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 2000
                            })
                        } else if (event.detail.index === 2) {
                            wx.setStorageSync('order', JSON.stringify(this.data.orderInfo))
                            wx.switchTab({
                                url: '/pages/food/food'
                            })
                        }
                    },
                    fail: (error) => {
                        console.log('失败', error)
                    }
                })
            }
        }
        this.setData({
            showMultiTextAndTitle: false
        });
    },
    closeDialog2(event) {
        if (event.type === 'confirm') {
            // wx.navigateTo({
            //     url: '/pages/login/login',
            // })
            wx.switchTab({
                url: '/pages/user/user',
            })
        }
        this.setData({
            showWarnConfirm: false
        });
    },
    pageToOrderInfo(event) {
        wx.navigateTo({
            url: '/pages/orderInfo/orderInfo?orderStatus=0&id=' + event.currentTarget.dataset.id,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

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