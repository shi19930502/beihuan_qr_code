<template>
	<yd-layout id='qrIndex'>
		<comHeader :name='name'>

			<div class="message" ref='messageRef'>
				<div class="message_children">
					<div class="message_children_c_l">
						<img v-if='$root.config.loginName=="first"' src="../../assets/img/icon_cheliang.png" alt="" />
						<img v-else src="../../assets/img/home_icon_dianpu.png" alt="" />
						<div v-if='$root.config.loginName=="first"'>当前车辆：{{dataList.length>0?dataList[0].f_transporter_id:'暂无进场车辆'}}</div>
						<div v-else-if='$root.config.loginName=="second"'>当前店铺：{{dataList.length>0?dataList[0].sellerName:'空'}}</div>
					</div>
					<div @click='lockCustomer' class="message_children_c_r">
						货主信息
					</div>
				</div>
				
			</div>

		</comHeader>
		<div :style='contentStyle' class="content">
			<div class="content_header">{{$root.config.loginName=="second"?"本店在售":"本车在售"}}</div>
			<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
				<div slot="list" class="content_list" v-for='(item,index) in dataList'>
					<div class="list_img_f" >
						<img @click='lookImg(item.quarantPicUrlFive)' class="list_img" v-if='item.f_sku_pic_url&&item.f_sku_pic_url!=null' :src="$root.config.img_url+item.f_sku_pic_url" alt="" />
						<img @click='lookImg(item.quarantPicUrlFive)'  class="list_img" v-else src="../../assets/img/img_moren@2x.png" alt="" />
						<img v-if='item.isMuslim' class="qingzhen" src="../../assets/img/qingzhen.png" alt="" />
					</div>
					<div class="list_children">
						<div ref='texts' class="list_product_name"><span v-if='isKzs' class="list_kzs">可追溯</span><span>{{item.productName}}【{{item.f_name}}】</span></div>
						<div class="list_introduce text_ellipsis">{{item.f_remark?item.f_remark:'暂无描述'}}</div>
						<div class="list_sku">
							<span class="money_cx_name" v-if='item.f_price!=item.promotionPrice'>促销</span>
							<span>{{item.skuMethodType==2?'计件':'计重'}}&nbsp;&nbsp;[规格] 
								<span v-if='item.skuMeasureName==item.proMeasureName'>{{item.proMeasureName}}</span>
								<span v-else>{{item.f_sku_weight}}{{item.proMeasureName}}/{{item.skuMeasureName}}</span>
							</span>
						</div>
						<div class="list_money_input">
							<div class="list_money">
								<div>￥<strong>{{item.promotionPrice}}<span v-if='false' class="list_unit">/{{item.skuMeasureName}}</span></strong></div>
								&nbsp;
								<div v-if='item.f_price!=item.promotionPrice' class="money_cx_num">￥{{item.f_price}}<span v-if='false' class="list_unit">/{{item.skuMeasureName}}</span></div>
							</div>
							<div class="list_add_jian">
								<img v-show='item.quantity!=null' @click='countQuantity(item,"jian")' class="list_add_jian_img" src="../../assets/img/img_jian@2x.png" alt="" />
								<input :disabled="carShow" v-show='item.quantity!=null' @input='changeInput(item)' @blur='blurInput(item)' v-model='item.quantity' class="list_add_jian_input" type="text" />
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
		<div v-show='!dialogVisible' class="index_footer" slot='bottom'>
			<div class="index_footer_f">
				<div @click='openCar' class="index_footer_img_f" :style="carBg">
					<img class="index_footer_img" src="../../assets/img/icon_caigou.png" alt="" />
					<div class="index_footer_goods_num" v-if='moneyObj.money>0'>{{goodsNum}}</div>
				</div>
				<div v-if='moneyObj.money>0' class="index_footer_money">￥{{moneyObj.money}}</div>
				<div v-else class="index_footer_num">暂未选择任何商品</div>
			</div>
			<div v-if='moneyObj.money>0' class="index_footer_submit" style="background: RGBA(254, 151, 29, 1);" @click='submitOrder'>立即结算</div>
			<div v-else class="index_footer_submit" @click='submitOrder'>立即结算</div>
		</div>
		<yd-popup :close-on-masker='false' v-model="popupShow" position="bottom">
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
		<yd-popup  class='car_show' v-model="carShow" position="bottom" height="70%">
			<div class="check_box_all" slot='top'>
				<yd-checkbox v-model="checkAll" shape="circle" :change="checkAllChange">全选 </yd-checkbox>
				<img @click='delCheck' src="../../assets/img/icon_trash@2x.png" alt="" />
			</div>
			<yd-checklist :callback="checkChange" :label="false" v-model="checkbox" class='box_list_f' ref="checklistDemo">
				<yd-checklist-item class='box_list' v-for='(item,index) in checkBoxarr' :key='item.f_id' :val="item.f_id">
					<div class="box_name">{{item.productName}}【{{item.f_name}}】</div>
					<div class="box_jj">
						<img v-show='item.quantity!=null' @click='countQuantity(item,"jian",index)' class="list_add_jian_img" src="../../assets/img/img_jian@2x.png" alt="" />
						<input :disabled="!carShow" v-show='item.quantity!=null' @input='changeInput(item,index)' @blur='blurInput(item,index)' v-model='item.quantity' class="list_add_jian_input" type="text" />
						<img class="list_add_jian_img" src="../../assets/img/icon_add.png" @click='countQuantity(item,"add")' alt="" />
					</div>
				</yd-checklist-item>
			</yd-checklist>

			<div  class="index_footer" slot='bottom'>
				<div class="index_footer_f">
					<div class="index_footer_img_f" :style="popCarBg">
						<img class="index_footer_img" src="../../assets/img/icon_caigou.png" alt="" />
						<div class="index_footer_goods_num" v-if='moneyObj.popMoney>0'>{{checkbox.length}}</div>
					</div>
					<div v-if='moneyObj.popMoney>0' class="index_footer_money">￥{{moneyObj.popMoney}}</div>
					<div v-else class="index_footer_num">暂未选择任何商品</div>
				</div>
				<div v-if='moneyObj.popMoney>0' class="index_footer_submit" style="background: RGBA(254, 151, 29, 1);" @click='popSubmitOrder'>立即结算</div>
				<div v-else class="index_footer_submit" @click='popSubmitOrder'>立即结算</div>
			</div>

		</yd-popup>
		<yd-popup class='customer_list_msg' v-model="customerView" position="bottom" height="100%">
            
            <div class="customer_list_msg_top" slot='top'>
 				<div class="customer_list_msg_top_img_top">货主信息</div>
            	<yd-icon @click.native='customerView=false' name="error" size=".5rem"></yd-icon>
            </div>
            <ul>
            	<li>
            		<span>货主：</span>
            		<span>{{customerListMsg.name}}</span>
            	</li>
            	<li>
            		<span>法人：</span>
            		<span>{{customerListMsg.legalpepresent}}</span>
            	</li>
            	<li>
            		<span>地址：</span>
            		<span>{{customerListMsg.address}}</span>
            	</li>
            	<!--<li>
            		<span>电话：</span>
            		<span>{{customerListMsg.tel}}</span>
            	</li>  -->
            	<li v-if='customerListMsg.regId'>
            		<span>营业执照号：</span>
            		<span>{{customerListMsg.regId}}</span>
            	</li>  
            	<li v-if='customerListMsg.businessLicensePic'>
            		<span>营业执照照片：</span>
            		<img :src="$root.config.img_url+customerListMsg.businessLicensePic" alt="" />
            	</li>
            	<li v-if='customerListMsg.storePic'>
            		<span>门头照片：</span>
            		<img :src="$root.config.img_url+customerListMsg.storePic" alt="" />
            	</li>
            	<li v-if='customerListMsg.foodLicensePic'>
            		<span>食品许可证：</span>
            		<img :src="$root.config.img_url+customerListMsg.foodLicensePic" alt="" />
            	</li>
            	<li v-if='customerListMsg.muslimfoodPermitPic'>
            		<span>清真食品准可证：</span>
            		<img :src="$root.config.img_url+customerListMsg.muslimfoodPermitPic" alt="" />
            	</li>
            </ul>
       </yd-popup>
		<yd-popup class='customer_list_msg' v-model="showImg" position="bottom" height="100%">
 			<div class="customer_list_msg_top customer_list_msg_top_img" slot='top'>
 				<div class="customer_list_msg_top_img_top">检疫图片</div>
            	<yd-icon @click.native='showImg=false' name="error" size=".5rem"></yd-icon>
            </div>       		
            <img class="customer_list_msg_img" :key='index' v-for='(item,index) in imgArr' :src="$root.config.img_url+item" alt="" />
        </yd-popup>
	</yd-layout>
