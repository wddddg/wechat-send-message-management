<template>
	<el-dialog v-model="value" title="编辑页面信息" width="95%" :before-close="handleClose">
		<div>
			<el-row :gutter="16">
				<el-col :span="8">
					<el-row :gutter="12">
						<el-col :span="12">
							<el-card>
								<template #header>
									<div>
										<span>组件</span>
									</div>
								</template>
								<component v-for="(item, index) in registerComponentsList" :key="index" :is="item.name" />
							</el-card>
						</el-col>
						<el-col :span="12">
							<el-card>
								<template #header>
									<div>
										<span>属性</span>
									</div>
								</template>
							</el-card>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="16">
					<el-card> </el-card>
				</el-col>
			</el-row>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleClose"> 确定 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, createApp, onMounted } from "vue";
import { getRegisterComponents } from "@/api/modules/common";
const value = ref(false);
const handleOpen = () => {
	value.value = true;
};
const handleClose = () => {
	value.value = false;
};
const registerComponentsList = ref([]);
const componentList = import.meta.globEager("@/components/RegisterComponents/**");
let componentArray = new Object();
Object.keys(componentList).forEach(key => {
	let keyArray = key.split("/");
	let name = keyArray[keyArray.length - 1].split(".")[0];
	componentArray[name] = componentList[key].default;
});

Object.keys(componentArray).forEach(key => {
	createApp({
		component: {
			key: componentArray[key]
		}
	});
});
onMounted(() => {
	getRegisterComponents().then(res => {
		registerComponentsList.value = res.data;
	});
});
defineExpose({
	handleOpen
});
</script>

<style lang="scss" scoped></style>
