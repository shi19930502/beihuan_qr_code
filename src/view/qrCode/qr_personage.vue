<template>
	<yd-layout id='qrPersonage'>
		<comHeader>
			<div class="personage_message_father">
				<div ref='personageMessage' class="personage_message">
					<!--<img src="../../assets/img/home_icon_dianpu.png" alt="" />-->
					<div class="message_shop">
						<div class="shop_name">采购方：{{customerInfo.name}}</div>
						<div class="shop_introduce">我们已对食材溯源检测，请放心使用</div>
					</div>
				</div>
			</div>
		</comHeader>
		<div class="content" :style="contentStyle">
			<div class="content_header">
				<div>进货日期</div>
				<div style="display: flex; align-items: center;">
					<yd-datetime :end-date='endDate' ref="datetime"   type="date" v-model="orderDate" slot="right"></yd-datetime>
					<img @click='getDate' src="../../assets/img/icon_rili.png" alt="" />
				</div>
			</div>
			<div class="content_list" >
				<div class="list_date"></div>
				<div ref='listFlex' class="list_flex list_goods_new">
					<!--<div v-if='dataList.length>0' class="list_goods" :style="listGoodsStyle" v-for='(item,index) in dataList'>
						<img @click='goZs(item.f_suyuan_code)' v-if='item.f_sku_pic_url&&item.f_sku_pic_url!=null' class="goods_img" :src="$root.config.img_url+item.f_sku_pic_url" alt="" />
						<img @click='goZs(item.f_suyuan_code)' v-else class="goods_img" src="../../assets/img/img_moren@2x.png" alt="" />
						<div @click='goZs(item.f_suyuan_code)' class="goods_name">
							<div class="goods_name_children">
								<p ref='goodsName'>{{item.f_product_name}}【{{item.f_sku_name}}】</p>
							</div>
							<template v-if='$refs.goodsName&&$refs.goodsName[index]'>
								<div  v-if='$refs.goodsName.length>0&&$refs.goodsName[index].offsetHeight>35' class="goods_dot">...</div>
							</template>
						</div>
					</div>-->
					<div v-if='dataList.length>0' @click='goZs(item.f_suyuan_code)' class="list_goods_new_c"  v-for='(item,index) in dataList'>
						<img  @click.stop='lookImg(item.quarantPicUrl)' v-if='item.f_sku_pic_url&&item.f_sku_pic_url!=null' class="goods_img" :src="$root.config.img_url+item.f_sku_pic_url" alt="" />
						<img  @click.stop='lookImg(item.quarantPicUrl)' v-else class="goods_img" src="../../assets/img/img_moren@2x.png" alt="" />
						<div  class="goods_name">
							<div class="goods_name_children">
								<p ref='goodsName'><span>名&nbsp;&nbsp;&nbsp;称：</span>{{item.f_product_name}}【{{item.f_sku_name}}】</p>
								<p><span>溯源码：</span>{{item.f_suyuan_code}}</p>
							</div>
							<!--<template v-if='$refs.goodsName&&$refs.goodsName[index]'>
								<div  v-if='$refs.goodsName.length>0&&$refs.goodsName[index].offsetHeight>35' class="goods_dot">...</div>
							</template>-->
						</div>
					</div>
					<div v-else class="no_goods">暂无商品</div>
				</div>
			</div>

		</div>
		<el-dialog :fullscreen='true' :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt>
		</el-dialog>
	</yd-layout>
</template>

<script>
	import comHeader from '../../components/comHeader.vue'
	import {DateTime} from 'vue-ydui/dist/lib.rem/datetime';
	import { Upload, Dialog } from 'element-ui';
	export default {
		components: { comHeader,
			[DateTime.name]:DateTime ,
			[Dialog.name]: Dialog,
		},
		data() {
			return {
				contentStyle: {},
				listGoodsStyle: { width: '25%' },
				cesheight:'',
				endDate:'',
				orderDate:'',
				orderEndDate:'',
				customerInfo:{},
				dataList:[],
				dateArr:[],
				newData:[],
				dialogImageUrl:'',
				dialogVisible:false,
			}
		},
		created() {
			
		},
		watch: {
			orderDate:function(val){
				if(this.$route.query.code){
					this.searchDate(val)
				}else{
					this.$dialog.toast({
	                    mes: 'code参数不能为空',
	                    timeout: 1500
	                });
				}
			},
		},
		computed: {

		},
		mounted() {
			var vm = this
//			this.$nextTick(()=>{
//				//这个写是为了那个goods_name,一个数据改变重新渲染页面，不知道异步是一个什么情况，先这样放着
//				this.cesheight='采购方'
//			})
			this.contentStyle = {
				marginTop: (this.$refs.personageMessage.offsetHeight * 2 / 100 - .42) + 'rem'
			}
			
			window.onresize = function() {
				if(vm.$refs.goodsName) {
					var numList = parseInt(vm.$refs.listFlex.offsetWidth / vm.$refs.goodsName[0].offsetWidth)
					numList = parseInt(vm.$refs.listFlex.offsetWidth / 86.25)
					vm.listGoodsStyle = {
						width: 100 / numList + '%'
					}
				}
			}
			this.init();
		},
		methods: {
			lookImg(strUrl) {
				if(strUrl){
					this.dialogVisible = true;
					this.dialogImageUrl =this.$root.config.img_url + strUrl
				}else{
					this.$dialog.toast({
	                    mes: '该商品暂无检测信息!',
	                    timeout: 1500
	                });
				}
			},
			goZs(suyuanCode){
				this.$router.push({
					name:'qr_zs',
					query:{
						suyuanCode:suyuanCode
					}
				})
			},
			searchDate(val){
				//console.log(this.$root.getDate(new Date(val)))
				this.$root.ajax({
					name:'customer/listByCode',
					type:'get',
					params:{
						code:this.$route.query.code,
						orderDate:val,
						orderEndDate:val,
					}
				}).then((d)=>{
					if(d.success){
						this.customerInfo=d.aaData.customerInfo
						this.dataList=d.aaData.orderItemList
						console.log(this.dataList)
						this.$nextTick(()=>{
							console.log(this.$refs.goodsName)
							var numList = parseInt(this.$refs.listFlex.offsetWidth / 86.25)
							this.listGoodsStyle = {
								width: 100 / numList + '%'
							}
						})
					}
					
					//this.disposeData();
				})
			},
			init(){
				this.orderDate=this.orderEndDate=this.$root.getNumDate(0)
				this.endDate=this.$root.getNumDate(0)
				this.dateArr=[this.orderEndDate,this.$root.getNumDate(1),this.orderDate]
			},
			getDate(){
				this.$refs.datetime.open();
			},
			//处理数据 [{arrData:[],date:''}] 新版本不要这个，看后期
			disposeData(){
				var arr=[];
				for(let a =0;a<this.dateArr.length;a++){
					var o={date:this.dateArr[a],arrData:[]};
					for(let b = 0;b<this.dataList.length;b++){
						if(this.dateArr[a]==this.dataList[b].sortingDate.split(' ')[0]){
							o.arrData.push(this.dataList[b])
						}
					}
					arr.push(o)
				}
				this.newData=arr;
				this.$nextTick(()=>{
					var numList = parseInt(this.$refs.listFlex[0].offsetWidth / 86.25)
					this.listGoodsStyle = {
						width: 100 / numList + '%'
					}
				})
			},
		}
	}
