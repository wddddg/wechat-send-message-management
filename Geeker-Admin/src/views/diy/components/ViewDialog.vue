<template>
	<el-dialog v-model="prop.value" title="Tips" width="30%" :before-close="handleClose">
		<span>This is a message</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">Cancel</el-button>
				<el-button type="primary" @click="handleClose"> Confirm </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const prop = defineProps({
	value: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(["input"]);

const handleClose = () => {
	emit("input", false);
};
</script>

<style lang="scss" scoped></style>
