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
        order: [],
        orderNum: 0,
        orderPrice: 0
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
            if (res.data && res.data.length) {
                let storage = wx.getStorageSync('order')
                this.setData({
                    food: res.data[0],
                    order: storage ? JSON.parse(storage) : []
                }, () => {
                    this.getDetai()
                })
            }
        })
    },
    onChange1(e) {
        this.setData({
            tasteValue: e.detail.value
        }, () => {
            this.getDetai()
        });
    },
    // 获取数量和价格
    getDetai() {
        if (this.data.order.length === 0) {
            this.setData({
                orderNum: 0,
                orderPrice: this.data.food.specification[this.data.tasteValue].price
            })
        } else {
            let order = this.data.order.find(item => {
                return this.data.food.id === item.id && item.choiceTaste === this.data.tasteValue
            })
            this.setData({
                orderNum: order ? order.orderNum : 0,
                orderPrice: order ? ((this.data.food.specification[this.data.tasteValue].price * 1000) * order.orderNum) / 1000 : this.data.food.specification[this.data.tasteValue].price
            })
        }
    },
    // 添加
    addFoodToOrder() {
        if (this.data.food.id) {
            let obj = JSON.parse(JSON.stringify(this.data.food))
            obj.choiceTaste = this.data.tasteValue
            let order = this.data.order
            if (this.data.order.length === 0) {
                obj.orderNum = 1
                order.push(obj)
            } else {
                let food = this.data.order.find(item => {
                    return this.data.food.id === item.id && item.choiceTaste === this.data.tasteValue
                })
                let index = this.data.order.findIndex(item => {
                    return this.data.food.id === item.id && item.choiceTaste === this.data.tasteValue
                })
                if (food) {
                    obj.orderNum = food.orderNum + 1
                    order.splice(index, 1, obj)
                } else {
                    obj.orderNum = 1
                    order.push(obj)
                }
            }
            this.setData({
                order
            }, () => {
                this.getDetai()
            })
            wx.setStorageSync('order', JSON.stringify(order))
        }
    },
    // 删除
    delFoodToOrder() {
        if (this.data.food.id) {
            let obj = JSON.parse(JSON.stringify(this.data.food))
            obj.choiceTaste = this.data.tasteValue
            let order = this.data.order
            let food = this.data.order.find(item => {
                return this.data.food.id === item.id && item.choiceTaste === this.data.tasteValue
            })
            let index = this.data.order.findIndex(item => {
                return this.data.food.id === item.id && item.choiceTaste === this.data.tasteValue
            })
            if (food.orderNum === 1) {
                order.splice(index, 1)
            } else {
                obj.orderNum = food.orderNum - 1
                order.splice(index, 1, obj)
            }
            this.setData({
                order
            }, () => {
                this.getDetai()
            })
            wx.setStorageSync('order', JSON.stringify(order))
        }
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