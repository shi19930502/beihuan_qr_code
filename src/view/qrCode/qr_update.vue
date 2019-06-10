<template>
	<yd-layout  id='qrUpdate'>
		<div class="customer_name">昵称：{{customerEntity.name}}</div>
		<div class="list">
			<div class="img_title">{{customerEntity.property=="2"?'市场证明':'营业执照照片'}}</div>
			<template v-if='customerEntity.businessLicensePic'>
				<img class="hege_img" :src="$root.config.img_url+customerEntity.businessLicensePic" alt="" />
			</template>
			<updateUploadImg  v-else :imgUrl.sync='businessLicensePic'></updateUploadImg>
		</div>
		<div class="list">
			<div class="img_title">食品流通许可证</div>
			<template v-if='customerEntity.foodLicensePic'>
				<img class="hege_img" :src="$root.config.img_url+customerEntity.foodLicensePic" alt="" />
			</template>
			<updateUploadImg  v-else :imgUrl.sync='foodLicensePic'></updateUploadImg>
		</div>
		<div class="list">
			<div class="img_title">清真食品准营证</div>
			<template v-if='customerEntity.muslimfoodPermitPic'>
				<img class="hege_img" :src="$root.config.img_url+customerEntity.muslimfoodPermitPic" alt="" />
			</template>
			<updateUploadImg  v-else :imgUrl.sync='muslimfoodPermitPic'></updateUploadImg>
		</div>
		<div class="list">
			<div class="img_title">法人照片</div>
			<template v-if='customerEntity.legalpepresentPic'>
				<img class="hege_img" :src="$root.config.img_url+customerEntity.legalpepresentPic" alt="" />
			</template>
			<updateUploadImg  v-else :imgUrl.sync='legalpepresentPic'></updateUploadImg>
		</div>
		<div class="list">
			<div class="img_title">正面身份证</div>
			<template v-if='customerEntity.idCard'>
				<img class="hege_img" :src="$root.config.img_url+customerEntity.idCard.split(';')[0]" alt="" />
			</template>
			<updateUploadImg  v-else :imgUrl.sync='idCardZ'></updateUploadImg>
		</div>
		<div class="list">
			<div class="img_title">反面身份证</div>
			<template v-if='customerEntity.idCard'>
				<img class="hege_img" :src="$root.config.img_url+customerEntity.idCard.split(';')[1]" alt="" />
			</template>
			<updateUploadImg  v-else :imgUrl.sync='idCardF'></updateUploadImg>
		</div>
		<div class="list" v-if='customerEntity.extend=="004"'>
			<div class="img_title">门头照片</div>
			<template v-if='customerEntity.storePic'>
				<img class="hege_img" :src="$root.config.img_url+customerEntity.storePic" alt="" />
			</template>
			<updateUploadImg  v-else :imgUrl.sync='storePic'></updateUploadImg>
		</div>
		<div class="information_submit" @click='submit'>提交</div>
	</yd-layout>
</template>

