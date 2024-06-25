<template>
    <a-card>
        <div class="table-button-group">
            <div></div>
            <div>
                <a-button type="primary" @click="showDrawer">添加文章</a-button>
            </div>
        </div>
        <layoutTable :columns="columns" :tableRequest="getArticleList" :key="tableKey" :updateRow=true>
            <template #updateRow="{ column, record }">
                <template v-if="column.dataIndex === 'tags'">
                    <a-tag v-for="(value) in record.tags">{{ value }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'operation'">
                    <a-button type="link"
                        @click="() => { $router.push({ name: 'article_add', query: { id: record.id } }) }">编辑</a-button>
                </template>
            </template>
        </layoutTable>

    </a-card>
    <a-drawer :width="920" title="添加文章" placement="right" :open="open" @close="onClose" :keyboard="true"
        :maskClosable="false">
        <template #extra>
            <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
            <a-button type="primary" @click="onClose">提交</a-button>
        </template>
        sdfsdfdsf
    </a-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { getArticleList } from '@/api/request/article';
import layoutTable from '@/components/layoutTable.vue'
const open = ref<boolean>(false);
const tableKey = ref(1);
const columns = [
    {
        title: '文章标题',
        dataIndex: 'title',
        width: 400,
    },
    {
        title: '文章描述',
        dataIndex: 'description',
        width: 700,
        height: 100
    },
    {
        title: '分类',
        dataIndex: 'category_name',
    },
    {
        title: '标签',
        dataIndex: 'tags',
    },
    {
        title: '操作',
        dataIndex: 'operation',
    },
];

const showDrawer = () => {
    open.value = true;
};
const onClose = () => {
    open.value = false;
};
</script>
