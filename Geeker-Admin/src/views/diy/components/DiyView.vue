<template>
	<div>
		<div>
			<el-row :gutter="16">
				<el-col :span="8">
					<el-card class="box-card">
						<template #header>
							<div class="card-header">
								<span>路由信息</span>
							</div>
						</template>
						<el-form label-position="left" label-width="120px" :model="routeInfoFrom">
							<el-form-item label="菜单标题">
								<el-input v-model="routeInfoFrom.region" />
							</el-form-item>
							<el-form-item label="路由地址">
								<el-input v-model="routeInfoFrom.name" />
							</el-form-item>
							<el-form-item label="是否创建路由">
								<el-radio-group v-model="routeInfoFrom.isCreateRoute">
									<el-radio label="1" size="large">是</el-radio>
									<el-radio label="0" size="large">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="数据库表名">
								<el-input v-model="routeInfoFrom.type" />
							</el-form-item>
						</el-form>
					</el-card>
				</el-col>
				<el-col :span="16">
					<el-card class="box-card">
						<template #header>
							<div class="card-header">
								<span>页面信息</span>
								<el-button type="text" @click="editViewInfo">编辑</el-button>
							</div>
						</template>
					</el-card>
				</el-col>
			</el-row>
		</div>
		<div class="opt-btn mt16">
			<el-button type="text">重置</el-button>
			<el-button type="primary">保存草稿</el-button>
			<el-button type="primary">生成</el-button>
		</div>
		<ViewDialog :value="showViewDialog" @input="$event => (showViewDialog = $event)" />
	</div>
</template>

<script setup>
import { ref } from "vue";
import ViewDialog from "./ViewDialog.vue";
const routeInfoFrom = ref({
	isCreateRoute: "1"
});
const showViewDialog = ref(false);
const editViewInfo = () => {
	showViewDialog.value = true;
};
</script>

<style lang="scss" scoped>
.opt-btn {
	text-align: right;
}
.card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