<script>
	import updateUploadImg from '../../components/updateUploadImg.vue'
	export default{
		components: {
			[updateUploadImg.name]:updateUploadImg,
		},
		data(){
			return {
				customerEntity:{},
				businessLicensePic:'',//营业执照
				foodLicensePic:'',//食品许可证
				muslimfoodPermitPic:'',//清真食品准营证
				legalpepresentPic: '', //法人照片
				idCardZ:'',//证明身份证
				idCardF:'',//反面身份证
				idCard:'',//身份证
				storePic:'',//小区门店的门头照片
			}
		},
		created(){
			if(sessionStorage.getItem('customerEntity')&&sessionStorage.getItem('customerEntity')!='{}'){
				this.customerEntity=JSON.parse(sessionStorage.getItem('customerEntity'))
			}else{
				this.$router.go(-1)
			}
				console.log(this.customerEntity)

		},
		watch:{
			
		},
		computed:{
			
		},
		mounted(){
			
		},
		methods:{
			submit(){
				if(!this.customerEntity.businessLicensePic){
					if(!this.businessLicensePic){
						this.$dialog.toast({
		                    mes: this.customerEntity.property==2?'请上传市场证明':'请上传营业执照',
		                    timeout: 1500
		                });
		                return
					}
				}
				if(!this.customerEntity.foodLicensePic){
					if(!this.foodLicensePic){
						this.$dialog.toast({
		                    mes:'请上传食品许可证',
		                    timeout: 1500
		                });
		                return
					}
				}
//				if(!this.customerEntity.muslimfoodPermitPic){
//					if(!this.muslimfoodPermitPic){
//						this.$dialog.toast({
//		                    mes:'请上传清真食品准营证',
//		                    timeout: 1500
//		                });
//		                return
//					}
//				}
				if(!this.customerEntity.legalpepresentPic){
					if(!this.legalpepresentPic){
						this.$dialog.toast({
		                    mes:'请上传法人照片',
		                    timeout: 1500
		                });
		                return
					}
				}
				if(!this.customerEntity.idCard){
					if(!this.idCardZ){
						this.$dialog.toast({
		                    mes:'请上传正面身份证照片',
		                    timeout: 1500
		                });
		                return
					}
				}
				if(!this.customerEntity.idCard){
					if(!this.idCardF){
						this.$dialog.toast({
		                    mes:'请上传反面身份证照片',
		                    timeout: 1500
		                });
		                return
					}
				}
				if(this.customerEntity.extend=='004'){
					if(!this.customerEntity.storePic){
						if(!this.storePic){
							this.$dialog.toast({
			                    mes:'请上传门头照',
			                    timeout: 1500
			                });
			                return
						}
					}
				}
				this.save();
				
			},
			save(){
				var idCard='';
				if(this.customerEntity.idCard){
					idCard=this.customerEntity.idCard
				}else{
					idCard=this.idCardZ+';'+this.idCardF
				}
				var params={
					id:this.customerEntity.id,
					businessLicensePic:this.customerEntity.businessLicensePic||this.businessLicensePic,
					foodLicensePic:this.customerEntity.foodLicensePic||this.foodLicensePic,
					muslimfoodPermitPic:this.customerEntity.muslimfoodPermitPic||this.muslimfoodPermitPic,
					legalpepresentPic:this.customerEntity.legalpepresentPic||this.legalpepresentPic,
					idCard:this.customerEntity.idCard||idCard,
					storePic:this.customerEntity.storePic||this.storePic,
					disableType:0,
				}
				this.$root.ajax({
					name:'customer/updateCusMerPic',
					params:params,
					errormsg:true,
				}).then((d)=>{
					if(d.state==0){
						this.$dialog.toast({
		                    mes: '保存成功,请联系管理员对账号进行激活',
		                    timeout: 3000,
		                    icon: 'success',
		                    callback: () => {
		                    	sessionStorage.setItem('customerEntity','')
		                        this.$router.push({name:'qr_login'})
		                    }
		                });
					}else{
						this.$dialog.toast({
			                mes:d.msg,
			                timeout: 1500
			            });
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	#qrUpdate{
		padding: 0 0 0 .25rem;
		.customer_name{
			font-size: .3rem;
			color: #555555;
			font-weight: bold;
			padding: .3rem 0 .3rem .25rem ;
			border-bottom: 1px solid #D6D6D6;
		}
		.list{
			font-size: .3rem;
			color: #555555;
			font-weight: bold;
			padding: .3rem 0 .3rem .25rem ;
			border-bottom: 1px solid #D6D6D6;
			.img_title{
				padding-bottom: .15rem;
			}
		}
		.hege_img{
			width: 3rem;
			height: 3rem;
			border: 1px solid #D9D9D9;
			margin: auto;
		}
		.information_submit {
			width: 80%;
			margin: .4rem auto 0;
			border-radius: .4rem;
			text-align: center;
			background: #018BE6;
			color: white;
			line-height: .78rem;
			height: .78rem;
			font-size: .32rem;
		}
	}
</style>