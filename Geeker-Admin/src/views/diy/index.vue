<template>
	<el-tabs type="border-card" class="demo-tabs">
		<el-tab-pane label="DIY页面"> <DiyView /> </el-tab-pane>
		<el-tab-pane label="DIY小程序"></el-tab-pane>
	</el-tabs>
</template>

<script lang="ts" setup>
import DiyView from "./components/DiyView.vue";
</script>
<style scoped lang="scss"></style>
