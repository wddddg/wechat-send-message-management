<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="价格" prop="price">
        <el-input
          v-model="queryParams.price"
          placeholder="请输入价格"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enable">
        <el-select  v-model="queryParams.enable" placeholder="请选择状态" clearable @change="handleQuery">
          <el-option v-for="item in enable_status" :key="item.id" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" style="width: 308px">
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
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['']"
          >新增</el-button
        >
      </el-col>
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
      :data="setmealList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="价格"
        align="center"
        key="price"
        prop="price"
        v-if="columns[0].visible"
      />
      <el-table-column
        label="数量"
        align="center"
        key="number"
        prop="number"
        v-if="columns[1].visible"
      />
      <el-table-column
        label="备注"
        align="center"
        key="remark"
        prop="remark"
        v-if="columns[2].visible"
      />
      <el-table-column
        label="状态"
        align="center"
        key="enable"
        prop="enable"
        v-if="columns[3].visible"
      >
        <template #default="scope">
          <DictTag :options="enable_status" :value="scope && scope.row.enable"></DictTag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        align="center"
        key="createBy"
        prop="createBy"
        v-if="columns[4].visible"
      />
      <el-table-column
        label="创建时间"
        align="center"
        key="createTime"
        prop="createTime"
        v-if="columns[5].visible"
        width="160px"
      />
      <el-table-column
        label="更新人"
        align="center"
        key="updateBy"
        prop="updateBy"
        v-if="columns[6].visible"
      />
      <el-table-column
        label="更新时间"
        align="center"
        key="updateTime"
        prop="updateTime"
        v-if="columns[7].visible"
        width="160px"
      />
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button
              link
              type="primary"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['']"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              link
              type="primary"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['']"
            ></el-button>
          </el-tooltip>
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
    <SetmealListDialog v-model:value="showSetmealListDialog" :status="dialogStatus" @sucess="refresh" :rewriteFormData="rewriteFormData" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getList as getSetmealList, deleteSetmeal } from "@/api/setmeal-management/setmeal-list.js";
import SetmealListDialog from "./components/SetmealListDialog.vue";

const { proxy } = getCurrentInstance();
const { enable_status } = proxy.useDict("enable_status");
// 列显隐信息
const columns = ref([
  { key: 0, label: `价格`, visible: true },
  { key: 1, label: `数量`, visible: true },
  { key: 2, label: `备注`, visible: true },
  { key: 3, label: `状态`, visible: true },
  { key: 4, label: `创建人`, visible: true },
  { key: 5, label: `创建时间`, visible: true },
  { key: 6, label: `更新人`, visible: true },
  { key: 7, label: `更新时间`, visible: true },
]);

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
});
const dateRange = ref([]);
const loading = ref(false);
const setmealList = ref([]);
const showSearch = ref(true);
const total = ref(0)
const showSetmealListDialog = ref(false)
const dialogStatus = ref('none')
const rewriteFormData = ref({})
const selectionList = ref([])
const handleSelectionChange = (row) => {
  selectionList.value = row
};

const getList = () => {
  loading.value = true;
  getSetmealList(proxy.addDateRange(queryParams.value, dateRange.value))
    .then((res) => {
      setmealList.value = res.rows;
      total.value = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleDelete = (row) => {
  proxy.$modal.confirm('是否确认删除价格为"' + row.price + '"的数据项？').then(() => {
    return deleteSetmeal([row.id]);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  })
};
const handleDeletes = () => {
  const ids = selectionList.value.map((item) => item.id);
  const prices = selectionList.value.map((item) => item.price);
  proxy.$modal.confirm('是否确认删除价格为"' + prices + '"的数据项？').then(() => {
    return deleteSetmeal(ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  })
}
const handleQuery = () => {
  getList();
};

const handleAdd = () => {
  rewriteFormData.value = {}
  dialogStatus.value = 'add'
  showSetmealListDialog.value = true
}
/** 修改按钮操作 */
const handleUpdate = (row) => {
  rewriteFormData.value = row
  dialogStatus.value = 'edit'
  showSetmealListDialog.value = true
};
const resetQuery = () => {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
};

const refresh = () => {
  getList();
}
getList();
</script>

<style lang="sass" scoped></style>
