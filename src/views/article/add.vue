<template>
    <a-card>
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="标题" v-bind="validateInfos.title">
                <a-input v-model:value="formState.title" placeholder="输入文章标题" />
            </a-form-item>
            <a-form-item label="描述">
                <a-textarea v-model:value="formState.description" placeholder="输入文章描述" :style="{ height: '120px' }" />
            </a-form-item>

            <a-form-item label="分类" v-bind="validateInfos.category_id">
                <a-select v-model:value="formState.category_id" :options="categoryParentItems"
                    placeholder="选择文章分类"></a-select>
            </a-form-item>
            <a-form-item label="标签" v-bind="validateInfos.tags">
                <a-select mode="multiple" v-model:value="formState.tags" :options="tagsParentItems"
                    placeholder="选择文章标签"></a-select>
            </a-form-item>
            <a-form-item label="内容" v-bind="validateInfos.content">
                <div style="border: 1px solid #ccc; margin-top: 10px">
                    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" style="border-bottom: 1px solid #ccc" />
                    <Editor :defaultConfig="editorConfig" v-model="formState.content"
                        style="height: 600px; overflow-y: hidden" @onCreated="handleCreated" />
                </div>
            </a-form-item>
            <a-button type="primary" html-type="submit" @click.prevent="onSubmit(1)"
                style="position: absolute; right: 20px; top: 20px;">
                保存并发布
            </a-button>
            <!-- <a-button html-type="submit" @click.prevent="onSubmit(2)"
                style="position: absolute; right: 128px; top: 20px;color: #4096ff; border-color: #4096ff;">
                仅保存
            </a-button> -->
            <a-button html-type="submit" @click="resetFields" style="position: absolute; right: 128px; top: 20px;">
                重置
            </a-button>
        </a-form>
    </a-card>
</template>
<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, toRaw, onMounted, shallowRef } from 'vue';
import { getCategorySelect, getTagSelect, articleSave, articleDetail, updalodImage } from '@/api/request/article';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { Form } from 'ant-design-vue';
import { useRoute } from 'vue-router'
const route = useRoute()
const editorRef = shallowRef();
const toolbarConfig = {};
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        uploadImage: {
            withCredentials: true,
            timeout: 30 * 1000, // 30 秒
            async customUpload(file: File, insertFn) {
                const form = new FormData()
                form.append('binary', file)
                form.append('scene', 'article')
                updalodImage(form).then(({isSuccess,apiResultData}) => {
                    if(isSuccess){
                        insertFn(apiResultData, null, apiResultData)
                    }
                })
            }
        }
    }
};
// 编辑器回调函数
const handleCreated = (editor) => {
    editorRef.value = editor;
};

const labelCol = { style: { width: '200px' } };
const wrapperCol = { span: 14 };
const rulesRef = reactive({
    title: [{ required: true, message: '文章标题不能为空' }],
    category_id: [{ required: true, message: '文章分类不能为空' }],
    tags: [{ required: true, message: '文章标签不能为空' }],
    content: [{ required: true, message: '文章内容不能为空' }],
});
const formState = reactive({
    id: null,
    title: '',
    description: '',
    category_id: null,
    tags: [],
    content: '',
    type: null
});
const { resetFields, validate, validateInfos } = Form.useForm(formState, rulesRef);
const onSubmit = (type: number) => {
    validate()
        .then(res => {
            formState.type = type
            articleSave(toRaw(formState)).then(({ isSuccess }) => {
                if (isSuccess && type == 1) {
                    resetFields()
                }
            });
        })
        .catch(err => {
            console.log('error', err);
        });
};

// 分类select
const categoryParentItems = ref([])
const initParentItems = async () => {
    getCategorySelect().then(({ apiResultData }) => {
        categoryParentItems.value = apiResultData as []
    });
}
// 标签select
const tagsParentItems = ref([])
const initTagItems = async () => {
    getTagSelect().then(({ apiResultData }) => {
        tagsParentItems.value = apiResultData as []
    });
}
onMounted(async () => {
    await initParentItems()
    await initTagItems()
    let id = route.query.id;
    if (id) {
        articleDetail({ id: id }).then(({ apiResultData }) => {
            formState.id = apiResultData.id
            formState.title = apiResultData.title
            formState.description = apiResultData.description
            formState.category_id = apiResultData.category_id
            apiResultData.tags.forEach(item => {
                formState.tags.push(Number(item))
            });
            formState.content = apiResultData.content
        })
    }
})
</script>