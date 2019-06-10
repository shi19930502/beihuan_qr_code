<template>
	<yd-layout id='qrIndexTt'>
		<comHeader :backgroundStyle='backgroundStyle' :name='name'>

			<div v-if='!isKzs' class="message" ref='messageRef'>
				<div class="message_children">
					<img src="../../assets/img/icon_cheliang.png" alt="" />
					<div>当前车辆：{{dataList.length>0?dataList[0].f_transporter_id:'暂无进场车辆'}}</div>
				</div>
			</div>

		</comHeader>

		<div :style='contentStyle' class="content">
			<div class="content_header">{{!isKzs?'本车在售':'本店在售'}}</div>
			<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
				<div slot="list" class="content_list" v-for='(item,index) in dataList'>
					<img class="list_img" v-if='item.f_sku_pic_url&&item.f_sku_pic_url!=null' :src="$root.config.img_url+item.f_sku_pic_url" alt="" />
					<img class="list_img" v-else src="../../assets/img/img_moren@2x.png" alt="" />
					<div class="list_children">
						<div ref='texts' class="list_product_name"><span v-if='isKzs' class="list_kzs">可追溯</span><span>{{item.productName}}【{{item.name}}】</span></div>
						<div class="list_introduce text_ellipsis">{{item.remark?remark:'暂无描述'}}</div>
						<div class="list_sku">
							<span class="money_cx_name" v-if='item.price!=item.promotionPrice'>促销</span>
							<span>{{item.skuMethodType==2?'计件':'计重'}}&nbsp;&nbsp;[规格] {{item.skuWeight}}{{item.proMeasureName}}/{{item.skuMeasureName}}</span>
						</div>
						<div class="list_money_input">
							<div class="list_money">
								<div>￥<strong>{{item.promotionPrice}}<span v-if='false' class="list_unit">/{{item.skuMeasureName}}</span></strong></div>
								&nbsp;
								<div v-if='item.price!=item.promotionPrice' class="money_cx_num">￥{{item.price}}<span v-if='false' class="list_unit">/{{item.skuMeasureName}}</span></div>
							</div>
							<div class="list_add_jian">
								<img v-show='item.quantity!=null' @click='countQuantity(item,"jian")' class="list_add_jian_img" src="../../assets/img/img_jian@2x.png" alt="" />
								<input v-show='item.quantity!=null' @input='changeInput(item)' @blur='blurInput(item)' v-model='item.quantity' class="list_add_jian_input" type="text" />
								<img class="list_add_jian_img" src="../../assets/img/icon_add.png" @click='countQuantity(item,"add")' alt="" />
							</div>
						</div>
					</div>
				</div>
				<!-- 数据全部加载完毕显示 -->
				<span slot="doneTip">数据到底了~~</span>
				<!-- 加载中提示，不指定，将显示默认加载中图标 -->
				<img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg" />
			</yd-infinitescroll>
		</div>
		<div class="index_footer" slot='bottom'>
			<div class="index_footer_f">
				<div class="index_footer_img_f" :style="carBg">
					<img class="index_footer_img" src="../../assets/img/icon_caigou.png" alt="" />
					<div class="index_footer_goods_num" v-if='moneyObj.money>0'>{{goodsNum}}</div>
				</div>
				<div v-if='moneyObj.money>0' class="index_footer_money">￥{{moneyObj.money}}</div>
				<div v-else class="index_footer_num">暂未选择任何商品</div>
			</div>
			<div v-if='moneyObj.money>0' class="index_footer_submit" style="background: RGBA(254, 151, 29, 1);" @click='submitOrder'>立即结算</div>
			<div v-else class="index_footer_submit" @click='submitOrder'>立即结算</div>
		</div>
		<yd-popup v-model="popupShow" position="bottom">
			<div class="popup_header">
				<img @click='closePopup' class="popup_img" src="../../assets/img/icon_close.png" alt="" />
			</div>
			<div class="popup_content">
				<template v-if='$root.userInfo'>
					<div v-if='$root.userInfo.token' @click='goLogin' class="have_account">切换账号</div>
					<div v-else @click='goLogin' class="have_account">已有账号购买</div>
				</template>
				<div v-else @click='goLogin' class="have_account">已有账号购买</div>
				<div @click='closePopup' class="skip_buy">跳过直接购买</div>
			</div>
		</yd-popup>
	</yd-layout>
