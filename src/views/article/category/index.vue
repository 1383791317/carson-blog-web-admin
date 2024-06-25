<template>
    <a-card>
        <a-form layout="inline" :model="formState" style="margin-bottom: 20px;">
            <a-form-item label="上级分类" width="600">
                <a-select v-model:value="formState.parent_id" placeholder="请选择上级分类" style="width: 185px;"
                    :options="categoryParentItems"></a-select>
            </a-form-item>
            <a-form-item label="分类名称" v-bind="validateInfos.name" width="600">
                <a-input v-model:value="formState.name" placeholder="输入分类名称" width="600" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" @click.prevent="onSubmit">
                    保存
                </a-button>
                <a-button style="margin-left: 10px" @click="reset">重置</a-button>
            </a-form-item>
        </a-form>
        <layoutTable :columns="columns" :tableRequest="getArticleCategoryList" :key="tableKey">
            <template #operation="{ record }">
                <a-popconfirm title="确定要删除吗？" @confirm="delTableRow(record.id)">
                    <template #icon>
                        <svg-icon name="question" color="#e41c07" />
                    </template>
                    <a-button type="link" danger>删除</a-button>
                </a-popconfirm>
            </template>
        </layoutTable>
    </a-card>
</template>
<script lang="ts" setup>
import { ref, reactive, toRaw, onMounted } from 'vue';
import { Form } from 'ant-design-vue';
import { getArticleCategoryList, articleCategorySave, articleCategoryDel, getParentCategory } from '@/api/request/article';
import layoutTable from '@/components/layoutTable.vue'
const tableKey = ref(1);
const categoryParentItems = ref([])
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        rowEdit: true,
        width: 500,
        rowEditSubmit: {
            indexKey: 'id',
            submit: articleCategorySave
        }
    },
    {
        title: '添加时间',
        dataIndex: 'created_at',
    },
    {
        title: '操作',
        dataIndex: 'operation',
    }
]
const formState = reactive({
    name: '',
    parent_id: null
});
const rulesRef = reactive({
    name: [{ required: true, message: '分类名称不能为空' }],
});
const { resetFields, validate, validateInfos } = Form.useForm(formState, rulesRef);
const onSubmit = () => {
    validate()
        .then(res => {
            articleCategorySave(toRaw(formState)).then(({ isSuccess }) => {
                if (isSuccess) {
                    reset();
                    tableKey.value += 1
                    console.log(formState)
                    if (formState.parent_id === null) {
                        initParentItems();
                    }
                }
            });
        })
        .catch(err => {
            console.log('error', err);
        });
};
const reset = () => {
    resetFields();
};
const delTableRow = (id) => {
    articleCategoryDel({ id: id }).then(({ isSuccess }) => {
        if (isSuccess) {
            tableKey.value += 1
            initParentItems();
        }
    });
}
const initParentItems = async () => {
    getParentCategory().then(({ apiResultData }) => {
        categoryParentItems.value = apiResultData as []
    });
}
onMounted(async () => { 
    await initParentItems()
})
</script>