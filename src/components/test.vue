<template>
     <customTable :columns="columns" :tableRequest="getArticleList" :searchForm="searchForm" :advancedsearchForm="advancedsearchForm">
        </customTable>
</template>
<script lang="ts" setup>
import customTable from '@/components/layoutTable.vue'
const searchForm: any[] = [
    {
        type: 'input',
        name: 'name',
        label: '分类名称',
        placeholder: '请输入分类名称',
        defaultValue: 'ces23422',
    },
    {
        type: 'input',
        name: 'name1',
        label: '分类名称',
        placeholder: '请输入分类名称',
        defaultValue: 'ces23422',
    },
    {
        type: 'input',
        name: 'name3',
        label: '分类名称',
        placeholder: '请输入分类名称',
    },
    {
        type: 'input',
        name: 'nam4e',
        label: '分类名称',
        placeholder: '请输入分类名称',
    }
];
const advancedsearchForm: any[] = [
    {
        type: 'input',
        name: 'name',
        label: '分类名称',
        placeholder: '请输入分类名称',
        defaultValue: 'ces23422',
    },
    {
        type: 'input',
        name: 'name1',
        label: '分类名称',
        placeholder: '请输入分类名称',
        defaultValue: 'ces23422',
    },
    {
        type: 'input',
        name: 'name3',
        label: '分类名称',
        placeholder: '请输入分类名称',
    },
    {
        type: 'input',
        name: 'nam4e',
        label: '分类名称',
        placeholder: '请输入分类名称',
    }
];
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '添加时间',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '操作',
        dataIndex: 'address',
        key: 'address',
    },
]
</script>