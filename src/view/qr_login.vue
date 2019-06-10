<template>
	<yd-layout id='qrLogin'>
		<div class="login_bac">
			<img class="login_logo" src="../assets/img/s_logo_1.png" alt="" />
			<div class="login_form">
				<div class="login_input">
					<img src="../assets/img/login_icon_user@2x.png" alt="" class="pswicon">
					<yd-input style="padding-left: 10px" type="text" v-model="username" :show-success-icon="false" max="20" placeholder="请输入用户名"></yd-input>
				</div>
				<div class="login_input">
					<img src="../assets/img/login_icon_password@2x.png" alt="" class="pswicon">
					<yd-input @keydown.native='downEnter' style="padding-left: 10px" type="password" :show-success-icon="false" v-model="password" max="20" placeholder="请输入密码"></yd-input>
				</div>
				<div class="forget_password">忘记密码？</div>
				<div class="login_btn">
					<div @click="login" class="loginbtn flex flex-y-center flex-x-center">
						<span>登录</span>
					</div>
				</div>
			</div>
			<div class="l_footer">{{$root.config.footerName}}</div>
		</div>
	</yd-layout>
</template>

<script>
	import { Input } from 'vue-ydui/dist/lib.rem/input';
	export default {
		components: {
			[Input.name]: Input
		},
		data() {
			return {
				username: '',
				password: '',
				urlName: 'qr_index'
			}
		},
		created() {
			this.$store.commit('storeUserInfo', '');
			sessionStorage.setItem('qr_information', '')
			this.$root.userInfo = ''
			if(this.$root.config.isSearch) {
				var paramsArr = this.$root.config.paramsArr
				if(paramsArr[1] != 'first' & paramsArr[1] == 'third') {
					this.urlName = 'qr_index_tt'
				}
			}
		},
		watch: {

		},
		computed: {

		},
		mounted() {

		},
		methods: {
			login() {
				if(!this.username) {
					this.$dialog.toast({
						mes: '请输入用户名',
						timeout: 1500
					});
					return
				}
				if(!this.password) {
					this.$dialog.toast({
						mes: '请输入密码',
						timeout: 1500
					});
					return
				}
				this.$dialog.loading.open('登录中，请稍后...');
				this.$root.ajax({
					url: ROOTURL,
					name: 'login/login',
					closeDia: true,
					errormsg: true,
					closeloadingOpen: true,
					loadingClose: true,
					params: {
						loginName: this.username,
						password: this.password,
						systemId: this.$root.config.systemId,
						flag: 1,
						authCode: '',
					}
				}).then((d) => {
					if(d.loginUser && d.loginUser != null) {
						if(d.loginUser.isValid == 0) {
							this.$dialog.loading.close();
							this.$dialog.confirm({
								title: '提示：',
								mes: '你的账号权限过期，请先完善资料！',
								opts: () => {
									var o = {
										typeCode: d.loginUser.typeCode,
										nickName: d.loginUser.nickName,
										token: d.token,
										mobile: d.loginUser.mobile
									}
									sessionStorage.setItem('qr_information', JSON.stringify(o))
									this.$router.push({
										name: 'qr_information'
									})
								}
							});

						} else {
							//判断当前用户是什么登陆的
							this.customerList(d).then((obj) => {
								this.$dialog.loading.close();
								var flg = false
								var paramsArr = this.$root.config.paramsArr
								if(obj.extend == '005') {
									flg = true
//									paramsArr[0] == 'mLogin' && this.$root.config.loginName == 'second' ?
//										flg = true : this.$dialog.alert({
//											mes: '个人账号只能在门店主体二维码处购买商品！'
//										});
								}
								//								else if(obj.extend=='003'){
								//									this.$dialog.alert({ mes: '团体账号不能通过主体二维码购买商品！' });
								//								}
								else {
									flg = true
								}

								if(flg) {
									//绑定openid到当前快速注册的
									d.loginUser.token = d.token
									d.loginUser.extend = obj.extend
									//状态管理好像没有什么卵用
									this.$store.commit('storeUserInfo', d.loginUser)
									console.log(this.$store.state.userInfo)
									sessionStorage.setItem('qr_userinfo', JSON.stringify(d.loginUser))
									this.$root.userInfo = d.loginUser;

									if(this.$root.openId) {
										this.$dialog.confirm({
											title: '提示',
											mes: `是否将${this.username}与微信绑定,方便下次直接登录!`,
											opts: [{
													txt: '否',
													color: false,
													callback: () => {
														this.$router.push({
															name: this.urlName
														})
													}
												},
												{
													txt: '是',
													color: true,
													callback: () => {
														this.$root.ajax({
															url: ROOTURL,
															name: 'user/updateMyDetail',
															user: true,
															params: {
																wxopenid: this.$root.openId,
																userId: this.$root.userInfo.userId,
															}
														}).then(res => {
															this.$router.push({
																name: this.urlName
															})
														})
													}
												}
											]
										});
									} else {
										this.$router.push({
											name: this.urlName
										})
									}
								}

							})
						}
					} else { 
						this.$dialog.loading.close();
						if(d.state == 101) {
							this.$dialog.confirm({
								title: '提示：',
//								mes: `${d.msg}`,
								mes: `上传图片不合格`,
								opts: [{
									txt: '去修改',
									color: true,
									callback: () => {
										this.$router.push({
											name: 'qr_update'
										})
										sessionStorage.setItem('customerEntity', JSON.stringify(d.customerEntity))
									}
								}]
							});

						} else {
							this.$dialog.alert({
								mes: d.msg
							})
						}
					}
				})
			},
			customerList(d) {
				return new Promise((resolve, reject) => {
					this.$root.ajax({
						name: 'customer/list',
						errormsg: true,
						closeDia: true,
						closeloadingOpen: true,
						closeloadingClose: true,
						params: {
							id: d.loginUser.typeCode,
							token: d.token
						}
					}).then((data) => {
						if(data.success && data.state == 0) {
							resolve(data.aaData[0])
						} else {
							this.$dialog.loading.close();
							this.$dialog.toast({
								mes: data.msg,
								timeout: 1500
							});
						}

					})
				})
			},
			downEnter(event) {
				var e = event || window.event;
				if(e && e.keyCode == 13) { //回车键的键值为13
					this.login() //调用登录按钮的登录事件
				}
			},
		}
	}
</script>

<style lang='scss'>
	#qrLogin {
		.login_bac {
			width: 100%;
			height: 100%;
			flex: 1;
			padding-top: 1.62rem;
			background: url(../assets/img/bg_bg.png) no-repeat;
			background-size: 100% 100%;
			.login_logo {
				width: 2.61rem;
				height: 2.84rem;
				margin: 0 auto 1.2rem;
			}
			.login_form {
				margin: auto;
				width: 5.3rem;
				.login_input {
					padding: .18rem 0;
					margin-bottom: .15rem;
					border-bottom: 1px solid #C6C6C6;
					align-items: center;
					display: flex;
					img {
						width: .4rem;
						height: .46rem;
					}
					input {
						font-size: .28rem;
					}
				}
				.forget_password {
					text-align: right;
					color: #626262;
				}
				.login_btn {
					.loginbtn {
						width: 100%;
						border-radius: .39rem;
						background: #00A3FF;
						line-height: .78rem;
						height: .78rem;
						font-size: .32rem;
						color: white;
						text-align: center;
						margin: .3rem 0 1.2rem 0;
					}
				}
			}
		}
		.l_footer {
			text-align: center;
		}
		.yd-scrollview:after {
			height: 0;
		}
	}
</style>