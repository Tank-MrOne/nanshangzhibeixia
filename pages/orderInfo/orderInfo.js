// pages/orderInfo/orderInfo.js
const app = getApp()
const db = wx.cloud.database()
const buy_orders = db.collection('buy_orders')
let remarks = ''
Page({

    /**
     * 页面的初始数据
     */
    data: {
        collectionId: '',
        showWithInput: false,
        address: "",
        remarks: "",
        coupon: "",
        payType: 1,
        order: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // id: "0cd95aee63e7868f026b77a176a2121d"
        // orderStatus: "0"
        buy_orders.doc(options.id).get().then(res => {
            console.log('res', res)
            this.setData({
                order: res.data,
                collectionId: options.id,
                remarks: res.data.remarks ? res.data.remarks : '',
                payType: res.data.payType ? res.data.payType : 1,
            })
        })
    },
    changeRemarks() {
        remarks = this.data.remarks
        this.setData({
            showWithInput: true,
            remarks: remarks
        })
    },
    changeRemarksInput(event) {
        this.setData({
            remarks: event.detail.value
        })
    },
    clearRemarksInput() {
        this.setData({
            remarks: ''
        })
    },
    changePayType(event) {
        this.setData({
            payType: parseInt(event.currentTarget.dataset.type)
        }, () => {
            buy_orders.doc(this.data.collectionId).update({
                data: {
                    payType: parseInt(event.currentTarget.dataset.type)
                }
            })
        })
    },
    closeDialog(event) {
        if (event.type === "cancel") {
            this.setData({
                remarks: remarks
            })
        } else if (event.type === 'confirm') {
            buy_orders.doc(this.data.collectionId).update({
                data: {
                    remarks: this.data.remarks
                }
            })
        }
        this.setData({
            showWithInput: false
        });
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