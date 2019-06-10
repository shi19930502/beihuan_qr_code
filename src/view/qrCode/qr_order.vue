<template>
	<yd-layout id='qrOrder'>
		<comHeader :backgroundClass='false' :style='{height:"2.5rem"}'>
			<div class="people_message">
				
				<template v-if='$root.userInfo'>
					<div v-if='$root.userInfo.token' class="people_message_children people_message_children_people">
						<div class="people_message_name">
							昵称：{{$root.userInfo.nickName}}
						</div>
						<div class="people_message_tel">
							电话：{{$root.userInfo.loginName}}
						</div>
						<div class="papy_type papy_type_thr">
							<div style="font-size: .32rem;">支付类型：</div>
							<yd-radio-group v-model="radioVal">
						        <yd-radio val="1">现金支付</yd-radio>
						        <yd-radio  val="6">赊销</yd-radio>
						        <yd-radio :disabled='wxcodePic?false:true' val="2">微信支付</yd-radio>
							</yd-radio-group>
						</div>
					</div>
				</template>

				<div v-else class="people_message_children">
					<div class="select_radio">
						<div class="select_radio_title">身份选择:</div>
						<yd-radio-group v-model="youkeRadio">
						    <yd-radio val="1">新用户</yd-radio>
						    <yd-radio val="2">游客</yd-radio>
						</yd-radio-group>
					</div>
					<div v-show='youkeRadio==1' class="people_message_list">
						<img src="../../assets/img/login_icon_user.png" alt="" />
						<input :disabled="youkeRadio==2" v-model='form.buyerName' maxlength="20" class="message_input" type="text" :placeholder="namePlaceholder" />
					</div>
					<div v-show='youkeRadio==1' class="people_message_list">
						<img src="../../assets/img/login_icon_password.png" alt="" />
						<input :disabled="youkeRadio==2" type="number" pattern="\d*" ref='selectPhoneInput' v-model.number='phoneVal' :placeholder="phonePlaceholder" oninput="if(value.length>11)value=value.slice(0,11)" />
					</div>
					<div class="papy_type">
						<div style="font-size: .32rem;">支付类型：</div>
						<yd-radio-group v-model="radioVal">
					        <yd-radio val="1">现金支付</yd-radio>
					        <yd-radio val="2" :disabled='wxcodePic?false:true'>微信支付</yd-radio>
						</yd-radio-group>
					</div>
				</div>

			</div>
		</comHeader>
		<div class="content" :class="{gaodu_class:youkeRadio==2?true:false}" :style="{padding:$root.userInfo?'1.6rem .16rem .2rem .16rem':'2.62rem .16rem .2rem .16rem'}">
			<div class="content_list">
				<div class="list_title">
					<div class="list_title_double"></div>
					<div class="list_title_name	" v-if='dataList.length>0'>{{dataList[0].f_transporter_id}}({{dataList[0].sellerName}})</div>
					<div class="list_title_double"></div>
				</div>
				<!--v-if='wxcodePic'-->
				<div v-if='radioVal==2' class="money_code" >
					<img :src="$root.config.img_url+wxcodePic" alt="" />
					<p>长按识别或微信扫码支付</p>
				</div>
				<div class="list_goods" v-for='(item,index) in dataList'>
					<div class="goods_header">
						<img class="goods_header_img" v-if='item.f_sku_pic_url&&item.f_sku_pic_url!=null' :src="$root.config.img_url+item.f_sku_pic_url" alt="" />
						<img class="goods_header_img" v-else src="../../assets/img/img_moren@2x.png" alt="" />
						<div class="goods_header_right">
							<div class="goods_header_top">
								<div class="goods_header_name">{{item.productName}}【{{item.f_name}}】({{item.f_sku_weight}}{{item.proMeasureName}}/{{item.skuMeasureName}})</div>
								<div @click='dkbz(item)' class="goods_header_sqbz">{{item.dkbz?'收起':'备注'}}</div>
							</div>
							<div class="goods_header_bottom">
								<!--:style="{textDecoration:item.proMethodType==1&&item.skuMethodType==2&&item.f_charging_model==1?'line-through':'initial'}"-->
								<div  class="goods_header_dj">￥{{item.promotionPrice}}/{{item.skuMeasureName}}</div>
								<!--<div v-if='item.proMethodType==1&&item.skuMethodType==2&&item.f_charging_model==1' class="goods_header_dj">￥{{item.f_base_price}}/{{item.proMeasureName}}</div>-->
								<div class="goods_header_num">
									<span style="font-family: 'Avenir', Helvetica, Arial, sans-serif;">x</span> {{item.quantity}}
								</div>
								<!--v-if='item.proMethodType==1&&item.skuMethodType==2&&item.f_charging_model==1'-->
								<!--v-else-->
								<!--<div  class="goods_header_money">{{(item.quantity*item.f_base_price).toFixed(2)}}</div>-->
								<div  class="goods_header_money">{{(item.quantity*item.promotionPrice).toFixed(2)}}</div>
							</div>
						</div>
					</div>
					<div class="goods_bz" v-if='item.dkbz'>
						<input type="text" maxlength="100" v-model='item.comment' placeholder="输入商品备注信息" />
					</div>
				</div>

				<div class="allgoods">共{{dataList.length}}件商品</div>
				<input maxlength="100" v-model='form.comment' class="leave_message_input" type="text" placeholder="选填：给商家留言" />

				<div class="all_money">
					小计
					<span>￥{{allMoney}}</span>
				</div>
			</div>
			
		</div>
		<div class="qr_footer" slot='bottom'>
			<div class="order_money">
				总价：<span>￥{{allMoney}}</span>
			</div>
			<div @click='submitOrder' class="submit_order">确认订单</div>
		</div>
		

	</yd-layout>
