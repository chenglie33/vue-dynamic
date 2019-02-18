import dynamic from './Dynamic.vue'
/**
 * 使用方式：
 * 全局注入插件 Vue.use(Dynamic, {plugin: {     plugin =>注入项目中实际使用的插件
  router,
  store,
  i18n
}})
this.$dynamic（dom, ComponentsView, data, emit, slots）：promise
dom=>实际使用中你的动态元素将会插入的节点
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
 */

let DynamicUi = {}
DynamicUi.install = function (Vue, options) {
  const DynamicConstructor = Vue.extend(dynamic)
  let instance
  let Dynamic = async function (dom, ComponentsView, data, emit, slots = {}) {
    let plugins = options.plugin || {}
    instance = new DynamicConstructor({
      ...plugins
    })
    if (typeof ComponentsView !== 'object') {
      instance.$slots.default = [
        instance.$createElement(Vue.compile(ComponentsView))
      ]
      instance.vm = instance.$mount()
      innerHtml(dom, instance)
      return { instance }
    }
    let ChildComponents = Vue.extend(ComponentsView)

    let childInstance = new ChildComponents({
      ...plugins,
      propsData: { ...data }
    })
    for (var k in slots) {
      let v = slots[k]
      if (typeof v.template !== 'object') {
        childInstance.$slots[k] = [
          childInstance.$createElement(Vue.compile(v.template)) // 特殊情况 当使用静态模板的时候无法使用vue的模板语法，出现获取不到值的情况，建议可以将所有的值或者事件放在Promise之后在执行  注释：这种添加方式相当于将slot设置为默认的模板样式，与我们在<template>中添加存在区别
          // TODO：结局方案 createElement可能在传入的时候包含连个参数，在第二个参数里面注入静态模板中需要的参数以此解决问题
        ]
      }
      let ChidSlot = Vue.extend(v.template)
      let chidSlotInstance = new ChidSlot({
        propsData: {...v.pdata}
      })
      childInstance.$slots[k] = [chidSlotInstance.$mount()._vnode]
    }
    instance.$slots.default = [childInstance.$mount()._vnode]
    childInstance._events = { ...emit }
    instance.vm = instance.$mount()
    innerHtml(dom, instance)
    return { instance, childInstance }
  }
  function innerHtml (dom, instance) {
    if (!dom || dom === '') {
      document.body.append(instance.vm.$el)
    } else {
      document.getElementById(dom).appendChild(instance.vm.$el)
    }
  }
  Vue.prototype.$dynamic = Dynamic
}
export default DynamicUi
