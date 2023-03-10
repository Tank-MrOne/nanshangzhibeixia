// index.js
const imageCdn = 'https://tdesign.gtimg.com/miniprogram/images/';
const db = wx.cloud.database()
const buy_goods = db.collection('buy_goods')
Page({
    data: {
        current: 0,
        autoplay: true,
        duration: 500,
        interval: 5000,
        swiperList: [],
        swiperListObj: [],
        imageProps: {
            mode: "aspectFill"
        },
        copyright: 'Copyright © 2021-2031 TD.All Rights Reserved.',
        latitude2: 116.403119,
        longitude2: 39.913607,
        load: true,
    },

    onLoad() {
        wx.hideTabBar()
        const AppID = "wxe609b92150b3d486"
        const AppSecret = "1bb265691af16be8cb386993f07884ca"
        buy_goods.limit(5).get().then(res => {
            console.log('res', res)
            if (res.data && res.data.length) {
                this.setData({
                    swiperList: res.data.map(item => {
                        return item.img
                    }),
                    swiperListObj: res.data
                }, () => {
                    wx.getLocation({
                        type: 'gcj02',
                        success: ((res) => {
                            console.log("当前位置", res)
                            const distance_new = this.getDistance(res.latitude, res.longitude, this.data.latitude2, this.data.longitude2)
                            console.log('distance_new', distance_new)
                            wx.showTabBar()
                            this.setData({
                                load: false
                            })
                        }),
                        fail: (error) => {
                            this.setData({
                                load: false
                            })
                            wx.showTabBar()
                            console.log("fail", error)
                        }
                    })
                })
            }

        })

        // wx.getSetting({
        //     success(res) {
        //         if (!res.authSetting['scope.userInfo']) {
        //             wx.authorize({
        //                 scope: 'scope.userInfo',
        //                 success() {

        //                 },
        //                 fail(res) {
        //                     // 用户拒绝后
        //                     console.log('fail 用户信息', res)
        //                 }
        //             })
        //         }
        //         // 授权地理位置
        //         // if (!res.authSetting['scope.userLocation']) {
        //         //     wx.authorize({
        //         //         scope: 'scope.userLocation',
        //         //         success() {
        //         //             wx.getLocation({
        //         //                 type: 'wgs84',
        //         //                 success(res) {
        //         //                     const latitude = res.latitude
        //         //                     const longitude = res.longitude
        //         //                     const speed = res.speed
        //         //                     const accuracy = res.accuracy
        //         //                     console.log("latitude", latitude)
        //         //                     console.log("longitude", longitude)
        //         //                     console.log("speed", speed)
        //         //                     console.log("accuracy", accuracy)
        //         //                 }
        //         //             })
        //         //         },
        //         //         fail(res) {
        //         //             // 用户拒绝后
        //         //             console.log('fail 地址', res)
        //         //         }
        //         //     })
        //         // } else {
        //         //     wx.getLocation({
        //         //         type: 'wgs84',
        //         //         success(res) {
        //         //             const latitude = res.latitude
        //         //             const longitude = res.longitude
        //         //             const speed = res.speed
        //         //             const accuracy = res.accuracy
        //         //             console.log("latitude11", latitude)
        //         //             console.log("longitude11", longitude)
        //         //             console.log("speed11", speed)
        //         //             console.log("accuracy11", accuracy)
        //         //         },
        //         //         fail(res){
        //         //             console.log('地理位置获取失败')
        //         //         }
        //         //     })
        //         // }
        //     }
        // })
    },
    toFood(event) {
        getApp().globalData.distributionType = parseInt(event.currentTarget.dataset.type)
        wx.switchTab({
            url: '/pages/food/food'
        })
    },
    onTapSwiper(el) {
        console.log('index', el)
        console.log('swiperListObj', this.data.swiperListObj[el.detail.index])
        wx.navigateTo({
            url: '/pages/foodDetail/foodDetail?foodId='+this.data.swiperListObj[el.detail.index].id,
        })
    },
    // 计算距离
    Rad(d) {
        return d * Math.PI / 180.0;
    },
    getDistance(lat1, lng1, lat2, lng2) {
        // lat1 用户的纬度  lat2 目标的纬度
        // lng1 用户的经度  lng2 目标的经度
        let radLat1 = this.Rad(lat1);
        let radLat2 = this.Rad(lat2);
        let a = radLat1 - radLat2
        let b = this.Rad(lng1) - this.Rad(lng2)
        let result = 2 * Math.sign(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        result = result * 6378.137;
        result = Math.round(result * 10000) / 10000;
        result = result.toFixed(1) + 'km'
        console.log('经纬度计算的距离' + result)
        return result
    }
})