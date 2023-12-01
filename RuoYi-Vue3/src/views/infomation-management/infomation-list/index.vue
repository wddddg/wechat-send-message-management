<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入用户名"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select  v-model="queryParams.status" placeholder="请选择状态" clearable @change="handleQuery">
          <el-option v-for="item in information_status" :key="item.id" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间" style="width: 308px">
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
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="selectionList.length !== 1"
          @click="handleUpdate(selectionList[0])"
          v-hasPermi="['']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="selectionList.length === 0"
          @click="handleDeletes"
          v-hasPermi="['']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="informationList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="用户名"
        align="center"
        key="createBy"
        prop="createBy"
        v-if="columns[0].visible"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        label="手机号"
        align="center"
        key="phone"
        prop="phone"
        v-if="columns[1].visible"
        width="120"
      />
      <el-table-column
        label="信息内容"
        align="center"
        key="informationContext"
        prop="informationContext"
        v-if="columns[2].visible"
        show-overflow-tooltip
      />
      <el-table-column
        label="状态"
        align="center"
        key="status"
        prop="status"
        v-if="columns[3].visible"
      >
        <template #default="scope">
          <DictTag :options="information_status" :value="scope && scope.row.status"></DictTag>
        </template>
      </el-table-column>
      <el-table-column
        label="是否匿名"
        align="center"
        key="isAnonymity"
        prop="isAnonymity"
        v-if="columns[4].visible"
        width="160px"
      >
        <template #default="scope">
          <DictTag :options="whether" :value="scope && scope.row.isAnonymity"></DictTag>
        </template>
      </el-table-column>
      <el-table-column
        label="发送时间"
        align="center"
        key="accessTime"
        prop="accessTime"
        v-if="columns[5].visible"
        width="160px"
      />
      <el-table-column
        label="价格"
        align="center"
        key="price"
        prop="price"
        v-if="columns[6].visible"
        width="160px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        key="createTime"
        prop="createTime"
        v-if="columns[7].visible"
        width="160px"
      />
      <el-table-column
        label="操作"
        align="center"
        width="400"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="accessInformation(scope.row)"
            v-hasPermi="['']"
            :disabled="accessStatusDisabled(scope.row.status)"
          >发送</el-button>
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="rejectInformation(scope.row)"
            v-hasPermi="['']"
            :disabled="accessStatusDisabled(scope.row.status)"
          >驳回</el-button>
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleDetails(scope.row)"
            v-hasPermi="['']"
          >详情</el-button>
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['']"
            :disabled="accessStatusDisabled(scope.row.status)"
          >修改</el-button>
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleDelete(scope.row)"
            v-hasPermi="['']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <InfomationListDialog v-model:value="showInfomationListDialog" :status="dialogStatus" @sucess="refresh" :rewriteFormData="rewriteFormData" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getList as getInfomationList, deleteInfomation } from "@/api/infomation-management/infomation-list.js";
import InfomationListDialog from "./components/InfomationListDialog.vue";

const { proxy } = getCurrentInstance();
const { information_status, whether } = proxy.useDict("information_status", "whether");

// 列显隐信息
const columns = ref([
  { key: 0, label: `用户名`, visible: true },
  { key: 1, label: `手机号`, visible: true },
  { key: 2, label: `信息内容`, visible: true },
  { key: 3, label: `状态`, visible: true },
  { key: 4, label: `是否匿名`, visible: true },
  { key: 5, label: `发送时间`, visible: true },
  { key: 6, label: `价格`, visible: true },
  { key: 7, label: `创建时间`, visible: true },
]);

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
});
const dateRange = ref([]);
const loading = ref(false);
const informationList = ref([]);
const showSearch = ref(true);
const total = ref(0)
const selectionList = ref([])
const showInfomationListDialog = ref(false);
let rewriteFormData = {}
const dialogStatus = ref("none");

const handleSelectionChange = (row) => {
  selectionList.value = row
};

const getList = () => {
  loading.value = true;
  getInfomationList(proxy.addDateRange(queryParams.value, dateRange.value, 'AccessTime'))
    .then((res) => {
      informationList.value = res.rows;
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
const accessStatusDisabled = (status) => {
  return status === 2 ? false : true;
}

const accessInformation = (data) => {
  console.log(data);
}

const rejectInformation = (data) => {
  console.log(data);
}

const handleUpdate = (data) => {
  rewriteFormData = data
  dialogStatus.value = "edit"
  showInfomationListDialog.value = true;
}

const handleDetails = (data) => {
  rewriteFormData = data
  dialogStatus.value = "details"
  showInfomationListDialog.value = true;
}

const handleDelete = (row) => {
  proxy.$modal.confirm('是否确认删除信息内容为"' + row.informationContext + '"的数据项？').then(() => {
    return deleteInfomation([row.id]);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  })
};
const handleDeletes = () => {
  const ids = selectionList.value.map((item) => item.id);
  const informations = selectionList.value.map((item) => item.informationContext);
  proxy.$modal.confirm('是否确认删除信息内容为"' + informations + '"的数据项？').then(() => {
    return deleteInfomation(ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  })
}

const refresh = () => {
  getList();
}

getList();
</script>

<style lang="sass" scoped></style>
