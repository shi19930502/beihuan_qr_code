<template>
	<div class="update_upload_img">
		<el-upload 
			:data='{savePath: "productOnline"}' 
			class="upload-demo" 
			:action="imgAction" 
			accept='image/*' 
			:show-file-list='false' 
			:on-success='onSuccess' 
			:on-error='onError' 
			:before-upload='beforeUpload' 
			:limit="1" 
			:file-list="fileList"
			:on-exceed='onExceed'
			>
			<img v-if='imgUrl' class="user_img" :src="$root.config.img_url+imgUrl" alt="" />
			<div v-else class="list_img_update">上传图片</div>
			<div slot="tip" class="el-upload__tip">
				<div  v-if='imgUrl' slot="tip" @click="lookImg" style="width: 2rem;margin: .3rem auto 0;" class="list_img_update ">
					查看大图
				</div>
				<div style="color: red;text-align: center;padding: .2rem .49rem 0 0rem;">**图片不合格，已被删除，请重新上传，且大小不超过4M**</div>
			</div>
		</el-upload>
		<yd-popup v-model="showImg"  position="bottom" height="100%">
			<img class="show_img" :src="$root.config.img_url+imgUrl" alt="" />
			<div class="close_btn">
            	<yd-button type="primary" style="margin: .3rem auto;" @click.native="showImg = false">关闭</yd-button>
			</div>
        </yd-popup>
	</div>
</template>

<script>
	import { Upload } from 'element-ui';
	import {Button, ButtonGroup} from 'vue-ydui/dist/lib.rem/button';
	import {Popup} from 'vue-ydui/dist/lib.rem/popup';	
	export default {
		name: 'updateUploadImg',
		components: {
			[Upload.name]: Upload,
			[Popup.name]: Popup,
			[Button.name]: Button,
			[ButtonGroup.name]: ButtonGroup,

		},
		props:{
			imgUrl:{
				default:'',
			}
		},
		data() {
			return {
				imgAction:'',
				fileList:[],
				showImg:false,
			}
		},
		created() {
			this.imgAction = ROOTURL + '/api/comm/fileUpload/file/imgUpload?token=' + ''
		},
		watch: {

		},
		computed: {

		},
		mounted() {

		},
		methods: {
			lookImg(){
				this.showImg=true;
//				this.$emit('update:imgUrl','')
//				this.fileList=[]
			},
			onSuccess(resp, file, fileList){
					this.$dialog.loading.close();
				if(resp.state == 0) {
					this.fileList=[]
					this.$nextTick(()=>{
						this.$emit('update:imgUrl',resp.aaData.path)
				
					})
//					this.imgUrl = resp.aaData.path
				} else {
					this.$nextTick(() => {
						this.$dialog.toast({
							mes: '图片上传失败,请重新选择！！',
							timeout: 1500
						});
					})
				}
			},
			onError(){
					this.$dialog.loading.close();
				this.$dialog.toast({
					mes: '图片上传失败，请检测网络（有些wifi不能上传）',
					timeout: 1500
				});
			},
			beforeUpload(file){
//				this.$dialog.loading.open('图片上传中...');
				const isLt2M = file.size / 1024 / 1024 < 4;
				if(!isLt2M) {
					this.$dialog.toast({
						mes: '图片大小不能超过4M~~',
						timeout: 1500
					});
					this.$dialog.loading.close();
				}
				return isLt2M;
			},
			onExceed(files, fileList){
				
			},
		}
	}
</script>

<style lang='scss'>
	.update_upload_img {
		.user_img {
			margin: .2rem auto .2rem;
			display: block;
			width: 3rem;
			height: 3rem;
			border: 1px solid #D6D6D6;
		}
		.upload-demo {
			text-align: center;
			.el-upload--text {
				img {
					margin: auto;
				}
			}
		}
		.list_img_update{
			margin: .1rem  .2rem;
			background: #018BE6;
			color: white;
			padding: .1rem .2rem;
			border-radius: .08rem;
		}
		.show_img{
			margin: 1rem auto 0;
			border: 1px solid #D6D6D6;
			max-width: 90%;
			max-height: 10rem;
		}
		.close_btn{
			text-align: center;
		}
	}
</style>