</template>

<script>
	import comHeader from '../../components/comHeader.vue'
	import { Popup } from 'vue-ydui/dist/lib.rem/popup';
	import { CheckBox, CheckBoxGroup } from 'vue-ydui/dist/lib.rem/checkbox';
	import { CheckList, CheckListItem } from 'vue-ydui/dist/lib.rem/checklist';
	import { InfiniteScroll } from 'vue-ydui/dist/lib.rem/infinitescroll';
	import {Button, ButtonGroup} from 'vue-ydui/dist/lib.rem/button';
	import {Icons} from 'vue-ydui/dist/lib.rem/icons';
	export default {
		components: {
			comHeader,
			[Popup.name]: Popup,
			[InfiniteScroll.name]: InfiniteScroll,
			[CheckBox.name]: CheckBox,
			[CheckBoxGroup.name]: CheckBoxGroup,
			[CheckList.name]: CheckList,
			[CheckListItem.name]: CheckListItem,
			[Button.name]: Button,
			[ButtonGroup.name]: ButtonGroup,
			[Icons.name]: Icons,
		},
		data() {
			return {
				name: '未知',
				contentStyle: {
					marginTop: '.92rem'
				},
				carBg: {
					background: '#6FB138',
					background: '#C2C2C2'
				},
				popCarBg: {
					background: '#6FB138',
					background: '#C2C2C2'
				},
				popupShow: false,
				carShow: false,
				pageNum: 1,
				pageSize: 8,
				dataList: [],
				isKzs: false,
				sources: '', //登录的浏览器
				moneyObj: {
					money: '',
					popMoney: '',
				},
				goodsNum: 0,
				checkbox: [],
				checkBoxarr: [],
				checkAll: false,
				customerListMsg:{},
				customerView:false,
				dialogImageUrl: '',
				dialogVisible: false,
				imgArr:[],
				showImg:false,
			}
		},
		created() {
			sessionStorage.setItem('qr_buyarr', '[]')
			sessionStorage.setItem('qr_information', '')
		},
		watch: {
			checkAll(val) {

			},
			checkbox: {
				handler(arr) {
					var money = 0;
					for(let a = 0; a < arr.length; a++) {
						for(let b = 0; b < this.checkBoxarr.length; b++) {
							if(arr[a] == this.checkBoxarr[b].f_id) {
								money = money + this.checkBoxarr[b].quantity * this.checkBoxarr[b].promotionPrice
							}
						}
					}
					if(money > 0) {
						this.moneyObj.popMoney = money.toFixed(2)
						this.popCarBg = {
							background: '#6FB138'
						}
					} else {
						this.moneyObj.popMoney = ''
						this.popCarBg = {
							background: '#C2C2C2'
						}
					}
				},
				deep: true
			},
			checkBoxarr: {
				handler(arr) {
					var money = 0,
						sessionArr = [];
					for(let a = 0; a < arr.length; a++) {
						for(let b = 0; b < this.checkbox.length; b++) {
							if(this.checkbox[b] == arr[a].f_id) {
								if(arr[a].quantity && arr[a].quantity != null) {
									money = money + arr[a].quantity * arr[a].promotionPrice
								}
							}
						}
					}
					if(money > 0) {
						this.moneyObj.popMoney = money.toFixed(2)
						this.popCarBg = {
							background: '#6FB138'
						}
					} else {
						this.moneyObj.popMoney = ''
						this.popCarBg = {
							background: '#C2C2C2'
						}
					}
				},
				deep: true
			},
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
			this.$root.ajax({
				name: 'customer/getCustomerForWeiXin',
				params: {
					id:this.$root.config.paramsArr[2]
				}
			}).then(d => {
				this.customerListMsg=d.aaData
				
			})
			//yc.yshfresh.com/mp/quick_order/index.html?code=061duY5x0agGvi1kLE8x0Kb66x0duY5r&state=360Y6401210070001#/qrcodelogin
		},
		methods: {
			lookImg(imgArr) {
				if(imgArr){
					if(imgArr.length>0){
						this.showImg=true
						this.imgArr=imgArr
					}
				}else{
					this.$dialog.toast({
	                    mes: '该商品暂无检测信息!',
	                    timeout: 1500
	                });
				}
			},
			lockCustomer(){
				this.customerView=true
			},
			checkChange(value, checkAll) {
				this.checkAll = checkAll;
			},
			checkAllChange() {
				this.checkAll = !this.checkAll;
				this.$refs.checklistDemo.$emit('ydui.checklist.checkall', this.checkAll);
			},
			openCar() {
				this.checkBoxarr = JSON.parse(sessionStorage.getItem('qr_selectarr'))
				if(this.checkBoxarr.length > 0) {
					this.carShow = true;
					this.$nextTick(() => {
						this.checkAll = true;
						this.$refs.checklistDemo.$emit('ydui.checklist.checkall', this.checkAll);
					})
				} else {
					this.$dialog.toast({
						mes: '请选择商品！',
						timeout: 1500
					});
				}
			},
			changeInput(item, index) {
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
			blurInput(item, index) {
				if(item.quantity && item.quantity > 0) {
					if(item.skuMethodType == 1) {
						item.quantity = parseFloat(item.quantity).toFixed(2)
					}
				} else {
					item.quantity = null
					if(index >= 0) {
						this.checkBoxarr.splice(index, 1)
					}
				}
			},
			countQuantity(item, str, index) {
				if(item.quantity && item.quantity > 0) {
					item.quantity = parseFloat(item.quantity)
					if(str == 'add') {
						item.quantity = item.quantity + 1
					} else {
						item.quantity = item.quantity - 1
					}
					if(item.quantity > 9999.99) {
						this.$dialog.notify({
							mes: item.skuMethodType == 2 ? "计件最大值为9999" : "计重最大值为9999.99",
							timeout: 3000,
							callback: () => {

							}
						});
						item.quantity = item.skuMethodType == 2 ? 9999 : 9999.99
					}

				} else {
					item.quantity = 1
				}
				if(item.quantity <= 0) {
					item.quantity = null
					if(index >= 0) {
						this.checkBoxarr.splice(index, 1)
					}
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
					console.log(paramsArr)
					//paramsArr中第一个孩子扫码去哪里的地址，第二个判断是团体还是普通采购，第三个查询参数
					//长度为三表示默认查询第一个车，4表示查询有进场id的车
					if(paramsArr.length == 3 || paramsArr.length == 4) {
						this.paramsArr = paramsArr
						this.$dialog.loading.open('加载中，请稍后...');

						this.getOpenId(this.$root.config).then((d) => {
							if(d) {
								this.customerList(d).then((obj) => {
									this.$store.commit({
										type: 'getExtendStr',
										str: obj.extend,
									})
									if(obj.extend == '005') {
//										if(paramsArr[0] != 'mLogin' && this.$root.config.loginName != 'second') {
//											this.$dialog.confirm({
//												title: '提示',
//												mes: '个人账号只能在门店主体二维码处购买商品！',
//												opts: [{
//													txt: '去登录界面',
//													color: true,
//													callback: () => {
//														this.$router.push({
//															name: 'qr_login'
//														})
//													}
//												}, {
//													txt: '继续购买',
//													color: false,
//													callback: () => {
//														this.getGoods(this.paramsArr);
//													}
//												}]
//											});
//										}else{
											d.loginUser.token = d.token
											d.loginUser.extend = obj.extend
											//状态管理好像没有什么卵用
											this.$store.commit('storeUserInfo', d.loginUser)
											sessionStorage.setItem('qr_userinfo', JSON.stringify(d.loginUser))
											this.$root.userInfo = d.loginUser;
											this.getGoods(this.paramsArr);
//										}
									} 
//									else if(obj.extend == '003') {
//										this.$dialog.confirm({
//											title: '提示',
//											mes: '团体账号不能通过主体二维码购买商品！',
//											opts: [{
//												txt: '去登录界面',
//												color: true,
//												callback: () => {
//													this.$router.push({
//														name: 'qr_login'
//													})
//												}
//											}, {
//												txt: '继续购买',
//												color: false,
//												callback: () => {
//													this.getGoods(this.paramsArr);
//												}
//											}]
//										});
//									}
									else{
										d.loginUser.token = d.token
										d.loginUser.extend = obj.extend
										//状态管理好像没有什么卵用
										this.$store.commit('storeUserInfo', d.loginUser)
										sessionStorage.setItem('qr_userinfo', JSON.stringify(d.loginUser))
										this.$root.userInfo = d.loginUser;
										this.getGoods(this.paramsArr);
									}

									
								})
							} else {

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
					this.contentStyle = {
						marginTop: (this.$refs.messageRef.offsetHeight * 2 / 100 - .2) + 'rem'
					}
				})

			},

			getGoods(arr) {
				var urlName = 'productsku/getSkuByQuotationForYP';
				var params = {
					code: '', //goods分类
					purchaserId: 0, //买方id，团体必须登录且为规格，如果不登录看所有商品，团体调用productsku/getSkuByQuotation
					supplierId: arr[2], //供应商typeCode
					keyWord: '', //模糊查询
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				if(arr[1] != 'first') {
					urlName = 'productsku/getSkuByQuotation'
					this.isKzs = true
					this.backgroundStyle = {
						height: '1.4rem'
					}
					if(arr[1] == 'second') {
						urlName = 'productsku/getSkuByQuotationForYPStore'
						//						params.validDay = 1
					}
				}else{
					params.statusId=1
				}
				//arr.length == 4 && 
				if(arr[1] == 'first') {
					if(arr.length == 4) {
						params.inmarketId = arr[3]
					} else {
						params.inmarketId = ''
					}
				}
				this.$root.ajax({
					name: urlName,
					params: params,
				}).then((d) => {
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
						console.log(123)
						/* 所有数据加载完毕 */
						this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
						return;
					}
					/* 单次请求数据完毕 */
					if(d.aaData.length > 0) {
						this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
					}
					this.pageNum++;
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
								errormsg: true,
								closeloadingClose: true,
								name: 'login/login',
								params: {
									openId: d.aaData.openid,
									systemId: this.$root.config.systemId,
									flag: 1,
									authCode: '',
								}
							}).then((logind) => {
								if(logind.loginUser && logind.loginUser != null) {
									if(logind.loginUser.isValid == 0) {
										this.$dialog.loading.close();
										this.$dialog.confirm({
											title: '提示：',
											mes: '你的账号权限过期，请先完善资料！',
											opts: [{
												txt: '确定',
												color: true,
												callback: () => {
													var o = {
														typeCode: logind.loginUser.typeCode,
														nickName: logind.loginUser.nickName,
														token: logind.token,
														mobile:logind.loginUser.mobile
													}
													sessionStorage.setItem('qr_information', JSON.stringify(o))
													this.$router.push({
														name: 'qr_information'
													})
												}
											}]
										});
									} else {
										resolve(logind)
									}
								} else {
									if(logind.state == 101) {
										this.$dialog.confirm({
											title: '提示：',
			//								mes: `${d.msg}`,
											mes: `上传图片不合格,将无法提交订单!`,
											opts: [{
					                            txt: '切换账号',
					                            stay: true,
					                            color: '#00A3FF',
					                            callback: () => {
					                                this.$router.push({
														name: 'qr_login'
													})
					                            }
					                        },{
												txt: '去修改',
												color: true,
												callback: () => {
													this.$router.push({
														name: 'qr_update'
													})
													sessionStorage.setItem('customerEntity', JSON.stringify(d.customerEntity))
												}
											},]
										});
			
									} else{
										this.$dialog.confirm({
											title: '提示：',
			//								mes: `${d.msg}`,
											mes: `登录失败;</br>${d.msg}`,
											opts: [{
					                            txt: '切换账号',
					                            stay: true,
					                            color: '#00A3FF',
					                            callback: () => {
					                                this.$router.push({
														name: 'qr_login'
													})
					                            }
					                        },{
												txt: '继续购买',
												color: true,
												callback: () => {
													
												}
											},]
										});
									}
									resolve(false)
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
			delCheck() {
				for(let a = 0; a < this.checkbox.length; a++) {
					for(let b = 0; b < this.checkBoxarr.length; b++) {
						if(this.checkbox[a] == this.checkBoxarr[b].f_id) {
							this.checkBoxarr.splice(b, 1)
						}
					}
				}
			},
			popSubmitOrder() {
				if(this.moneyObj.popMoney > 0) {
					var arr = [];
					for(let a = 0; a < this.checkbox.length; a++) {
						for(let b = 0; b < this.checkBoxarr.length; b++) {
							if(this.checkbox[a] == this.checkBoxarr[b].f_id) {
								arr.push(this.checkBoxarr[b])
							}
						}
					}
					sessionStorage.setItem('qr_buyarr', JSON.stringify(arr))
					this.$router.push({
						name: 'qr_order',
					})

				} else {
					this.$dialog.toast({
						mes: '请选择商品！',
						timeout: 1500
					});
				}
			},
			submitOrder() {
				console.log(this.checkbox)
				if(this.moneyObj.money > 0) {
					if(sessionStorage.getItem('qr_selectarr') && sessionStorage.getItem('qr_selectarr') != '[]') {
						sessionStorage.setItem('qr_buyarr', sessionStorage.getItem('qr_selectarr'))
						this.$router.push({
							name: 'qr_order',
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
	#qrIndex {
		.message_children_c_l{
			display: flex;
			flex: 1;
		}
		.message_children_c_r{
			width: 1.4rem;
			text-align: center;
			color: #018BE6;
			flex-grow: 0;
		}
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
				.list_img_f{
					width: 1.98rem;
					height: 1.98rem;
					margin-right: .3rem;
					position: relative;
					flex-grow: 0;
					.list_img {
						width: 1.98rem;
						height: 1.98rem;
					}
					.qingzhen{
						position: absolute;
						top: 0;
						right: 0;
						width: .5rem;
						height: .5rem;
					}
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
					min-width: .3rem;
					height: .3rem;
					color: white;
					text-align: center;
					padding: 0 .05rem;
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
		.customer_list_msg{
			.yd-popup-bottom {
				background: white !important;
			}
			.customer_list_msg_top{
				display: flex;
				justify-content: space-between;
				padding: .25rem ;
				border-bottom: 1px solid #d9d9d9;
				.customer_list_msg_top_img_top{
					color: #555555;
					font-size: .3rem;
					font-weight: bold;
				}
			}
			ul{
				padding:0 0 .3rem .25rem;
				li{
					font-weight: bold;
					font-size: .28rem;
					border-bottom: 1px solid #D6D6D6;
					padding:.3rem .25rem .3rem 0;
					img{
						margin: .3rem auto 0;
						display: block;
						max-height: 10rem;
						width: 100%;
					}
				}
			}
			.customer_list_msg_img{
				max-width: 90%;
				max-height: 10rem;
				/*height: 5rem;*/
				margin:.2rem auto .2rem;
				border: 1px solid #D6D6D6;
			}
		}
		.car_show {
			.yd-popup-bottom {
				background: white !important;
			}
			.check_box_all {
				display: flex;
				align-items: center;
				border-bottom: 1px solid rgb(221, 221, 221);
				justify-content: space-between;
				padding: .25rem;
				img {
					width: .3rem;
					height: .3rem;
				}
			}
			.box_list_f {
				display: flex;
				flex-direction: column;
				.yd-checklist-content {
					width: 1rem;
					flex-grow: 1;
					display: flex;
					margin: 0 .15rem;
					justify-content: space-between;
					align-items: center;
				}
				.box_list {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0.05rem .25rem 0.05rem 0;
					.yd-checkbox-icon {
						width: 20px;
						flex-grow: 0;
					}
					.box_name {}
					.box_jj {
						display: flex;
						align-items: center;
						img {
							width: .52rem;
							height: .52rem;
						}
						input {
							width: 1rem;
							height: .44rem;
							background: #F2F2F2;
							border: none;
							outline: none;
							margin: 0 .05rem;
							text-align: center;
							margin: 0 .1rem;
							flex-grow: 1;
						}
					}
				}
			}
		}
		.el-dialog__body {
			img {
				position: relative;
				z-index: 9999;
			}
		}
		.el-dialog__wrapper {
			z-index: 9999 !important;
		}
		.el-dialog__wrapper {
			/*top: 1rem;*/
		}
	}
	.v-modal {
		/*z-index: 2 !important;*/
		display: none;
	}
</style>