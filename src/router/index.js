import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
var _routerObj={
	name:'qr_index',
	redirect:'qr_index',
	path:'/',
	component: () => import('@/view/qrCode/qr_index.vue')
}
var _indexObj={
      path: '/qr_index',
      name: 'qr_index',
      component: () => import('@/view/qrCode/qr_index.vue')
    }
var _orderObj={
      path: '/qr_order',
      name: 'qr_order',
      component: () => import('@/view/qrCode/qr_order.vue')
    }
console.log(window.location)
if(window.location.href.indexOf('?')>=0&&window.location.search){
	config.isSearch=true
	var urlParamsArr=window.location.href.split('?')[1].split('#/')[0].split('&')
	var obj={}
	for(let a =0;a<urlParamsArr.length;a++){
		if(urlParamsArr[a].indexOf('=')){
//			console.log(urlParamsArr[a].split('=')[0])
			obj[urlParamsArr[a].split('=')[0]]=urlParamsArr[a].split('=')[1]
		}
	}
	Object.assign(config,obj)
	var paramsArr= config.state.split('_')
	config.paramsArr=paramsArr
	config.loginName=paramsArr[1]
	if(paramsArr[1]!='first'&&paramsArr[1]=='third'){
		_routerObj={
			name:'qr_index_tt',
			redirect:'qr_index_tt',
			path:'/',
			component: () => import('@/view/qrCode/qr_index_tt.vue')
		}
		_indexObj={
	      path: '/qr_index_tt',
	      name: 'qr_index_tt',
	      component: () => import('@/view/qrCode/qr_index_tt.vue')
	    }
		_orderObj={
	      path: '/qr_order_tt',
	      name: 'qr_order_tt',
	      component: () => import('@/view/qrCode/qr_order_tt.vue')
	   }
	}
}

export default new Router({
  routes: [
    _routerObj,
    _indexObj,
    _orderObj,
    {
      path: '/qr_login',
      name: 'qr_login',
      component: () => import('@/view/qr_login.vue')
    },
    {
      path: '/qr_success',
      name: 'qr_success',
      component: () => import('@/view/qrCode/qr_success.vue')
    },
    {
      path: '/qr_personage',
      name: 'qr_personage',
      component: () => import('@/view/qrCode/qr_personage.vue')
    },
    {
      path: '/qr_zs',
      name: 'qr_zs',
      component: () => import('@/view/qrCode/qr_zs.vue')
    },{
      path: '/qr_information',
      name: 'qr_information',
      component: () => import('@/view/qrCode/qr_information.vue')
    },{
      path: '/qr_update',
      name: 'qr_update',
      component: () => import('@/view/qrCode/qr_update.vue')
    },
  ]
})
