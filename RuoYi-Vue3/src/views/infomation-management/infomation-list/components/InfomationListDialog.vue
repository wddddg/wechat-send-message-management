<template>
  <el-dialog
    :model-value="props.value"
    :title="title"
    width="500px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="createBy">
        <el-input v-model="form.createBy" disabled />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" disabled />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="form.price" disabled />
      </el-form-item>
      <el-form-item label="是否匿名" prop="isAnonymity">
        <el-switch
          v-model="form.isAnonymity"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          :active-value="1"
          :inactive-value="0"
          disabled
        />
      </el-form-item>
      <el-form-item label="信息内容" prop="informationContext">
        <el-input type="textarea" v-model="form.informationContext" :disabled="informationContextDisabled" :rows="4" />
      </el-form-item>
    </el-form>

    <template #footer v-if="!informationContextDisabled">
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, watch } from "vue";
import { updateInfomation } from "@/api/infomation-management/infomation-list.js";
import { ElMessage } from 'element-plus'

const props = defineProps(["value", "status", "rewriteFormData"]);
const emit = defineEmits(["update:value"]);
const title = computed(() => {
  return (props.status === "edit" ? "编辑" : "详情") + "信息";
});

const form = ref({ id: null, createBy: null, isAnonymity: null, phone: null, informationContext: null, price: null });
const rules = {
  informationContext: [{ required: true, message: "请输入信息内容", trigger: "change" }]
};
const formRef = ref(null);
const informationContextDisabled = computed(() => {
  return props.status === "edit" ? false : true;
})

const confirm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (!valid) {
      return;
    }
    if (props.status === "edit") {
      await updateInfomation(form.value).then(res => {
        ElMessage({
          message: '编辑信息成功',
          type: 'success'
        })
      })
    }
    handleClose();
    handleSucess();
  });
};

const handleClose = () => {
  form.value = { id: null, createBy: null, isAnonymity: null, phone: null, informationContext: null, price: null }
  formRef.value.resetFields()
  emit("update:value", false);
};
const handleSucess = () => {
  emit('sucess')
}

watch(() => props.value, val => {
  if (val) {
    for (const key in form.value) {
      if (props.rewriteFormData.hasOwnProperty(key) || props.rewriteFormData.hasOwnProperty("id")) {
        form.value[key] = props.rewriteFormData[key]
      }
    }
  }
})


</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
