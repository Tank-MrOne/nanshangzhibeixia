// pages/foodDetail/foodDetail.js
const db = wx.cloud.database()
const buy_goods = db.collection('buy_goods')
const good_images = db.collection('good_images')
const buy_orders = db.collection('buy_orders')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        current: 0,
        autoplay: true,
        duration: 500,
        interval: 5000,
        swiperList: [],
        imageProps: {
            mode: "aspectFill"
        },
        food: {},
        tasteValue: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        good_images.where({
            good_id: options.foodId
        }).get().then(res => {
            if (res.data && res.data.length) {
                this.setData({
                    swiperList: res.data.map(item => {
                        return item.url
                    })
                })
            }
        })
        buy_goods.where({
            id: options.foodId
        }).get().then(res => {
            console.log('res', res)
            if (res.data && res.data.length) {
                this.setData({
                    food: res.data[0]
                })
            }
        })
    },
    onChange1(e) {
        this.setData({
            tasteValue: e.detail.value
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