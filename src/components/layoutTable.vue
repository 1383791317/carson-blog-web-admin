<template>
  <a-form ref="formRef" class="ant-advanced-search-form" :model="formstate" v-if="searchForm">
    <a-row :gutter="24">
      <a-col :span="6" v-for="(item, index) in searchForm">
        <a-form-item :label="item.label" :name="item.name">
          <a-input :placeholder="item.placeholder" v-model:value="formstate[item.name]" v-if="item.type === 'input'" />
        </a-form-item>
      </a-col>

    </a-row>
    <a-row :gutter="24">
      <a-col :span="24" style="text-align: right">
        <a-button type="primary" @click.prevent="onSubmit">搜索</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
        <a style="margin-left: 18px;font-size: 12px" @click="expand = !expand">
          高级筛选
        </a>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top: 10px;">
      <a-col :span="6" v-for="(item, index) in advancedsearchForm" v-show="expand">
        <a-form-item :label="item.label" :name="item.name">
          <a-input :placeholder="item.placeholder" v-model:value="formstate[item.name]" v-if="item.type === 'input'" />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <a-table :data-source="dataItems" size="middle" :columns="columns" :pagination="defaultPagination">
    <template #bodyCell="{ column, text, record, index }">
      <template v-if="column.rowEdit">
        <div v-if="editableData.includes(index + column.dataIndex)">
          <a-input v-model:value="record[column.dataIndex]" style="margin: -5px ;width: 70%;" />
          <a-button type="link" @click="rowEditSave(column, record, index)">保存</a-button>
          <a-button type="link" style="padding-left: 0;">取消</a-button>
        </div>
        <div v-else>
          <span>{{ text }}</span>
          <svg-icon name="edit" width="15px" height="15px" style="position: absolute;right: 10px;"
            @click="rowEditEdit(index + column.dataIndex)" />
        </div>
      </template>
      <template v-if="updateRow">
        <slot name="updateRow" :record="record" :column="column"></slot>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref, onMounted, toRaw, reactive, PropType } from 'vue';
const editableData = ref([]);
const formRef = ref();
const expand = ref(false);
const formstate = ref({});
interface searchFormType {
  type: 'input' | 'select';
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: any
}
interface rowEditSubmitType {
  indexKey: string;
  submit: Function
}
interface columnsType {
  title: string;
  dataIndex: string;
  width?: number;
  key?: string;
  rowEdit?: boolean;
  rowEditSubmit?: rowEditSubmitType;
}
const props = defineProps({
  tableRequest: { type: Function, required: true },
  columns: { type: Array as PropType<columnsType[]>, required: true },
  updateRow: { type: Boolean },
  searchForm: { type: Array as PropType<searchFormType[]> },
  advancedsearchForm: { type: Array as PropType<searchFormType[]> },
});

const dataItems = ref([]);
const params = reactive({
  page: 1,
  limit: 10,
});
const defaultPagination = reactive({
  current: 1,
  defaultPageSize: 10,
  total: 0,
  position: ['bottomLeft'],
  size: "default",
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '30', '40'],//每页中显示的数据
  showTotal: (total) => `共 ${total} 条`,
  onChange: (page, pageSize) => {
    params.page = page;
    params.limit = pageSize;
    getTableData(params);
  },
});
const onSubmit = () => {
  params.page = 1;
  getTableData({
    ...params,
    ...Object.fromEntries(Object.entries(formstate.value).filter(([key, value]) => value !== undefined && value !== ''))
  });
};
onMounted(async () => {
  getTableData(params)
  if (props.searchForm) {
    props.searchForm.forEach(item => {
      formstate.value[item.name] = item.defaultValue
    })
  }
});
const getTableData = (query) => {
  props.tableRequest(query).then(({ isSuccess, apiResultData }) => {
    if (!isSuccess) return;
    defaultPagination.total = apiResultData.total;
    defaultPagination.current = apiResultData.page
    dataItems.value = apiResultData.data;
  });
};
const resetForm = () => {
  formRef.value.resetFields();
};
const rowEditEdit = (key) => {
  editableData.value.push(key)
}
const rowEditSave = (column, record, index) => {
  let body = {};
  body[column.dataIndex] = record[column.dataIndex]
  body[column.rowEditSubmit.indexKey] = record[column.rowEditSubmit.indexKey]
  column.rowEditSubmit.submit(body).then(({ isSuccess }) => {
    if (isSuccess) {
      console.log(index + column.dataIndex);
      let key = index + column.dataIndex;
      for (let i = editableData.value.length - 1; i >= 0; i--) {
        if (editableData.value[i] === key) {
          editableData.value.splice(i, 1);
        }
      }
    }
  })
}
</script>
