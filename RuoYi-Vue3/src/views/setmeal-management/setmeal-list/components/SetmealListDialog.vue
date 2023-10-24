<template>
  <el-dialog
    :model-value="value"
    :title="title"
    width="30%"
    :before-close="handleClose"
  >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'

const { value, status } = defineProps(['value', 'status'])
const emit = defineEmits(['update:value'])
const title = computed(() => status === 'add' ? '新增' : '编辑')

const confirm = async() => {
  // if (status === 'add') {
  //   await xxx
  // } else if (status === 'edit') {

  // }
  // handleClose()
}

const handleClose = () => {
  emit('update:value', false)
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>