</template>

<script>
	import comHeader from '../../components/comHeader.vue'
	import { TextArea } from 'vue-ydui/dist/lib.rem/textarea';
	import {Radio, RadioGroup} from 'vue-ydui/dist/lib.rem/radio';
	export default {
		components: { comHeader, [TextArea.name]: TextArea ,[Radio.name]:Radio,[RadioGroup.name]:RadioGroup,},
		data() {
			return {
				textAreaStyle: {},
				dataList: [],
				allMoney: 0,
				phoneVal: '',
				form: {
					buyerName: '',
					buyerId: '',
					shippingAdd: '',
					shippingAddId: '',
					sellerId: '',
					sellerName: '',
					comment: '',
					distributionType: 0,
					payType: 0,
					distributionTimeEnd: '',
					distributionTimeBegin: '',
					orderitems: '',
				},
				youkeToken:'',
				namePlaceholder:'请输入昵称(新用户必填)',
				phonePlaceholder:'请输入手机号码(新用户必填)',
				wxcodePic:'',
				radioVal:1,
				payType:0,
				youkeRadio:'1',
			}
		},
		created() {
			if(sessionStorage.getItem('qr_buyarr') && sessionStorage.getItem('qr_buyarr') != "[]") {
				if(JSON.parse(sessionStorage.getItem('qr_buyarr')).length > 0) {
					this.dataList = JSON.parse(sessionStorage.getItem('qr_buyarr'))
					var money = 0
					for(let a = 0; a < this.dataList.length; a++) {
						money = money + (this.dataList[a].quantity * this.dataList[a].promotionPrice)
					}
					this.allMoney = money.toFixed(2)
					if(this.dataList.length <= 0) {
						this.$router.back()
					}
					this.form.sellerName = this.dataList[0].sellerName
					this.form.sellerId = sessionStorage.getItem('qr_sellerId')
					var arr = []
					for(let a = 0; a < this.dataList.length; a++) {
						var o = {}
						o.productId = this.dataList[a].f_product_id
						o.productName = this.dataList[a].productName
						o.skuId = this.dataList[a].f_id
						o.skuName = this.dataList[a].f_name
						o.skuMeasure = this.dataList[a].skuMeasureName
						o.comment = this.dataList[a].comment
						o.quantity = this.dataList[a].quantity
						o.chargingModel = this.dataList[a].skuMethodType
						o.oriPrice = parseInt(parseFloat(this.dataList[a].promotionBasePrice) * 100)
						o.price = parseInt(parseFloat(this.dataList[a].promotionPrice) * 100)
						arr.push(o)
					}
					this.form.orderitems = JSON.stringify(arr)
				} else {
					this.$router.push({
						name: 'qr_index'
					})
				}
			} else {
				this.$router.push({
					name: 'qr_index'
				})
			}
			if(this.$root.userInfo) {
				this.form.buyerName = this.$root.userInfo.nickName
				this.form.buyerId = this.$root.userInfo.typeCode
				this.phoneVal = this.$root.userInfo.mobile
			}
		},
		watch: {
			youkeRadio:function(val){
				if(val==2){
					this.form.buyerName=''
					this.phoneVal=''
					this.namePlaceholder='禁止输入'
					this.phonePlaceholder='禁止输入'
				}else{
					this.namePlaceholder='请输入昵称(新用户必填)'
					this.phonePlaceholder='请输入手机号码(新用户必填)'
				}
			}
		},
		computed: {

		},
		mounted() {
			var paramsArr = this.$root.config.paramsArr
			console.log(paramsArr)
			this.$root.ajax({
				name: 'customer/getCustomerForWeiXin',
				params: {
					id:this.$root.config.paramsArr[2]
				}
			}).then(d => {
				this.wxcodePic=d.aaData.wxcodePic
			})
			//			this.textAreaStyle={
			//				width:this.$refs.textareaRef.offsetWidth+'px'
			//			}
		},
		methods: {
			submitOrder() {
				if(this.$root.userInfo) {
					if(this.radioVal==2){
						this.$dialog.confirm({
		                    title: '提示：',
		                    mes: '请确认是否已经微信支付?',
		                    opts: () => {
		                    	this.payType=2
		                        this.createOrder()
		                    }
		                });
					}else{
						this.createOrder()
					}
				} else {
					if(!this.form.buyerName&&this.youkeRadio==1) {
						this.$dialog.toast({
							mes: '新用户请输入昵称',
							timeout: 1500
						});
						return
					}
					if(!this.phoneVal&&this.youkeRadio==1) {
						this.$dialog.toast({
							mes: '新用户请输入手机号码',
							timeout: 1500
						});
						return
					} else {
						if(this.youkeRadio==1){
							var reg = /^1[345789]\d{9}$/
							if(reg.test(this.phoneVal)) {
								//this.lookUser();
							} else {
								this.$dialog.toast({
									mes: '请输入正确的手机号码',
									timeout: 1500
								});
								return
							}
						}
						
					}
					
					if(this.radioVal==2){
						this.$dialog.confirm({
		                    title: '提示：',
		                    mes: '请确认是否已经微信支付?',
		                    opts: () => {
		                    	this.payType=2
		                        //注册账号
								this.regUser()
		                    }
		                });
					}else{
						this.regUser()
					}
					
				}
			},
			createOrder(flg) {
				if(!flg){
					this.$dialog.loading.open('加载中，请稍后...');
				}
				this.form.payType=this.payType;
				this.form.createByOwn = 'zt';
				var params={}
				params=Object.assign({},params,this.form)
				if(this.youkeRadio==2){
					params.buyerId='-1';
					params.buyerName='游客';
					params.token=this.youkeToken
				}
				if(this.radioVal==6){
					params.payType=this.radioVal
				}
				console.log(this.form)
				this.$root.ajax({
					name: 'order/createOrder',
					closeAllLoading:true,
					errormsg: true,
					params: params,
					closeDia:true,
				}).then((d) => {
					if(d.success && d.state == 0) {
						this.updateOrder(d.aaData[0]).then((obj) => {
							this.$dialog.loading.close();
							if(obj.success && obj.state == 0) {
								this.$dialog.toast({
									mes: '保存成功',
									timeout: 1500,
									icon: 'success',
									callback: () => {
										sessionStorage.setItem('qr_buyarr', '')
										this.$router.push({
											name: 'qr_success',
											query: {
												orderUmber: d.aaData[0].orderUmber
											}
										})
									}
								});
							} else {
								this.$dialog.toast({
									mes: '下单成功,订单状态错误，请重新下单或者联系卖家',
									timeout: 3000,
									icon: 'error',
									callback: () => {
										sessionStorage.setItem('qr_buyarr', '')
										this.$router.push({
											name: 'qr_success',
											query: {
												orderUmber: d.aaData[0].orderUmber
											}
										})
									}
								});
							}

						})
					} else {
						this.$dialog.loading.close();
						//登录过期下单
						if(d.state==99){
							this.$dialog.confirm({
								title: '提示：',
								mes: `${d.msg}`,
								opts: [{
										txt: '取消',
										color: false,
										callback: () => {
											
										}
									},
									{
										txt: '重新登录',
										color: true,
										callback: () => {
											this.$router.push({name:'qr_login'})
										}
									}
								]
							});
						}else if(d.state==101){
							this.$dialog.confirm({
								title: '提示：',
								mes: `${d.msg},请联系商家!`,
								opts: [{
										txt: '确定',
										color: false,
										callback: () => {
											
										}
									},
								]
							});
						}else{
							this.$dialog.toast({
			                    mes: `${d.msg}`,
			                    timeout: 1500
			                });
						}
					}

				})
			},
			updateOrder(o) {
				return new Promise((resolve, reject) => {
					this.$root.ajax({
						closeAllLoading:true,
						closeDia: true,
						errormsg: true,
						name: 'order/quickChangeOrderStatus',
						params: {
							orderList: o.id,
							token:this.youkeToken
						}
					}).then((d) => {
						if(d.state==0&&d.success){
							this.updateOrderTwo(4, 2, o).then(() => {
								this.updateOrderTwo(5, 1, o, true).then((obj) => {
									resolve(obj)
								})
							})
						}else{
							this.$dialog.loading.close();
							this.$dialog.toast({
									mes: '下单成功,订单状态错误，请重新下单或者联系卖家',
									timeout: 3000,
									icon: 'error',
									callback: () => {
										sessionStorage.setItem('qr_buyarr', '')
										this.$router.push({
											name: 'qr_success',
											query: {
												orderUmber: o.orderUmber
											}
										})
									}
								});
						}
						
					})
				})
			},
			updateOrderTwo(orderStatusId, id, o, two) {
				return new Promise((resolve, reject) => {
					var params = {
						orderStatusId: orderStatusId,
						shippingStatusId: id,
						id: o.id,
						orderUmber: o.orderUmber,
						token:this.youkeToken
					}
					if(two) {
						params = {
							orderStatusId: orderStatusId,
							paymentStatusId: id,
							id: o.id,
							orderUmber: o.orderUmber,
							author: 1,
							token:this.youkeToken
						}
					}
					this.$root.ajax({
						closeAllLoading:true,
						closeDia: true,
						errormsg: true,
						name: 'order/update',
						params: params,
					}).then((d) => {
						resolve(d)
					})
				})
			},
			regUser() {
				this.$dialog.loading.open('加载中，请稍后...');
				var params={
						telephone: this.phoneVal,
						name: this.form.buyerName,
						key: 'buyer',
						password: '123456',
						channelCode: '',
						invitationCode: '',
						extend:'0',
						extendedAttribute:'',
					}
				if(this.youkeRadio==2){
					params.extendedAttribute='youke'
					params.telephone='';
					params.name='';
				}
				this.$root.ajax({
					name: 'customer/customerQuickRegist',
					closeAllLoading:true,
					errormsg:true,
					closeDia:true,
					params: params,
				}).then((d) => {
					if(d.success) {
						this.login()
					}else{
						if(d.state==200){
							this.youkeToken=d.msg;
							this.createOrder(true)
						}else{
							this.$dialog.loading.close();
							this.$dialog.confirm({
			                    title: '提示：',
			                    mes: d.state==99?d.msg:'手机号已存在，去登录页面登录？',
			                    opts: () => {
			                        this.$router.push({name:'qr_login'})
			                    }
			                });
						}
							
					}
					//成功后激活该账号
				})
			},
			//登录
			login() {
				this.$root.ajax({
					closeAllLoading:true,
					url: ROOTURL,
					name: 'login/login',
					params: {
						loginName: this.phoneVal,
						password: '123456',
						systemId: this.$root.config.systemId,
						flag: 1,
						authCode: '',
					}
				}).then((d) => {
					if(d.loginUser && d.loginUser != null) {
						//绑定openid到当前快速注册的

						d.loginUser.token = d.token
						//状态管理好像没有什么卵用
						this.$store.commit('storeUserInfo', d.loginUser)
						console.log(this.$store.state.userInfo)
						sessionStorage.setItem('qr_userinfo', JSON.stringify(d.loginUser))
						this.$root.userInfo = d.loginUser
						this.form.buyerName = this.$root.userInfo.nickName
						this.form.buyerId = this.$root.userInfo.typeCode
						this.updateMyDetail(d)
						this.createOrder(true)
					}
				})
			},
			//绑定微信
			updateMyDetail(d) {
				this.$root.ajax({
					url: ROOTURL,
					user: true,
					errormsg: true,
					closeDia: true,
					closeAllLoading:true,
					name: 'user/updateMyDetail',
					params: {
						wxopenid: sessionStorage.getItem('qr_openId'),
						userId: d.loginUser.userId,
						token: d.token,
					}
				}).then((d) = {

				})
			},
			lookUser() {
				this.$root.ajax({
					name: 'customer/QueryCustomerRolelist',
					params: {
						tel: this.phoneVal
					}
				}).then(d => {
					console.log(d)
				})
			},
			dkbz(item) {
				item.dkbz ? item.dkbz = false : item.dkbz = true
			},
		}
	}
