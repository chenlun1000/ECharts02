//index.js
//获取应用实例
const app = getApp()
import * as echarts from '../../ec-canvas/echarts';

Page({
  data: {
    // 默认数据
    date01:'2019-6-1',
    date02: '2019-6-7',
    //折现属性
    series:[{
      data: ([34, 66, 45, 59, 37, 85, 60]).reverse(),
      name:'有效成交额',
      smooth:false,
      type:'line'
    }, {
        data: ([15, 12, 7, 23, 3, 14, 22]).reverse(),
        name: '预计佣金',
        smooth: false,
        type: 'line'
      }],
    // 默认7天
    ascissaData:(['6-1','6-2','6-3','6-4','6-5','6-6','6-7']).reverse(),
    ec: {
      lazyLoad: true
    }
  },

  onLoad: function () {
    this.echartsComponnet = this.selectComponent('#mychart');
    this.init_echarts()
  },

  // 日期选择器
  bindDateChange01: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date01: e.detail.value
    })
  },
  bindDateChange02: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date02: e.detail.value
    })
  },

  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      Chart.setOption(this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },

  // 获取数据
  getOption: function () {
    var that = this
    console.log(that.data.series)
    console.log(that.data.ascissaData)
    var legendList = []
    for (var i in that.data.series) {
      var obj = {
        name: that.data.series[i].name,
        icon: 'circle',
        textStyle: {
          color: '#000000',
        }
      }
      legendList.push(obj)

      that.data.series[i].data.reverse()
    }
    var option = {
      // 折线图线条的颜色
      color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      // 折线图的线条代表意义
      legend: {
        itemWidth: 5, //小圆点的宽度
        itemGap: 25,
        selectedModel: 'single', //折线可多选
        inactiveColor: '#87CEEB',
        data: legendList,
        bottom: 0,
        left: 30,
        z: 100
      },
      // 刻度
      grid: {
        containLabel: true
      },
      // 悬浮图标
      tooltip: {
        show: true,
        trigger: 'axis',
        position: function (pos, params, dom, rect, size) {
          var obj = {
            top: 60
          };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: that.data.ascissaData.reverse(),
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLine: { //y轴坐标是否显示
          show: false
        },
        axisTick: { //y轴刻度小标是否显示
          show: false
        }
      },
      series: that.data.series
    }
    return option
  },

  // 获取折线图数据
  getChartData: function () {
    var that = this
    console.log(that.data.date01, that.data.date02)
    wx.request({
      url: 'http://weixin.frp.kaigejava.com/salary/getSalaryByDate',
      data: {
        start: that.data.date01,
        end: that.data.date02,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res);
        var data = res.data.data
        that.setData({
          series: data.series,
          ascissaData: data.ascissaData //默认横坐标
        })
        that.init_echarts()
      }
    })
  },
})
