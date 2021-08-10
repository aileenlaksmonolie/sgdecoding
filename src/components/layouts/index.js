import MainLayout from './MainLayout'

export default {
  install (Vue) {
    if (this.installed) {
      return
    }

    Vue.component('MainLayout', MainLayout)

    this.installed = true
  }
}
