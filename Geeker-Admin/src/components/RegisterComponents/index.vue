<template>
	<div>
		<div v-for="(item, index) in registerComponentsList" :key="index">
			{{ item.title }}
			<component :is="item.component" />
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getRegisterComponents } from "@/api/modules/common";

const registerComponentsList = ref([]);
const componentList = import.meta.globEager("@/components/RegisterComponents/**");
let componentArray = new Object();
Object.keys(componentList).forEach(key => {
	let keyArray = key.split("/");
	let name = keyArray[keyArray.length - 1].split(".")[0];
	componentArray[name] = componentList[key].default;
});

onMounted(() => {
	getRegisterComponents().then(res => {
		registerComponentsList.value = res.data.map(item => {
			return {
				...item,
				component: componentArray[item.name]
			};
		});
	});
});
</script>

<style lang="scss" scoped></style>
