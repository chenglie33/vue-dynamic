/**
 * 使用方式：
 * 全局注入插件 Vue.use(Dynamic, {plugin: {
  router,
  store,
  i18n
}})
参数文档：
  Dynamic =>我们引入的插件
  plugin =>注入项目中实际使用的插件

工作流中的使用方式：=>this.$dynamic(dom, ComponentsView, data, emit, slots):promise
参数文档：
  dom=>实际使用中你的动态元素将会插入的节点
  ComponentsView=>可以传入静态dom节点或者Vue模板
  data=>ComponentsView中需要的props数据
  emit=>事件传递事件   {'eventName':[...method]}  子组件与父组件之间的相互通讯时使用
  slots=>ComponentsView节点中如果出现插槽时使用（可以为空）
  方法的实现由Promise完成
                                        |--  ComponentsView组件实例 包含所有的ComponentsView方法
  this.$dynamic().then({instance, childInstance })
                          |--dynamic组件实例，包含destroyUi方法
  instance.destroyUi()销毁添加的元素 同时执行destroy周期
使用环境：
  针对类似ViewDetail这样的需要动态插入的组件，类似全局的警告提示弹窗依旧建议使用notify插件
案例：
  this.$dynamic(document.getElementById('ddd'), ViewDetail, { test: 1 }, {
        'closePage': [this.closePage.bind(this)],
        'refresh': [this.refresh.bind(this)],
        'update': [this.getList.bind(this)]
      },{test:{template:Testui, pdata:{test: '测试propData'}}}).then(({ instance, childInstance }) => {
          this.s.push(childInstance)
        })
 */
