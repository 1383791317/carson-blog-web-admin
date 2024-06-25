<template>
    <a-card>
        <a-form layout="inline" :model="formState" style="margin-bottom: 20px;">
            <a-form-item label="添加标签" v-bind="validateInfos.title" width="600">
                <a-input v-model:value="formState.name" placeholder="输入标签名称" width="600" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" @click.prevent="onSubmit">
                    保存
                </a-button>
                <a-button style="margin-left: 10px" @click="reset">重置</a-button>
            </a-form-item>
        </a-form>
        <layoutTable :columns="columns" :tableRequest="getArticletTagList" :key="tableKey">
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
import { ref, reactive, toRaw } from 'vue';
import { Form } from 'ant-design-vue';
import { getArticletTagList, articleTagSave, articleTagDel } from '@/api/request/article';
import layoutTable from '@/components/layoutTable.vue'
const tableKey = ref(1);
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        rowEdit: true,
        width: 500,
        rowEditSubmit: {
            indexKey: 'id',
            submit: articleTagSave
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
});
const rulesRef = reactive({
    name: [{ required: true, message: '分类名称不能为空' }]
});
const { resetFields, validate, validateInfos } = Form.useForm(formState, rulesRef);
const onSubmit = () => {
    validate().then(res => {
        articleTagSave(toRaw(formState)).then(({ isSuccess }) => {
            if (isSuccess) {
                reset();
                tableKey.value += 1
            }
        });
    }).catch(err => {
        console.log('error', err);
    });
};
const reset = () => {
    resetFields();
};
const delTableRow = (id) => {
    articleTagDel({ id: id }).then(({ isSuccess }) => {
        if (isSuccess) {
            tableKey.value += 1
        }
    });
}
</script>