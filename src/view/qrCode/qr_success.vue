<template>
	<yd-layout class='qrSuccess' id='qrSuccess'>
		<div class="header">
			<div class="header_name">
				<img style="display: inline-block;" src="../../assets/img/listd_icon_succes.png" alt="" />
				<span>下单成功</span>
			</div>
			<div class="header_code">订单编号:{{orderUmber.first}}<span>{{orderUmber.last}}</span></div>
			<!--<div v-if='$root.userInfo.isValid==0&&$root.userInfo.validDay>0' class="header_code_js">“完善资料”可查看订单详情，并用久保存订单记录</div>
			<div v-if='$root.userInfo.isValid==0&&$root.userInfo.validDay>0' @click='goInformation' class="header_btn">完善资料</div>-->
			<div v-if='$root.userInfo.extend==0' class="header_code_js">“完善资料”可查看订单详情，并用久保存订单记录</div>
			<div v-if='$root.userInfo.extend==0' @click='goInformation' class="header_btn">完善资料</div>
			<div class="header_footer">银川商务局提醒您，关注食品安全，选安全健康农产</div>
		</div>
		<div class="content">
			<div class="discern_code">长按识别二维码</div>
			<div class="qr_code">
				<img src="../../assets/img/img_erweima.png" alt="" />
			</div>
			<div class="attention_code">关注农鲜汇，足不出户，远程订购</div>
		</div>
		<div class="order_footer">
			<div class="order_footer_left">
				<div class="footer_left_top">
					塞上农鲜汇
					<span>价格透明</span>
				</div>
				<div class="footer_left_bottom">
					<span>在塞上享超低价获最优品</span>
					<span class="success_span">立即加入</span>
				</div>
			</div>
			<img src="../../assets/img/img_logo.png" alt="" />
		</div>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				orderUmber: {
					first: '',
					last: ''
				}
			}
		},
		created() {
			if(this.$route.query.orderUmber && this.$route.query.orderUmber.length >= 16) {
				this.orderUmber.first = this.$route.query.orderUmber.slice(0, 12)
				this.orderUmber.last = this.$route.query.orderUmber.slice(12)
			} else {
				this.$router.back()
			}
		},
		watch: {

		},
		computed: {

		},
		mounted() {

		},
		methods: {
			goInformation() {
				var o = {
					typeCode: this.$root.userInfo.typeCode,
					nickName: this.$root.userInfo.nickName,
					mobile: this.$root.userInfo.mobile,
					token: this.$root.userInfo.token,
				}
				sessionStorage.setItem('qr_information', JSON.stringify(o))
				this.$router.push({
					name: 'qr_information'
				})
			}
		}
	}
</script>

<style lang='scss'>
	#qrSuccess {
		height: 100%;
		background: #EFEFF3;
		.header {
			width: 100%;
			text-align: center;
			color: white;
			padding: 1rem .2rem .42rem .2rem;
			background: -webkit-linear-gradient(90deg, #8CD362, #B7DB68);
			/* Safari 5.1 - 6.0 */
			background: -o-linear-gradient(90deg, #8CD362, #B7DB68);
			/* Opera 11.1 - 12.0 */
			background: -moz-linear-gradient(90deg, #8CD362, #B7DB68);
			/* Firefox 3.6 - 15 */
			background: linear-gradient( 90deg, #8CD362, #B7DB68);
			.header_name {
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: bold;
				font-size: .42rem;
				line-height: .42rem;
				img {
					width: .42rem;
					height: .42rem;
					margin-right: .17rem;
				}
			}
			.header_code {
				margin-top: .42rem;
				span {
					color: #FF3D15;
					font-size: .32rem;
					font-weight: bold;
					padding-left: .05rem;
				}
			}
			.header_btn {
				border: 1px solid white;
				border-radius: .04rem;
				width: 2.4rem;
				height: .68rem;
				line-height: .68rem;
				font-weight: 500;
				font-size: .32rem;
				margin: .34rem auto .12rem;
			}
			.header_footer {
				font-size: .2rem;
			}
		}
		.content {
			background: white;
			padding: .4rem 0 .82rem 0;
			border-bottom: .2rem solid #EFEFF3;
			text-align: center;
			.discern_code {
				color: #797D77;
			}
			.qr_code {
				width: 2.8rem;
				height: 2.8rem;
				margin: .21rem auto .3rem auto;
				border: .27rem solid #EFEFF3;
				img {
					width: 2.26rem;
					height: 2.26rem;
				}
			}
			.attention_code {
				color: #2F3927;
			}
		}
		.order_footer {
			background: white;
			padding: .42rem .69rem .34rem.41rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.order_footer_left {
				.footer_left_top {
					font-weight: bold;
					margin-bottom: .25rem;
					line-height: .44rem;
					font-size: .44rem;
					color: #2C2E2C;
					span {
						padding-left: .14rem;
						color: #5A9F4B;
					}
				}
				.footer_left_bottom {
					display: flex;
					align-items: center;
					line-height: .24rem;
					color: #989E92;
					.success_span {
						color: white;
						font-size: .2rem;
						line-height: .22rem;
						padding: .04rem .1rem 0rem .1rem;
						background: #FF3D15;
						margin-left: .17rem;
						height: .28rem;
						border-radius: .04rem;
					}
				}
			}
			img {
				width: 1.24rem;
				height: 1.24rem;
			}
		}
		.yd-scrollview {
			&:after {
				display: none !important;
			}
		}
	}
</style>