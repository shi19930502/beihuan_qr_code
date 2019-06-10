<template>
	<yd-layout id='qrInformation'>
		<div class="information_list ">
			<div class="list_left">个人/公司名称</div>
			<div class="list_right">{{form.name}}</div>
		</div>
		<div class="information_list ">
			<div class="list_left">电话</div>
			<div class="list_right">{{form.tel}}</div>
		</div>
		<div class="information_list ">
			<div class="list_left">身份</div>
			<div class="list_right list_select">
				<select name="" id="" v-model="form.customerProperty" @change='selectChange'>
					<option disabled selected value="">请选择身份(必选)</option>
					<option value="001">批发商</option>
					<option value="007">厂商</option>
					<option value="002">二级批发/早市/农贸市场</option>
					<option value="004">小区门店</option>
					<option value="008">配送公司</option>
					<!--<option value="003">餐饮店/团体单位</option>-->
					<option value="005">个人</option>
				</select>
				<img class="list_right_img" src="../../assets/img/listd_icon_right@2x.png" alt="" />
			</div>
		</div>
		<div  v-if="form.customerProperty&&(form.customerProperty=='001'||form.customerProperty=='002')" class="information_list ">
			<div class="list_left">渠道</div>
			<div class="list_right list_select">
				<select name="" id="" v-model="form.channelCode" >
					<option disabled selected value="xzqd">请选择渠道(必选)</option>
					<option v-for='item in channelArr'  :key='item.code' :value="item.code">{{item.name}}</option>
					<option  value="">市场备注</option>
				</select>
				<img class="list_right_img" src="../../assets/img/listd_icon_right@2x.png" alt="" />
			</div>
		</div>
		<div v-if="!form.channelCode&&(form.customerProperty=='001'||form.customerProperty=='002')" class="information_list">
			<div class="list_left">渠道备注</div>
			<input maxlength="50" v-model='form.remark' type="text" class="list_right list_input" placeholder="请输入渠道备注(必填)" />
		</div>
		<div  v-if="(!(!form.channelCode||form.channelCode=='001201'))&&form.customerProperty&&(form.customerProperty=='001'||form.customerProperty=='002')"  class="information_list ">
			<div class="list_left">经营户类型</div>
			<div class="list_right list_select">
				<select name="" id="" v-model="form.property" >
					<option disabled selected value="">请选择经营户类型(必选)</option>
					<option v-for='item in datadicArr'  :key='item.key' :value="item.key">{{item.value}}</option>
				</select>
				<img class="list_right_img" src="../../assets/img/listd_icon_right@2x.png" alt="" />
			</div>
		</div>
		<!--只有一批有来源-->
		<div class="information_list" v-if='!(!form.channelCode||form.channelCode=="001201")&&form.customerProperty=="001"&&form.property=="2"'>
			<div class="list_left">供应商品来源</div>
			<div class="list_right list_select">
				<select name="" id="" v-model="islocal" >
					<option disabled selected value="">请选供应商品来源(必选)</option>
					<option value="1">本地</option>
					<option value="2">外地</option>
				</select>
				<img class="list_right_img" src="../../assets/img/listd_icon_right@2x.png" alt="" />
			</div>
		</div>
		<!--一批和厂商有-->
		<div  v-if="form.customerProperty&&(form.customerProperty=='001'||form.customerProperty=='007')" class="information_list ">
			<div class="list_left">供应商品分类</div>
			<div class="list_right">
			    <yd-checkbox-group class='list_radio' v-model="businessScope">
			        <yd-checkbox shape="circle" v-for='item in categoryArr' :key='item.code' :val="item.code">{{item.name}}</yd-checkbox>
			    </yd-checkbox-group>
			</div>
		</div>
		<!--&&(form.property=='1'||!form.property)-->
		<div  v-if="form.customerProperty&&form.customerProperty!='005'" class="information_list">
			<div class="list_left">营业执照号</div>
			<input maxlength="20" v-model='form.regId' type="text" class="list_right list_input" placeholder="请输入营业执照号" />
		</div>
		<div :key='form.customerProperty+"0"' v-if="form.customerProperty&&form.customerProperty!='005'" class="information_list">
			<div class="list_left">营业执照照片</div>
			<uploadOneImg :uploadNum='0' :picUrl.sync='form.businessLicensePic'></uploadOneImg>
		</div>
		
		<template v-if="form.customerProperty&&form.customerProperty!='005'">
			<div :style="{display:form.property=='2'&&form.customerProperty=='001'?'flex':'none'}"  :key='form.customerProperty+"1"'  class="information_list">
				<div class="list_left">市场证明</div>
				<uploadOneImg :uploadNum='1' :picUrl.sync='form.marketcertPic'></uploadOneImg>
			</div>
		</template>
		<!--:style="{display:form.property=='2'?'none':'flex'}" -->
		<template v-if="form.customerProperty&&form.customerProperty!='005'">
			<div  :key='form.customerProperty+"2"'  class="information_list">
				<div class="list_left">食品流通许可证</div>
				<uploadOneImg :uploadNum='2' :picUrl.sync='form.foodLicensePic'></uploadOneImg>
			</div>
		</template>
		<div :key='form.customerProperty+"3"' v-if="form.customerProperty&&form.customerProperty!='005'" class="information_list">
			<div class="list_left">清真食品准营证</div>
			<uploadOneImg :uploadNum='3' :picUrl.sync='form.muslimfoodPermitPic'></uploadOneImg>
		</div>
		<div v-if="form.customerProperty&&form.customerProperty!='005'" class="information_list">
			<div class="list_left">法人姓名</div>
			<input type="text" v-model='form.legalpepresent' maxlength="20" class="list_right list_input" placeholder="请输入法人名称" />
		</div>
		<div :key='form.customerProperty+"4"' v-if="form.customerProperty&&form.customerProperty!='005'" class="information_list">
			<div class="list_left">法人照片</div>
			<uploadOneImg :uploadNum='4' :picUrl.sync='form.legalpepresentPic'></uploadOneImg>
		</div>
		<div :key='form.customerProperty+"5"' v-if="form.customerProperty&&form.customerProperty!='005'" class="information_list">
			<div class="list_left">正面身份证</div>
			<uploadOneImg :uploadNum='5' :picUrl.sync='zmImg'></uploadOneImg>
		</div>
		<div :key='form.customerProperty+"6"' v-if="form.customerProperty&&form.customerProperty!='005'" class="information_list">
			<div class="list_left">反面身份证</div>
			<uploadOneImg :uploadNum='6' :picUrl.sync='fmImg'></uploadOneImg>
		</div>
		<div :key='form.customerProperty+"7"' v-if="form.customerProperty=='004'" class="information_list">
			<div class="list_left">门头照片</div>
			<uploadOneImg :uploadNum='7' :picUrl.sync='form.storePic'></uploadOneImg>
		</div>
		
		<div class="information_submit" @click='submit'>提交</div>
	</yd-layout>
