<template>
	<div>
		<div v-if="pageInfo.isShowHeader" class="card">
			<Grid ref="gridRef" :gap="[pageInfo.headerGutter, 0]" :cols="24">
				<GridItem v-for="(item, index) in pageInfo.header" :key="index" v-bind="getResponsive(item)">
					<!-- <el-row class="card" :gutter="pageInfo.headerGutter">
						<el-col :span="item.span" v-for="(item, index) in pageInfo.header" :key="index"> -->
					<component
						:is="componentArray[item.component]"
						v-bind="item.props"
						v-model="item.props.vModel"
						:class="item.className"
					></component>
					<!-- </el-col>
					</el-row> -->
				</GridItem>
			</Grid>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getPageInfoById } from "@/api/modules/common";
import Grid from "@/components/Grid/index.vue";
import GridItem from "@/components/Grid/components/GridItem.vue";

const id = useRoute()?.meta?.generatePagesId;
const pageInfo = ref({});

const componentList = import.meta.globEager("@/components/RegisterComponents/**");
let componentArray = new Object();
Object.keys(componentList).forEach(key => {
	let keyArray = key.split("/");
	let name = keyArray[keyArray.length - 1].split(".")[0];
	componentArray[name] = componentList[key].default;
});

// 获取响应式设置
const getResponsive = item => {
	return {
		span: item.span,
		offset: item.offset ?? 0,
		xs: item.xs,
		sm: item.sm,
		md: item.md,
		lg: item.lg,
		xl: item.xl
	};
};

onMounted(() => {
	getPageInfoById(id).then(res => {
		pageInfo.value = res.data;
	});
});
</script>

<style lang="scss" scoped></style>