</script>

<style lang='scss'>
	#qrPersonage {
		.personage_message_father {
			width: 100%;
			position: absolute;
			left: 0;
			top: 1.35rem;
		}
		.personage_message {
			width: 92%;
			margin: auto;
			padding: .43rem .24rem .28rem .24rem;
			background: white;
			box-shadow: 5px 10px 18px rgba(6, 58, 95, 0.1);
			display: flex;
			border-radius: .04rem;
			img {
				margin: .06rem .16rem 0 0;
				width: .3rem;
				height: .28rem;
				flex-grow: 0;
			}
			.message_shop {
				flex-grow: 1;
				font-size: .24rem;
				font-weight: 500;
				.shop_name {
					font-weight: bold;
					font-size: .3rem;
					color: #2C2E2C;
					margin-bottom: .04rem;
				}
			}
		}
		.content {
			padding: 0 .3rem;
			color: #2C2E2C;
			.content_header {
				font-size: .30rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-weight: bold;
				img {
					width: .34rem;
					height: .34rem;
					margin-left: .2rem;
				}
			}
			.content_list {
				font-weight: 500;
				.list_date {
					margin: .11rem 0 .41rem 0;
				}
				.list_flex {
					padding: 0 .1rem;
					display: flex;
					flex-wrap: wrap;
					.list_goods {
						position: relative;
						margin-bottom: .11rem;
						width: 25%;
						.goods_img {
							margin: auto;
							width: 1.28rem;
							height: 1.28rem;
						}
						.goods_name {
							position: relative;
							line-height: .26rem;
							max-height: .52rem;
							margin: .2rem auto .18rem;
							width: 1.28rem;
							/*width: 100%;*/
							text-align: center;
							.goods_name_children{
								max-height: .52rem;
								overflow: hidden;
							}
							p{
								width: 1.28rem;
							}
						}
						.goods_dot {
							/*display: flex;*/
							/*align-items: center;
							justify-content: center;*/
							text-align: left;
							width: .2rem;
							/*border-radius: 50%;*/
							height: .24rem;
							line-height: .26rem;
							background: -webkit-linear-gradient(0deg, rgba(255,255,255,.8), #ffffff);
							/* Safari 5.1 - 6.0 */
							background: -o-linear-gradient(0deg, rgba(255,255,255,.8), #ffffff);
							/* Opera 11.1 - 12.0 */
							background: -moz-linear-gradient(0deg, rgba(255,255,255,.8), #ffffff);
							/* Firefox 3.6 - 15 */
							background: linear-gradient( 0deg, rgba(255,255,255,.8), #ffffff);
							background: white;
							position: absolute;
							right: -.2rem;
							bottom: .04rem;
							z-index: 999;
						}
					}
					.no_goods{
						width: 100%;
						font-size: .5rem;
						line-height: .5rem;
					    text-align: center;
					    padding: 2.5rem 0;
					    color: #a1a1a1;
					    align-items: center;
					}
				}
				.list_goods_new{
					display: block;
					.list_goods_new_c{
						border-bottom: 1px solid #D6D6D6;
						width: 100%;
						padding: 0 0 .2rem 0;
						margin-bottom: .2rem;
						align-items: center;
						display: flex;
						
						
						img{
							width: 1.28rem;
							height: 1.28rem;
							display: block;	
							flex-grow: 0;
							margin: 0 .2rem 0rem 0;
						}
						.goods_name{
							width: 2rem;
							flex: 1;
							.goods_name_children{
								/*p{
									span{
										display: inline-block;
										width: 1rem;
										text-align: right;
									}
								}*/
							}
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