</template>

<script>
	import comHeader from '../../components/comHeader.vue'
	import { Popup } from 'vue-ydui/dist/lib.rem/popup';
	import { InfiniteScroll } from 'vue-ydui/dist/lib.rem/infinitescroll';
	export default {
		components: { comHeader, [Popup.name]: Popup, [InfiniteScroll.name]: InfiniteScroll },
		data() {
			return {
				name: '',
				contentStyle: {
					marginTop: '.5rem'
				},
				carBg: {
					background: '#6FB138',
					background: '#C2C2C2'
				},
				popupShow: false,
				pageNum: 1,
				pageSize: 8,
				dataList: [],
				isKzs: false,
				sources: '', //登录的浏览器
				moneyObj: {
					money: ''
				},
				goodsNum: 0,
				backgroundStyle: {},
			}
		},
		created() {
			sessionStorage.setItem('qr_buyarr', '[]')
		},
		watch: {
			dataList: {
				handler(arr) {　
					var money = 0,
						sessionArr = [];
					for(let a = 0; a < arr.length; a++) {
						if(arr[a].quantity && arr[a].quantity != null) {
							money = money + arr[a].quantity * arr[a].promotionPrice
							sessionArr.push(arr[a])
						}
					}
					sessionStorage.setItem('qr_selectarr', JSON.stringify(sessionArr))
					if(money > 0) {
						this.moneyObj.money = money.toFixed(2)
						this.goodsNum = sessionArr.length
						this.carBg = {
							background: '#6FB138'
						}
					} else {
						this.moneyObj.money = ''
						this.carBg = {
							background: '#C2C2C2'
						}
					}
					if(arr.length > 0) {
						this.name = arr[0].sellerName
					}
				},
				deep: true
			}
		},
		computed: {

		},
		mounted() {
			if(!sessionStorage.getItem('qr_noFirstCome')) {
				this.popupShow = true
			}
			sessionStorage.setItem('qr_noFirstCome', true)
			this.init()
			//yc.yshfresh.com/mp/quick_order/index.html?code=061duY5x0agGvi1kLE8x0Kb66x0duY5r&state=360Y6401210070001#/qrcodelogin
			console.log(window.location)
		},
		methods: {
			changeInput(item) {
				if(item.quantity.length > 9) {
					item.quantity = item.quantity.slice(0, 9)
				}
				var reg_1 = /^([0-9]{1,}[.][0-9]*)$/,
					reg_2 = /^[0-9]{1,}$/;
				if(reg_1.test(item.quantity) || reg_2.test(item.quantity)) {
					if(item.quantity > 9999.99) {
						item.quantity = 9999.99
					}
					if(item.skuMethodType == 1) {
						item.quantity = item.quantity
					} else {
						item.quantity = parseInt(item.quantity)
					}
				} else {
					if(item.quantity) {
						item.quantity = item.quantity.slice(0, item.quantity.length - 1)
						if(item.quantity > 0) {

						} else {
							item.quantity = ''
						}
					}
				}
			},
			blurInput(item) {
				console.log(item.quantity)
				if(item.quantity) {
					if(item.skuMethodType == 1) {
						item.quantity = parseFloat(item.quantity).toFixed(2)
					}
				} else {
					item.quantity = null
				}
			},
			countQuantity(item, str) {
				if(item.quantity && item.quantity > 0) {
					item.quantity = parseFloat(item.quantity)
					if(item.quantity > 9999) {
						item.quantity = 9999
					}
					if(str == 'add') {
						item.quantity = item.quantity + 1
					} else {
						item.quantity = item.quantity - 1
					}
				} else {
					item.quantity = 1
				}
				if(item.quantity <= 0) {
					item.quantity = null
				} else {
					if(item.skuMethodType == 1) {
						item.quantity = parseFloat(item.quantity.toFixed(2))
						item.quantity = item.quantity.toFixed(2)
					} else {
						item.quantity = parseInt(item.quantity)
					}

				}
			},

			loadList() {
				this.getGoods(this.paramsArr);

			},
			init() {
				if(this.$root.config.isSearch) {
					//判断是否有参数
					var paramsArr = this.$root.config.paramsArr
					//paramsArr中第一个孩子扫码去哪里的地址，第二个判断是团体还是普通采购，第三个查询参数
					console.log(paramsArr)
					//二批也有多个进场，3或者4，门店自营一个3
					if(paramsArr.length == 3) {
						this.paramsArr = paramsArr
						this.getOpenId(this.$root.config).then((d) => {
							console.log(d)
							if(d){
								this.customerList(d).then((obj) => {
									if(this.$root.config.loginName=='second'){
										//门店
										if(obj.extend=='005'){
											d.loginUser.token = d.token
											d.loginUser.extend = obj.extend
											//状态管理好像没有什么卵用
											this.$store.commit('storeUserInfo', d.loginUser)
											console.log(this.$store.state.userInfo)
											sessionStorage.setItem('qr_userinfo', JSON.stringify(d.loginUser))
											this.$root.userInfo = d.loginUser;
											this.getGoods(this.paramsArr);
										}else{
											this.$dialog.confirm({
							                    title: '提示',
							                    mes: '请使用个人权限账号！',
							                    opts: [
							                        {
							                            txt: '确定',
							                            color: true,
							                            callback: () => {
							                                this.$router.push({
																name:'qr_login'
															})
							                            }
							                        }
							                    ]
							               });
										}
									}else{
										//市场自营
										if(obj.extend=='003'){
											d.loginUser.token = d.token
											d.loginUser.extend = obj.extend
											//状态管理好像没有什么卵用
											this.$store.commit('storeUserInfo', d.loginUser)
											console.log(this.$store.state.userInfo)
											sessionStorage.setItem('qr_userinfo', JSON.stringify(d.loginUser))
											this.$root.userInfo = d.loginUser;
											this.getGoods(this.paramsArr);
										}else{
											this.$dialog.confirm({
							                    title: '提示',
							                    mes: '请使用团体单位权限账号登录！',
							                    opts: [
							                        {
							                            txt: '确定',
							                            color: true,
							                            callback: () => {
							                                this.$router.push({
																name:'qr_login'
															})
							                            }
							                        }
							                    ]
							               });
										}
									}
								})
							}else{
								this.getGoods(this.paramsArr);
							}
						})
						sessionStorage.setItem('qr_sellerId', paramsArr[2])
					} else {
						this.$dialog.toast({
							mes: '地址参数不正确',
							timeout: 1500
						});
					}

				}
				//获取来源
				this.sources = this.$root.sources()
				this.$nextTick(() => {
					if(this.$refs.messageRef) {
						this.contentStyle = {
							marginTop: (this.$refs.messageRef.offsetHeight * 2 / 100 - .2) + 'rem'
						}
					}
				})

				console.log(this.$root.sources())

			},

			getGoods(arr) {
				var params={
						code: '', //goods分类
						purchaserId: 0, //买方id，团体必须登录且为规格，如果不登录看所有商品，团体调用productsku/getSkuByQuotation
						supplierId: arr[2], //供应商typeCode
						keyWord: '', //模糊查询
						pageNum: this.pageNum,
						pageSize: this.pageSize
					}
				var urlName = 'productsku/getSkuByQuotationForYP'
				if(arr[1] != 'first') {
					urlName = 'productsku/getSkuByQuotation'
					this.isKzs = true
					this.backgroundStyle = {
						height: '1.4rem'
					}
					if(arr[1] == 'second') {
						urlName = 'productsku/getSkuByQuotationForYPStore'
						params.validDay =1
					}
				}
				this.$root.ajax({
					name: urlName,
					closeDia: true,
					errormsg: true,
					params: params,
				}).then((d) => {
					console.log(d)
					if(d.success) {
						var arr = []
						for(let a = 0; a < d.aaData.length; a++) {
							d.aaData[a].dkbz = false
							d.aaData[a].comment = ''
							d.aaData[a].quantity = null
						}
						arr = [...this.dataList, ...d.aaData];
						//					if(sessionStorage.getItem('qr_selectarr')){
						//						if(JSON.parse(sessionStorage.getItem('qr_selectarr')).length>0){
						//							var qrBuyArr=JSON.parse(sessionStorage.getItem('qr_selectarr'))
						//							for(let m=0;m<qrBuyArr.length;m++){
						//								for(let n= 0;n<arr.length;n++){
						//									if(qrBuyArr[m].f_id){
						//										if(qrBuyArr[m].f_id==arr[n].f_id){
						//											arr[n].quantity=qrBuyArr[m].quantity
						//										}
						//									}
						//								}
						//							}
						//						}
						//					}
						this.dataList = arr
						console.log(this.dataList)
						if(this.dataList.length >= d.dataCount) {
							console.log()
							/* 所有数据加载完毕 */
							this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
							return;
						}
						/* 单次请求数据完毕 */
						if(d.aaData.length > 0) {
							this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
						}
						this.pageNum++;
					} else {
						this.$dialog.confirm({
							title: '提示',
							mes: d.msg,
							opts: [{
								txt: '确定',
								color: true,
								callback: () => {
									this.$router.push({
										name: 'qr_login'
									})
								}
							}]
						});
					}

				})
			},
			getOpenId(o) {
				return new Promise((resolve, reject) => {
					this.$root.ajax({
						name: 'customer/wxAuthor',
						params: {
							code: o.code
						}
					}).then((d) => {

						if(d.success && d.aaData.openid) {
							sessionStorage.setItem('qr_openId', d.aaData.openid)
							this.$root.ajax({
								url: ROOTURL,
								closeDia: true,
								name: 'login/login',
								params: {
									openId: d.aaData.openid,
									systemId: this.$root.config.systemId,
									flag: 1,
									authCode: '',
								}
							}).then((logind) => {
								if(logind.loginUser && logind.loginUser != null) {
									if(logind.loginUser.isValid==0){
										
										this.$dialog.confirm({
							                    title: '提示：',
							                    mes: '你的账号权限过期，请先完善资料！',
							                    opts: [
							                        {
							                            txt: '确定',
							                            color: true,
							                            callback: () => {
							                                var o = {
																typeCode: logind.loginUser.typeCode,
																nickName: logind.loginUser.nickName,
																token: logind.token,
															}
															sessionStorage.setItem('qr_information', JSON.stringify(o))
															this.$router.push({
																name: 'qr_information'
															})
							                            }
							                        }
							                    ]
							               });
										
									}else{
										resolve(logind)
									}
								}
							})
						} else {
							resolve(false)
							if(!sessionStorage.getItem('qr_openId')) {
								//							this.$dialog.toast({
								//			                    mes: d.aaData.errmsg,
								//			                    mes: '请扫码进行查看',
								//			                    timeout: 1500
								//			                });
							}
						}
					})
				})

			},
			customerList(d) {
				return new Promise((resolve, reject) => {
					this.$root.ajax({
						name: 'customer/list',
						params: {
							id: d.loginUser.typeCode,
							token: d.token
						}
					}).then((data) => {
						resolve(data.aaData[0])
					})
				})
			},
			submitOrder() {
				if(this.moneyObj.money > 0) {
					if(sessionStorage.getItem('qr_selectarr') && sessionStorage.getItem('qr_selectarr') != '[]') {
						sessionStorage.setItem('qr_buyarr', sessionStorage.getItem('qr_selectarr'))
						this.$router.push({
							name: 'qr_order_tt',
						})
					} else {
						this.dataList = []
						this.init()
					}
				} else {
					this.$dialog.toast({
						mes: '请选择商品！',
						timeout: 1500
					});
				}

			},
			goLogin() {
				this.$router.push({
					name: 'qr_login'
				})
			},
			closePopup() {
				this.popupShow = false
			},
		}
	}