</template>

<script>
	import { Upload, Dialog } from 'element-ui';
	import uploadOneImg from '../../components/uploadOneImg.vue'
	import {Radio, RadioGroup} from 'vue-ydui/dist/lib.rem/radio';
	import {CheckBox, CheckBoxGroup} from 'vue-ydui/dist/lib.rem/checkbox';
	export default {
		components: {
			[Upload.name]: Upload,
			[Dialog.name]: Dialog,
			[uploadOneImg.name]:uploadOneImg,
			[Radio.name]:Radio,
			[RadioGroup.name]:RadioGroup,
			[CheckBox.name]:CheckBox,
			[CheckBoxGroup.name]:CheckBoxGroup,
		},
		
		data() {
			return {
				zmImg:'',
				fmImg:'',
				form: {
					extend:'',
					tel:'',
					name: '',
					customerProperty: '',
					id: '',
					address: '',
					regId: '', //营业执照号码
					businessLicensePic: '', //执照照片
					marketcertPic:'',//市场证明
					legalpepresent: '', //法人
					legalpepresentPic: '', //法人照片
					storePic: '', //门头照片
					idCard:'',//身份证正反照片？
					property:'',//经营户类型
					channelCode :'xzqd',//渠道
					businessScope:'',
					islocal:'',
					remark:'',//备注
					foodLicensePic:'',//食品许可证
					muslimfoodPermitPic:'',//清真食品图片
				},
				islocal:'',//本地还是外地
				businessScope:[],//供应商商品分类
				datadicArr:[],
				categoryArr:[],
				channelArr:[],
			}
		},
		created() {
			var str=sessionStorage.getItem('qr_information')
			if(str&&str!='{}'){
				this.form.name = JSON.parse(str).nickName
				this.form.id = JSON.parse(str).typeCode
				this.form.tel = JSON.parse(str).mobile
			}else{
//				this.$router.go(-1)
			}
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			this.init();
		},
		methods: {
			init(){
				this.$root.ajax({
					name:'datadic/list',
					params:{
						dataType:'CUSTOMER_PROPERTY'
					}
				}).then((d)=>{
					this.datadicArr=d.aaData
				})
				this.$root.ajax({
					name:'category/list',
					params:{
						level:'1'
					}
				}).then((d)=>{
					this.categoryArr=d.aaData
				})
				this.$root.ajax({
					name:'channel/list',
					params:{level:'3'}
				}).then((d)=>{
					this.channelArr=d.aaData
				})
			},
			submit(){
				if(this.form.customerProperty){
//					property:'',//经营户类型
//					businessScope:[],//供应商商品分类
//					channelCode :'',//渠道
					if(this.form.customerProperty!='005'){
						if(this.form.channelCode=="xzqd"&&(this.form.customerProperty=='001'||this.form.customerProperty=='002')){
							this.$dialog.toast({
			                    mes: '请选择渠道',
			                    timeout: 1500
			                });
			                return 
						}
						if(!this.form.remark&&!this.form.channelCode&&(this.form.customerProperty=='001'||this.form.customerProperty=='002')){
							this.$dialog.toast({
			                    mes: '请填写渠道备注',
			                    timeout: 1500
			                });
			                return 
						}
						if(!(!this.form.channelCode||this.form.channelCode=='001201')&&!this.form.property&&(this.form.customerProperty=='001'||this.form.customerProperty=='002')){
							this.$dialog.toast({
			                    mes: '请选择经营户类型',
			                    timeout: 1500
			                });
			                return 
						}
						if(this.form.customerProperty=='001'||this.form.customerProperty=='007'){
							if(this.businessScope.length<=0){
								this.$dialog.toast({
				                    mes: '请选择供应商分类',
				                    timeout: 1500
				                });
				                return 
							}else{
								var arr=this.businessScope
								this.form.businessScope=arr.join('/')
							}
							if(!(!this.form.channelCode||this.form.channelCode=="001201")&&this.form.customerProperty=='001'&&this.form.property=="2"){
								if(this.islocal){
									this.islocal==1?this.form.islocal=0:this.form.islocal=1
								}else{
									this.$dialog.toast({
					                    mes: '请选择供应商品来源',
					                    timeout: 1500
					                });
					                return 
								}
							}
						}
						if(!this.form.regId&&(!this.form.property||this.form.property=="1")){
							this.$dialog.toast({
			                    mes: '请填写营业执照号',
			                    timeout: 1500
			                });
			                return 
						}
						if(!this.form.businessLicensePic){
							var mes='请上传营业执照照片';
							this.$dialog.toast({
			                    mes: mes,
			                    timeout: 1500
			                });
			                return 
						}
						if(!this.form.marketcertPic&&this.form.customerProperty=='001'&&this.form.property=='2'){
							var mes='请上传市场证明';
							this.$dialog.toast({
			                    mes: mes,
			                    timeout: 1500
			                });
			                return 
						}
//						if(!this.form.foodLicensePic){
//							this.$dialog.toast({
//			                    mes: '请上传食品流通许可证',
//			                    timeout: 1500
//			                });
//			                return 
//						}
						if(!this.form.legalpepresent){
							this.$dialog.toast({
			                    mes: '请填写法人',
			                    timeout: 1500
			                });
			                return 
						}
						if(!this.form.legalpepresentPic){
							this.$dialog.toast({
			                    mes: '请上传法人照片',
			                    timeout: 1500
			                });
			                return 
						}
						if(!this.zmImg&&this.fmImg){
							this.$dialog.toast({
			                    mes: '请上传正面身份证照片',
			                    timeout: 1500
			                });
			                return 
						}
						if(!this.fmImg&&this.zmImg){
							this.$dialog.toast({
			                    mes: '请上传反面身份证照片',
			                    timeout: 1500
			                });
			                return 
						}
						if(this.form.customerProperty=='004'){
							if(!this.form.storePic){
								this.$dialog.toast({
				                    mes: '请上传门头照片',
				                    timeout: 1500
				                });
				                return 
							}
						}
					}
					this.customerRegist();
				}else{
					this.$dialog.toast({
	                    mes: '请选择身份',
	                    timeout: 1500
	                });
				}
				
			},
			customerRegist(){
				var params={},oldParams={};
				oldParams=Object.assign({},oldParams,this.form)
				this.clearForm();
				params=Object.assign({},params,this.form)
				if(this.zmImg&&this.fmImg){
					this.form.idCard=this.zmImg+";"+this.fmImg
				}
				this.form.extend=this.form.customerProperty;
				params=Object.assign({},params,this.form)
				this.$root.ajax({
					name:'customer/update',
					params:params,
					errormsg:true,
				}).then((d)=>{
					console.log(d)
					if(d.state==0){
						this.$dialog.toast({
		                    mes: '保存成功,请重新登录',
		                    timeout: 1500,
		                    icon: 'success',
		                    callback: () => {
		                        this.$router.push({name:'qr_login'})
		                    }
		                });
					}else{
						this.form=Object.assign({},this.form,oldParams)
					}
					
				})
			},
			
			selectChange(){
					this.form.regId=''
					this.form.businessLicensePic=''
					this.form.legalpepresent=''
					this.form.legalpepresentPic=''
					this.form.storePic=''
					this.form.foodLicensePic='';//食品许可证
					this.form.muslimfoodPermitPic='';
					this.form.property=''
					this.form.channelCode='xzqd'
					this.form.businessScope=''
					this.form.islocal=''
					this.remark=''
						
					this.zmImg=''
					this.fmImg=''
				
			},
			clearForm(){
				if(this.form.customerProperty=='005'){
					this.form.regId=''
					this.form.businessLicensePic=''
					this.form.legalpepresent=''
					this.form.legalpepresentPic=''
					this.form.storePic=''
					this.form.foodLicensePic='';//食品许可证
					this.form.muslimfoodPermitPic='';
					
					this.form.property=''
					this.form.channelCode='xzqd'
					this.form.businessScope=''
					this.form.islocal=''
					this.remark=''
					
					this.zmImg=''
					this.fmImg=''
				}
				if(this.form.customerProperty!='004'){
					this.form.storePic=''
				}
				if (!(this.form.customerProperty=='001'||this.form.customerProperty=='002')){
					this.form.businessScope=''
					this.form.channelCode=""
					this.form.property='1'
					this.remark=''
				}else{
					
					if(this.form.property=="1"){
						this.form.marketcertPic=''
						this.form.islocal=''
					}
					//property经营户类型
					//channelCode=='001201' 自主经营
					if(this.form.customerProperty=='001'){
						if(this.form.channelCode=="001201"){
							this.remark=''
							this.form.islocal=''
							this.form.property=''
						}else if(!this.form.channelCode){ //渠道备注
							this.form.islocal=''
							this.form.property=''
						}else{ //有渠道的
							this.remark=''  //渠道备注
							if(this.form.property=='1'){
								this.form.islocal=''
							}
						} 
					}
						
				}
				if (this.form.customerProperty!='001'){
					this.form.islocal='' //本地外地
					this.form.marketcertPic=''
				}
				if(this.form.channelCode=='xzqd'){
					this.form.channelCode=''
				}
				
			}
		}
	}
