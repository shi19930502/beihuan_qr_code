<template>
	<yd-layout id='qrZs'>
		<div class="header">
			<div class="content_borther">{{obj.f_product_name}}【{{obj.f_sku_name}}】</div>
			<div class="content">
				<div class="content_list">
					<div class="list_left"></div>
					<div class="list_right">
						<div class="list_title">产地环节</div>
						<div class="list_children">
							<div class="list_children_name">原产地</div>
							<span>{{obj.produceArea}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">基地/种植户</div>
							<span>{{obj.f_base_name}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">运输车辆</div>
							<span>{{obj.transportNum}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">检测结果</div>
							<span>{{obj.produceDetectionInfo}}</span>
						</div>
					</div>
				</div>
				<div class="content_list">
					<div class="list_left"></div>
					<div class="list_right">
						<div class="list_title">批发环节</div>
						<div class="list_children">
							<div class="list_children_name">市场名称</div>
							<span>{{obj.f_market_name}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">市场地址</div>
							<span>{{obj.marketAdd}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">企业名称</div>
							<span>{{obj.f_seller_name}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">检测结果</div>
							<span>{{obj.detectionInfo}}</span>
						</div>
					</div>
				</div>
				
				<div v-if='obj.quarantPicUrl' class="content_list" >
					<div class="list_left"></div>
					<div class="list_right">
						<div class="list_title">检疫环节</div>
						<div class="list_children">
							<div class="list_children_name">检疫图片</div>
							<span>
								<img @click="lookImg($root.config.img_url+obj.quarantPicUrl)" class="list_pic_img" :src="$root.config.img_url+obj.quarantPicUrl" alt="" />
							</span>
						</div>
					</div>
				</div>
				<div class="content_list">
					<div class="list_left"></div>
					<div class="list_right">
						<div class="list_title">采买环节</div>
						<div class="list_children">
							<div class="list_children_name">批次码</div>
							<span>{{obj.f_batch_id}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">产品名称</div>
							<span>{{obj.f_product_name}}【{{obj.f_sku_name}}】</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">进货时间</div>
							<span>{{obj.orderDate}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">采购方名称</div>
							<span>{{obj.f_buyer_name}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">所属区域</div>
							<span>{{$root.config.area}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">采购方地址</div>
							<span>{{obj.f_complete_address}}</span>
						</div>
						<div class="list_children">
							<div class="list_children_name">进货数量</div>
							<span>{{obj.saleWeight}}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<el-dialog :fullscreen='true' :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt>
		</el-dialog>
	</yd-layout>
</template>

<script>
	import { Upload, Dialog } from 'element-ui';
	export default {
		components: {
			[Dialog.name]: Dialog,
		},
		data() {
			return {
				name: '',
				obj:{},
				dialogImageUrl: '',
				dialogVisible: false,
			}
		},
		created() {

		},
		watch: {

		},
		computed: {

		},
		mounted() {
			if(this.$route.query.suyuanCode){
				this.init()
			}else{
				this.$dialog.confirm({
                    title: '提示',
                    mes: '请传入suyuanCode参数！',
                    opts: [
                        {
                            txt: '确定',
                            color: true,
                            callback: () => {
                                this.$router.back()
                            }
                        }
                    ]
                });
			}
		},
		methods: {
			lookImg(strUrl) {
				this.dialogVisible = true;
				this.dialogImageUrl =strUrl
			},
			init(){
				this.$root.ajax({
					name:'order/querySuYuanInfoByCode',
					params:{
						suyuanCode:this.$route.query.suyuanCode
					}
				}).then((d)=>{
					if(d.aaData&&d.aaData!=null){
//						this.obj=d.aaData
						this.obj=Object.assign({},this.obj,d.aaData)
						
					}else{
						this.$dialog.toast({
		                    mes: `${this.$route.query.suyuanCode} 查询为空`,
		                    timeout: 1500
		                });
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	#qrZs {
		.header {
			height: 3.6rem;
			padding: .45rem .51rem .33rem .51rem;
			background: url(../../assets/img/banner.png) no-repeat;
			background-size: 100% 100%;
		}
		.content_borther {
			margin-bottom: .33rem;
			font-weight: bold;
			font-size: .36rem;
			color: white;
		}
		.content {
			padding: .3rem .67rem .31rem .76rem;
			background: white;
			border-radius: .16rem;
			.content_list {
				margin-top: -.04rem;
				display: flex;
				.list_left {
					width: 1px;
					background: #599E4C;
					position: relative;
					padding: .1rem 0;
					margin: .04rem .48rem 0 0;
					/*margin-right: .48rem;*/
					&:before {
						content: '';
						display: inline-block;
						width: .32rem;
						height: .32rem;
						background: #599E4C;
						border-radius: 50%;
						position: absolute;
						top: 0rem;
						left: -.16rem;
					}
				}
				.list_right {
					color: #2C2E2C;
					font-size: .26rem;
					flex-grow: 1;
					margin-bottom: .6rem;
					font-weight: bold;
					.list_title {
						font-size: .32rem;
						padding: 0rem 0 .3rem 0;
						border-bottom: 1px solid #F0F0F0;
					}
					.list_children {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: .16rem 0 ;
						border-bottom: 1px solid #F0F0F0;
						.list_children_name{
							width: 1.6rem;
							flex-grow: 0;
							
						}
						span{
							width: 1rem;
							flex-grow: 1;
							text-align: right;
							font-weight: 500;
							.list_pic_img{
								width: 2rem;
								height: 2rem;
								display: block;
								margin: auto;
							}
						}
					}
						
						
				}
			}
			.content_list:last-child {
				.list_left{
					background: transparent;
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