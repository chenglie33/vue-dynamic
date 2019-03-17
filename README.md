# vue-dynamic


> 解决自定义弹出层组件的复用问题

## Build Setup

``` bash
# install dependencies
npm i vue-dynamic-plugin

#how to use
import Dynamic from vue-dynamic-plugin
Vue.use(Dynamic, {plugin: {     plugin =>注入项目中实际使用的插件
  router,
  store,
  i18n
}})
this.$dynamic（dom, ComponentsView, data, emit, slots）：promise
dom=>实际使用中你的动态元素将会插入的节点 注意是dom节点(this.$ref.xx || document.getelementby)
ComponentsView=>可以传入静态dom节点或者Vue模板
data=>ComponentsView中需要的props数据
emit=>事件传递事件   {'eventName':[...method]}  一般使用在子传父的事件绑定中 由$emit('eventName',data)调用
slots=>ComponentsView节点中如果出现插槽时使用
方法的实现由Promise完成
this.$dynamic().then({instance, childInstance })
instance.destroyUi()销毁添加的元素 同时执行destroy周期
案例：
 this.$dynamic('ddd', ViewDetail, { test: 1 }, {
        'closePage': [this.closePage.bind(this)],
        'refresh': [this.refresh.bind(this)],
        'update': [this.getList.bind(this)]
      },{test:{scope:1,template:Testui, pdata:{test: '测试propData'}}}).then(({ instance, childInstance }) => {
          this.s.push(childInstance)
        })
```




