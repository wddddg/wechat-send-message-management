<template>
  <el-dialog
    :model-value="props.value"
    title="编辑用户"
    width="800px"
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
      <el-form-item label="微信用户唯一标识" prop="openid" label-width="140px">
        <el-input v-model="form.openid" class="width-100percentage" disabled />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" class="width-100percentage" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" class="width-100percentage" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="form.sex" class="ml-4">
              <el-radio v-for="item in sys_user_sex" :key="item.id" :label="item.value" size="large">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idNumber">
            <el-input v-model="form.idNumber" class="width-100percentage" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="余额" prop="balance">
            <el-input-number v-model="form.balance" class="width-100percentage" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="头像" prop="avatar">
        <ImagePreview :src="form.avatar" :width="100" :height="100" />
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
import { watch } from "vue";
import { updateWechatUser } from "@/api/wechat/user-list.js";
import { ElMessage } from 'element-plus'

const props = defineProps(["value", "rewriteFormData", "dict"]);
const { sys_user_sex } = props.dict;
const emit = defineEmits(["update:value"]);
const defaultForm = { id: null, name: null, phone: null, sex: null, idNumber: null, avatar: null, balance: null, openid: null }

const form = ref({...defaultForm});
const rules = {
  price: [{ required: true, message: "请输入套餐价格", trigger: "blur" }],
  number: [{ required: true, message: "请输入套餐数量", trigger: "blur" }]
};
const formRef = ref(null);

const confirm = async () => {
  await updateWechatUser(form.value).then(res => {
    ElMessage({
      message: '编辑成功',
      type: 'success'
    })
    handleClose();
    emit('sucess')
  })
};

const handleClose = () => {
  form.value = { ...defaultForm }
  formRef.value.resetFields()
  emit("update:value", false);
};

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