</script>

<style lang='scss'>
	#qrIndexTt {
		.content {
			padding: 0 .3rem;
			.content_header {
				font-size: .3rem;
				color: #2C2E2C;
				font-weight: bold;
			}
			.content_list {
				margin: .39rem 0;
				display: flex;
				.list_img {
					width: 1.98rem;
					height: 1.98rem;
					margin-right: .3rem;
					flex-grow: 0;
				}
				.list_children {
					width: 3rem;
					flex-grow: 1;
					.list_product_name {
						font-weight: bold;
						color: #2C2E2C;
						font-size: .3rem;
						.list_kzs {
							display: inline-block;
							border: 1px solid rgba(255, 61, 21, 1);
							border-radius: .04rem;
							box-sizing: initial;
							padding: .02rem .1rem .023rem .1rem;
							line-height: .24rem;
							height: .24rem;
							color: white;
							background: #FF3D15;
							font-weight: 500;
							font-size: .24rem;
							margin-right: .1rem;
						}
					}
					.list_introduce {
						color: #2C2E2C;
						font-weight: 400;
					}
					.list_sku {
						color: #797D77;
						.money_cx_name {
							display: inline-block;
							border: 1px solid rgba(255, 61, 21, 1);
							border-radius: .04rem;
							box-sizing: initial;
							padding: .02rem .1rem .023rem .1rem;
							line-height: .24rem;
							height: .24rem;
							color: #FF3D15;
						}
					}
					.list_money_input {
						display: flex;
						align-items: center;
						justify-content: space-between;
						.list_money {
							display: flex;
							align-items: flex-end;
							flex-wrap: wrap;
							color: #FF3D15;
							strong {
								font-size: .36rem;
								font-weight: bold;
							}
							.list_unit {
								font-size: .2rem;
								color: #797D77;
								font-weight: 400;
							}
							.money_cx_name {
								display: inline-block;
								border: 1px solid rgba(255, 61, 21, 1);
								border-radius: .04rem;
								padding: 0 .1rem;
								line-height: .26rem;
							}
							.money_cx_num {
								text-decoration: line-through;
								color: #797D77;
							}
						}
						.list_add_jian {
							display: flex;
							align-items: center;
							.list_add_jian_img {
								width: .52rem;
								height: .52rem;
							}
							.list_add_jian_input {
								width: .87rem;
								height: .44rem;
								background: #F2F2F2;
								border: none;
								outline: none;
								margin: 0 .05rem;
								text-align: center;
							}
						}
					}
				}
			}
		}
		.index_footer {
			display: flex;
			padding-left: .3rem;
			justify-content: space-between;
			box-shadow: 0px -1px 2px 0px rgba(59, 110, 17, .15);
			color: #989E92;
			font-size: .26rem;
			.index_footer_f {
				display: flex;
				align-items: center;
				.index_footer_money {
					font-size: .42rem;
					color: RGBA(255, 61, 21, 1);
					line-height: .42rem;
					font-weight: bold;
				}
			}
			.index_footer_img_f {
				position: relative;
				z-index: 999;
				width: .98rem;
				height: .98rem;
				border-radius: 50%;
				background: #C2C2C2;
				margin: -.3rem .25rem 0 0;
				border: .07rem solid white;
				box-shadow: 0px -2px 2px 0px rgba(59, 110, 17, .15);
				box-sizing: initial;
				display: flex;
				justify-content: center;
				align-items: center;
				.index_footer_img {
					width: .5rem;
					height: .5rem;
				}
				.index_footer_goods_num {
					position: absolute;
					top: -.05rem;
					right: .05rem;
					width: .3rem;
					height: .3rem;
					color: white;
					text-align: center;
					border-radius: 50%;
					line-height: .3rem;
					background: RGBA(255, 61, 21, 1);
				}
			}
			.index_footer_submit {
				background: #989E92;
				width: 2.2rem;
				text-align: center;
				line-height: .98rem;
				color: white;
				font-size: .3rem;
			}
		}
		.popup_header {
			width: 100%;
			background: transparent;
			display: flex;
			justify-content: flex-end;
			padding: 0 .39rem .39rem .39rem;
			.popup_img {
				width: .32rem;
				height: .32rem;
			}
		}
		.popup_content {
			width: 100%;
			height: 4.7rem;
			padding-top: 2.49rem;
			background: url(../../assets/img/img_tanchuang_bg.png) no-repeat;
			background-size: 100%;
			background-size: contain;
			font-size: .32rem;
			color: white;
			.have_account {
				width: 92%;
				height: .88rem;
				line-height: .88rem;
				background: RGBA(90, 69, 28, 1);
				text-align: center;
				border-radius: .08rem;
				margin: 0 auto .2rem auto;
			}
			.skip_buy {
				border-radius: .08rem;
				margin: auto;
				color: RGBA(90, 69, 28, 1);
				width: 92%;
				height: .88rem;
				line-height: .88rem;
				background: white;
				text-align: center;
			}
		}
		.yd-popup-bottom {
			background: transparent !important;
		}
	}
</style>