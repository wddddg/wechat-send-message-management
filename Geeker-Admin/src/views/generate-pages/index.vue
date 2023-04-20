<template>
	<div>
		<div v-if="pageInfo.isShowHeader" class="card">
			<Grid ref="gridRef" :gap="[pageInfo.headerGutter, 0]" :cols="24">
				<GridItem v-for="(item, index) in pageInfo.header" :key="index" v-bind="getResponsive(item)">
					<!-- <el-row class="card" :gutter="pageInfo.headerGutter">
						<el-col :span="item.span" v-for="(item, index) in pageInfo.header" :key="index"> -->
					<component :is="componentArray[item.component]" v-bind="item.props" v-model="item.props.vModel" :class="item.className">
					</component>
					<!-- </el-col>
					</el-row> -->
				</GridItem>
				<GridItem suffix v-if="pageInfo.headerBtnOptShow">
					<div class="operation">
						<div v-if="pageInfo.headerBtnOpt?.preBtnSlot.length">
							<div v-for="(item, index) in pageInfo.headerBtnOpt?.preBtnSlot" :key="index">
								<component :is="componentArray[item.component]" v-bind="item.props" :class="item.className"></component>
							</div>
						</div>
						<el-button
							:type="pageInfo.headerBtnOpt?.defaultSearchBtnTheme"
							:icon="Search"
							@click="search"
							v-if="pageInfo.headerBtnOpt?.defaultSearchBtnShow"
							>{{ pageInfo.headerBtnOpt?.defaultSearchBtnText }}</el-button
						>
						<el-button
							:type="pageInfo.headerBtnOpt?.defaultResetBtnTheme"
							:icon="Delete"
							@click="reset"
							v-if="pageInfo.headerBtnOpt?.defaultResetShow"
							>{{ pageInfo.headerBtnOpt?.defaultResetBtnText }}</el-button
						>
						<div v-if="pageInfo.headerBtnOpt?.nextBtnSlot.length">
							<div v-for="(item, index) in pageInfo.headerBtnOpt?.nextBtnSlot" :key="index">
								<component :is="componentArray[item.component]" v-bind="item.props" :class="item.className"></component>
							</div>
						</div>
					</div>
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
import { Delete, Search } from "@element-plus/icons-vue";

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
