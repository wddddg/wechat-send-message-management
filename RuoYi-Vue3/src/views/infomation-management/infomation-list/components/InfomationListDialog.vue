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
      <el-form-item label="是否匿名" prop="isAnonymity">
        <el-input v-model="form.isAnonymity" disabled />
      </el-form-item>
      <el-form-item label="用户名" prop="createBy">
        <el-input v-model="form.createBy" disabled />
      </el-form-item>
      <el-form-item label="信息内容" prop="informationContext">
        <el-input type="textarea" v-model="form.informationContext" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, watch } from "vue";
import { addSetmeal, updateSetmeal } from "@/api/setmeal-management/setmeal-list.js";
import { ElMessage } from 'element-plus'

const props = defineProps(["value", "status", "rewriteFormData"]);
const emit = defineEmits(["update:value"]);
const title = computed(() => {
  return (props.status === "add" ? "新增" : "编辑") + "套餐";
});

const form = ref({ id: null, price: 0, number: 0, enable: 0, remark: "" });
const rules = {
  price: [{ required: true, message: "请输入套餐价格", trigger: "blur" }],
  number: [{ required: true, message: "请输入套餐数量", trigger: "blur" }]
};
const formRef = ref(null);

const confirm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (!valid) {
      return;
    }
    if (props.status === "add") {
      await addSetmeal(form.value).then(res => {
        ElMessage({
          message: '新增套餐成功',
          type: 'success'
        })
      })
    } else if (props.status === "edit") {
      await updateSetmeal(form.value).then(res => {
        ElMessage({
          message: '编辑套餐成功',
          type: 'success'
        })
      })
    }
    handleClose();
    handleSucess();
  });
};

const handleClose = () => {
  form.value = { id: null, price: 0, number: 0, enable: 0, remark: ""}
  formRef.value.resetFields()
  emit("update:value", false);
};
const handleSucess = () => {
  emit('sucess')
}

watch(() => props.value, val => {
  if (val && props.status === "edit") {
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