</script>

<style lang='scss'>
	#qrInformation {
		padding-left: .2rem;
		.information_list {
			padding: .3rem 0;
			border-bottom: 1px solid #e4e4e4;
			display: flex;
			.list_left {
				color: #555;
				font-weight: bold;
				font-size: .28rem;
				width: 2rem;
				flex-grow: 0;
				text-align: right;
				margin-right: .2rem;
			}
			.list_right {
				width: 3rem;
				flex-grow: 1;
				font-size: .28rem;
				color: #555;
				outline: none;
				border: none;
				padding-right: .2rem;
				.list_radio{
					label{
						display: block;
						padding: .02rem 0;
					}
				}
			}
			.list_input {
				line-height: .28rem;
			}
			.list_select {
				align-items: center;
				display: flex;
				select {
					flex-grow: 1;
					outline: none;
					border: none;
				}
				.list_right_img {
					width: .14rem;
					height: .24rem;
				}
			}
		}
		.information_upload {
			margin-top: .25rem;
			display: flex;
			align-items: center;
			.upload_btn {
				line-height: .4rem;
				background: #018BE6;
				color: white;
				padding: .1rem;
				border-radius: .1rem;
				margin-left: .25rem;
			}
		}
		.information_submit {
			width: 80%;
			margin: .4rem auto 0;
			border-radius: .4rem;
			text-align: center;
			background: #6fb138;
			color: white;
			line-height: .78rem;
			height: .78rem;
			font-size: .32rem;
		}
		.el-dialog__body{
			img{
				position: relative;
				z-index: 9999;
			}
		}
		.el-dialog__wrapper{
			z-index: 9999;
		}
		.el-dialog__wrapper{
			top: 1rem;
		}
	}
</style>