</script>

<style lang='scss'>
	#qrOrder {
		height: 100%;
		background: #EFEFF3;
		.people_message {
			width: 100%;
			position: absolute;
			left: 0;
			top: 1.35rem;
			/*top: 1.25rem;*/
			.papy_type{
				color: #2F3927;
				-webkit-tap-highlight-color:transparent;
				display: flex;
				padding: .2rem 0;
				margin-right: .3rem;
				align-items: center;
			}
			.papy_type_thr{
				.yd-radio{
					padding-right: .06rem;
				}
			}
			.people_message_children {
				background: white;
				width: 95.73%;
				margin: auto;
				padding: 0 .22rem;
				border-radius: .04rem;
				box-shadow: 5px 10px 18px rgba(6, 58, 95, 0.1);
				.select_radio{
					border-bottom: 1px solid rgba(221, 221, 221, 0.8);
					color: #2F3927;
					background: white;
					display: flex;
					padding: .2rem 0;
					align-items: center;
					.select_radio_title{
						font-size: .32rem;
						margin-right: .2rem;
					}
				}
				.people_message_list {
					display: flex;
					border-bottom: 1px solid rgba(221, 221, 221, .8);
					align-items: center;
					img {
						width: .26rem;
						height: .3rem;
						margin-right: .24rem;
						flex-grow: 0;
					}
					input {
						flex-grow: 1;
						width: 5rem;
						font-size: .28rem;
						/*color: #989E92;*/
						height: .88rem;
						outline: none;
						border: none;
					}
				}
				.people_message_list:last-child {
					border-bottom: none;
				}
			}
			.people_message_children_people {
				font-size: .28rem;
				/*font-weight: 500;*/
				color: #0C0007;
				padding: .1rem .2rem;
				.people_message_name,
				.people_message_tel {
					padding: .15rem 0;
				}
			}
		}
		.content {
			background: #EFEFF3;
			border-radius: .04rem;
			/*padding: 1.6rem .16rem .2rem .16rem;*/
			padding: 2.62rem .16rem .2rem .16rem;
			.money_code{
				margin-top: .2rem;
				padding: .3rem 0;
				background: white;
				img{
					/*padding: .2rem;*/
					border: .15rem solid rgba(214,214,214,.8);
					width: 4rem;
					max-height: 8rem;
					margin: auto;
				}
				p{
					text-align: center;
					font-size: .28rem;
					margin-top: .2rem;
				}
			}
			.content_list {
				background: white;
				padding: .2rem;
				.list_title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.list_title_double {
						height: 3px;
						border-top: 1px solid #D6D6D6;
						border-bottom: 1px solid #D6D6D6;
						flex-grow: 1;
					}
					.list_title_name {
						max-width: 90%;
						color: #2F3927;
						font-size: 0.28rem;
						font-weight: bold;
						padding: 0 .2rem;
						text-align: center;
					}
				}
				.list_goods {
					margin-top: .33rem;
					color: #2F3927;
					.goods_header {
						margin-bottom: .06rem;
						display: flex;
						.goods_header_img {
							width: .6rem;
							height: .6rem;
							margin-right: .17rem;
						}
						.goods_header_right {
							flex-grow: 1;
							.goods_header_top {
								display: flex;
								line-height: .3rem;
								justify-content: space-between;
								.goods_header_name {
									width: 4rem;
									margin-right: .1rem;
									flex-grow: 1;
									font-weight: 500;
								}
								.goods_header_sqbz {
									width: .6rem;
									text-align: right;
									font-weight: bold;
								}
							}
							.goods_header_bottom {
								display: flex;
								.goods_header_dj {
									color: #989E92;
									flex-grow: 1;
								}
								.goods_header_num {
									width: 1.5rem;
									font-weight: bold;
									text-align: right;
								}
								.goods_header_money {
									width: 2rem;
									text-align: right;
									font-weight: 500;
								}
							}
						}
					}
					.goods_bz {
						input {
							outline: none;
							border: none;
							background: #FAF8E5;
							height: .56rem;
							width: 100%;
							padding: 0 .15rem;
							border-radius: .04rem;
						}
						input::-webkit-input-placeholder {
							/* WebKit browsers */
							color: #989E92;
						}
						input:-moz-placeholder {
							/* Mozilla Firefox 4 to 18 */
							color: #989E92;
						}
						input::-moz-placeholder {
							/* Mozilla Firefox 19+ */
							color: #989E92;
						}
						input:-ms-input-placeholder {
							/* Internet Explorer 10+ */
							color: #989E92;
						}
					}
				}
				.allgoods {
					width: 100%;
					color: #797D77;
					text-align: center;
					background: #EFEFF3;
					margin: .1rem 0 .22rem 0;
				}
				.leave_message {
					border: 1px solid #DDDDDD;
					textarea {
						font-family: PingFang-SC-Bold !important;
						padding: 8px .2rem;
						width: 100%;
						font-size: .28rem;
						/*border: none;
						outline: none;*/
						&::-webkit-input-placeholder {
							/* WebKit browsers */
							color: #989E92;
							font-size: .28rem;
							font-weight: bold;
						}
						&:-moz-placeholder {
							/* Mozilla Firefox 4 to 18 */
							color: #989E92;
							font-size: .28rem;
							font-weight: bold;
						}
						&::-moz-placeholder {
							/* Mozilla Firefox 19+ */
							color: #989E92;
							font-size: .28rem;
							font-weight: bold;
						}
						&:-ms-input-placeholder {
							/* Internet Explorer 10+ */
							color: #989E92;
							font-size: .28rem;
							font-weight: bold;
						}
					}
				}
				.leave_message_input {
					border: none;
					outline: none;
					border-bottom: 1px solid #DDDDDD;
					height: .8rem;
					font-size: .28rem;
					width: 100%;
					&::-webkit-input-placeholder {
						/* WebKit browsers */
						color: #989E92;
						font-size: .28rem;
						/*line-height: .28rem;*/
						font-weight: bold;
					}
					&:-moz-placeholder {
						/* Mozilla Firefox 4 to 18 */
						color: #989E92;
						font-size: .28rem;
						/*line-height: .28rem;*/
						font-weight: bold;
					}
					&::-moz-placeholder {
						/* Mozilla Firefox 19+ */
						color: #989E92;
						font-size: .28rem;
						/*line-height: .28rem;*/
						font-weight: bold;
					}
					&:-ms-input-placeholder {
						/* Internet Explorer 10+ */
						color: #989E92;
						font-size: .28rem;
						/*line-height: .28rem;*/
						font-weight: bold;
					}
				}
				.all_money {
					margin: .25rem 0 .05rem 0;
					text-align: right;
					color: #2F3927;
					font-weight: bold;
					span {
						font-size: .36rem;
					}
				}
			}
		}
		.gaodu_class{
			padding: .9rem .16rem .2rem .16rem !important;
		}
		.qr_footer {
			box-shadow: 0px -1px 2px 0px rgba(59, 110, 17, .15);
			display: flex;
			align-items: center;
			padding-left: .41rem;
			justify-content: space-between;
			background: white;
			.order_money {
				color: #989E92;
				span {
					color: #FF3D15;
					font-size: .36rem;
					font-weight: bold;
				}
			}
			.submit_order {
				width: 2.2rem;
				height: .98rem;
				background: #FE971D;
				color: white;
				font-size: .3rem;
				font-weight: bold;
				text-align: center;
				line-height: .98rem;
			}
		}
	}
</style>