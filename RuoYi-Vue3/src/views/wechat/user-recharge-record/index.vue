<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="充值时间" style="width: 308px">
        <el-date-picker
          v-model="dateRange"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="wechatUserList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" width="50" label="序号" align="center" />
      <el-table-column
        label="姓名"
        align="center"
        key="userName"
        prop="userName"
        v-if="columns[0].visible"
        show-overflow-tooltip
      />
      <el-table-column
        label="手机号"
        align="center"
        key="userPhone"
        prop="userPhone"
        v-if="columns[1].visible"
      />
      <el-table-column
        label="头像"
        align="center"
        key="userAvatar"
        prop="userAvatar"
        v-if="columns[5].visible"
      >
        <template #default="scope">
          <ImagePreview :src="scope.row.userAvatar" :width="60" :height="60" />
        </template>
      </el-table-column>
      <el-table-column
        label="充值金额"
        align="center"
        key="rechargeAmount"
        prop="rechargeAmount"
        v-if="columns[7].visible"
      />
      <el-table-column
        label="充值时间"
        align="center"
        key="createTime"
        prop="createTime"
        v-if="columns[6].visible"
      />
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getList as getRechargeRecord } from "@/api/wechat/user-recharge-record.js";

const { proxy } = getCurrentInstance();
const { sys_user_sex } = proxy.useDict("sys_user_sex");

// 列显隐信息
const columns = ref([
  { key: 0, label: `姓名`, visible: true },
  { key: 1, label: `手机号`, visible: true },
  { key: 2, label: `微信用户唯一标识`, visible: true },
  { key: 3, label: `性别`, visible: true },
  { key: 4, label: `身份证号`, visible: true },
  { key: 5, label: `头像`, visible: true },
  { key: 6, label: `创建时间`, visible: true },
  { key: 7, label: `余额`, visible: true },
]);

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
});
const dateRange = ref([]);
const loading = ref(false);
const wechatUserList = ref([]);
const showSearch = ref(true);
const total = ref(0)
const selectionList = ref([])

const handleSelectionChange = (row) => {
  selectionList.value = row
};

const getList = () => {
  loading.value = true;
  getRechargeRecord(proxy.addDateRange(queryParams.value, dateRange.value, 'CreateTime'))
    .then((res) => {
      wechatUserList.value = res.rows;
      total.value = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleQuery = () => {
  getList();
};
const resetQuery = () => {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
};

getList();
</script>

<style lang="sass" scoped></style>
