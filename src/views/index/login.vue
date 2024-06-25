<template>
    <div class="login-box">
        <div class="login-logo">
            <h1 class="mb-0 ml-2 text-3xl font-bold">Antdv Admin</h1>
        </div>
        <a-form :model="formState" ref="formRef" :rules="formRules">
            <a-form-item name="account">
                <a-input v-model:value="formState.account" size="large" placeholder="账号">
                    <template #prefix>
                        <UserOutlined class="site-form-item-icon" />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item name="password">
                <a-input-password v-model:value="formState.password" size="large" placeholder="密码">
                    <template #prefix>
                        <LockOutlined class="site-form-item-icon" />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" size="large" :loading="loading" block @click="onSubmit">
                    登录
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useUserStoreWithOut } from '@/store/modules/auth';
import { AuthLogin } from '@/api/type/user';
const formRef = ref();
const loading = ref(false);
const authStore = useUserStoreWithOut();
const route = useRoute();
const router = useRouter();
const formRules = {
    account: [{ required: true, message: '请输入账号' }],
    password: [{ required: true, message: '请输入密码' }],
}
const formState: AuthLogin = reactive({
    account: 'admin',
    password: '123456',
});
const onSubmit = () => {
    formRef.value
        .validate()
        .then(() => {
            loading.value = true;
            authStore.userLogin(formState).catch((res) => {
                loading.value = false;
                if (res) {
                    message.success('登录成功');
                    router.push(route.query.redirect as string || '/')
                }
            })
        })
        .catch(error => {
        });
};

</script>
<style lang="less" scoped>
.login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding-top: 240px;
    background: url('@/assets/svg-icons/login.svg');
    background-size: 100%;

    .login-logo {
        display: flex;
        align-items: center;
        margin-bottom: 30px;

        .svg-icon {
            font-size: 48px;
        }
    }

    :deep(.ant-form) {
        width: 400px;

        .ant-col {
            width: 100%;
        }

        .ant-form-item-label {
            padding-right: 6px;
        }
    }
}
</style>