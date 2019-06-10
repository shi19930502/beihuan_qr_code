// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import stores from './store/store.js'
import App from './App'
import router from './router'
import mixin from './mixin/mixin.js'
import {Layout} from 'vue-ydui/dist/lib.rem/layout';
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};
Number.prototype.toFixed = function(s){
    return (Math.round(this * Math.pow( 10, s ) )/ Math.pow( 10, s )).toString();
}
//input
var u = navigator.userAgent;
var isPc=isPcOS()
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
if(isIOS&&!isPc&&false) {
	document.body.addEventListener("click", function(e) {
		if(e.target.nodeName == "INPUT") {
			if(e.target.type == "text" || e.target.type == "password") {
				e.target.onblur = function() {
					window.setTimeout(function() {
						if('scrollIntoView' in document.activeElement) {
							document.activeElement.scrollIntoView();
						} else {
							document.activeElement.scrollIntoViewIfNeeded();
						}
					}, 100);
				}
			}
		} else if(document.activeElement.tagName == "TEXTAREA") {
			e.target.onblur = function() {
				window.setTimeout(function() {
					if('scrollIntoView' in document.activeElement) {
						document.activeElement.scrollIntoView();
					} else {
						document.activeElement.scrollIntoViewIfNeeded();
					}
				}, 100);
			}
		}
	})
}
//获取是否PC端
function isPcOS() {
	var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
	if(isWin) return true; //'Win'
	var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
	if(isMac) return true; //'Mac'
	var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
	if(isUnix) return true; //'Unix'
	var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
	if(isLinux) return true; //'Linux'
}
const store = new Vuex.Store(stores)
import 'vue-ydui/dist/ydui.base.css';
Vue.component(Layout.name, Layout)
Vue.config.productionTip = false 
//设置为 false 以阻止 vue 在启动时生成生产提示。
//# sourceMappingURL=auto-size.js.map
/* eslint-disable no-new */
document.title=config.title;

router.afterEach((to, from) => {
	if(document.getElementsByClassName('yd-dialog-white-mask')[0]){
		document.getElementsByClassName('yd-dialog-white-mask')[0].remove()
	}
	Loading.close();
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mixins: [mixin],
})
