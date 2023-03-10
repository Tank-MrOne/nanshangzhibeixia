const app = getApp()
const db = wx.cloud.database()
const buy_orders = db.collection('buy_orders')
Page({
    offsetTopList: [],
    data: {
        items: [],
        sideBarIndex: 0,
        scrollTop: 0,
        categories: [],
        visible: false,
        orders: [],
        totalAmount: 0,
        imageOnTop: false,
        showWarnConfirm: false
    },
    onLoad(options) {
        wx.cloud.database().collection('buy_goods').get().then(res => {
            if (res.data && res.data.length) {
                this.setData({
                    items: res.data
                }, () => {
                    wx.cloud.database().collection('buy_goods_class').get().then(result => {
                        if (result.data && result.data.length) {
                            this.setData({
                                categories: result.data.map(items => {
                                    let arr = this.data.items.filter(el => el.class === items.classId)
                                    arr = arr.map(el => {
                                        el.num = 0;
                                        el.choiceTaste = 0
                                        el.tasteNum = {}
                                        el.tasteNum[el.choiceTaste] = 0
                                        return el
                                    })
                                    return {
                                        label: items.className,
                                        title: items.className,
                                        items: arr,
                                    }
                                })
                            })
                        }
                    }).then(() => {
                        const query = wx.createSelectorQuery().in(this);
                        query
                            .selectAll('.title')
                            .boundingClientRect((rects) => {
                                this.offsetTopList = rects.map((item) => item.top);
                            })
                            .exec();
                    })
                })
            }
        })


    },
    onSideBarChange(e) {
        const {
            value
        } = e.detail;

        this.setData({
            sideBarIndex: value,
            scrollTop: this.offsetTopList[value]
        });
    },
    onScroll(e) {
        const {
            scrollTop
        } = e.detail;
        const threshold = 50; // 下一个标题与顶部的距离

        if (scrollTop < threshold) {
            this.setData({
                sideBarIndex: 0
            });
            return;
        }

        const index = this.offsetTopList.findIndex((top) => top > scrollTop && top - scrollTop <= threshold);

        if (index > -1) {
            this.setData({
                sideBarIndex: index
            });
        }
    },
    handlePopup() {
        this.setData({
            visible: true
        });
    },
    onVisibleChange(e) {
        this.setData({
            visible: e.detail.visible,
        });
    },
    // 添加到购物车
    addFoodToOrder(event) {
        let order = event.currentTarget.dataset.cargo
        let idx = event.currentTarget.dataset.index
        let choiceTaste = event.currentTarget.dataset.choicetaste
        let orders = this.data.orders
        let index = this.data.orders.findIndex(item => item.id === order.id && item.choiceTaste === order.choiceTaste)
        let index2 = this.data.categories[idx].items.findIndex(item => item.id === order.id)
        let choiceNum = this.data.categories[idx].items[index2].tasteNum[choiceTaste] ? this.data.categories[idx].items[index2].tasteNum[choiceTaste] : 0
        let num = choiceNum + 1
        this.setData({
            ['categories[' + idx + '].items[' + index2 + '].tasteNum['+choiceTaste+']']: num
        })
        if (index === -1) {
            order.orderNum = 1
            order.idx = idx
            orders.push(order)
            this.setData({
                orders: orders
            }, () => {
                this.totalAmountCount()
            })
        } else {
            this.setData({
                ['orders[' + index + '].orderNum']: num
            }, () => {
                this.totalAmountCount()
            })
        }
        // wx.cloud.database().collection('buy_orders').add({
        //     data:{

        //     }
        // })
    },
    // 删除到购物车
    delFoodToOrder(event) {
        let order = event.currentTarget.dataset.cargo
        let idx = event.currentTarget.dataset.index
        let choiceTaste = event.currentTarget.dataset.choicetaste
        let orders = this.data.orders
        let index = this.data.orders.findIndex(item => item.id === order.id && item.choiceTaste === order.choiceTaste)
        let index2 = this.data.categories[idx].items.findIndex(item => item.id === order.id)
        let choiceNum = this.data.categories[idx].items[index2].tasteNum[choiceTaste] ? this.data.categories[idx].items[index2].tasteNum[choiceTaste] : 0
        let num = choiceNum - 1
        this.setData({
            ['categories[' + idx + '].items[' + index2 + '].tasteNum['+choiceTaste+']']: num
        })
        if (num === 0) {
            orders.splice(index, 1)
            this.setData({
                orders: orders
            }, () => {
                this.totalAmountCount()
            })
            if (orders.length < 1) {
                this.setData({
                    visible: false,
                    totalAmount: 0
                });
            }
        } else {
            this.setData({
                ['orders[' + index + '].orderNum']: num
            }, () => {
                this.totalAmountCount()
            })
        }
    },
    // 选择口味
    choiceTaste(event){
        let order = event.currentTarget.dataset.cargo
        let idx = event.currentTarget.dataset.index
        let tasteIndex = event.currentTarget.dataset.taste
        this.setData({
            ['categories[' + idx + '].items[' + order + '].choiceTaste']: tasteIndex
        },()=>{
            this.totalAmountCount()
        })
    },
    // 计算总金额
    totalAmountCount() {
        let count = 0
        this.data.orders.forEach(item => {
            let a = item.specification[item.choiceTaste].price * 100 * item.orderNum
            count += a
        })
        this.setData({
            totalAmount: count / 100
        })
    },
    // 清空购物车
    clearAllOrder() {
        let categories = this.data.categories
        console.log('clearAllOrder', categories)
        categories.forEach(item => {
            item.items.forEach(el => {
                el.num = 0
            })
        })
        this.setData({
            categories: categories,
            orders: [],
            visible: false,
            totalAmount: 0
        })
    },
    // 结账
    settleAccounts() {
        if (app.globalData.isLogin) {
            if (app.globalData.distributionType == 0) {
                this.setData({
                    imageOnTop: true
                })
            } else {
                console.log(new Date().getTime(), db.serverDate())
                buy_orders.add({
                    data: {
                        orderStatus: 0, // 0 未支付  1 已支付  2 已完成   3 已退款  
                        distributionType: app.globalData.distributionType,
                        orders: this.data.orders,
                        totalAmount: this.data.totalAmount,
                        create_time: db.serverDate(),
                        payType: 1,
                    }
                }).then(res => {
                    this.clearAllOrder()
                    wx.navigateTo({
                        url: '/pages/orderInfo/orderInfo?orderStatus=0&id=' + res._id,
                    })
                    // app.globalData.tabIndex = 0
                    // wx.switchTab({
                    //     url: '/pages/order/order',
                    // })
                }).catch(error => {
                    console.log('error', error)
                })
            }
        } else {
            this.setData({
                showWarnConfirm: true
            })
        }

    },
    closeDialog(event) {
        app.globalData.distributionType = event.type === 'confirm' ? 2 : 1
        this.setData({
            imageOnTop: false
        }, () => {
            this.settleAccounts()
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
});