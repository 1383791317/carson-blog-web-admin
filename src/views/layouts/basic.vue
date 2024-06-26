<style scoped>
.layout-left-menu {
    display: flex;
    justify-content: center;
    height: 64px;
    color: #666666
}

.layout-left-menu-content {
    text-align: center;
    margin: auto;
}

.layout-left-menu-content-icon {
    width: 100%;
    font-size: 20px;
}

.layout-left-menu:hover {
    background-color: #ececec;
    color: #333333;
}

.layout-left-menu-label:hover {
    background-color: #ececec;
    color: #333333;
}

.top-left-menu-lable-selected {
    border-right: 3px solid #1890ff;
}

.menu-items-mouseover {
    position: absolute;
    display: flex;
    left: 80px;
    flex-grow: 1;
    height: 100%;
    padding-top: 64px;
}

.layout-header {
    height: 64px;
    line-height: 64px;
    border-bottom: 1px solid #e8e8e8;
    background-color: #ffffff;
    z-index: 1;
}

.layout-sider {
    height: 100vh;
    background-color: #ffffff;
    border-right: 1px solid #e8e8e8;
}

.layout-sider-two {
    background-color: #ffffff;
    border-right: 1px solid #e8e8e8;
}

.layout-sider-two-hover {
    position: absolute;
    top: 0;
    left: 74px;
    background-color: #ffffff;
    border-right: 1px solid #e8e8e8;
    height: 100%;
    padding-top: 64px;
    border-left: 1px solid #e8e8e8;
    z-index: 1;
}

.layout-footer {
    text-align: center;
}

.top-left-logo {
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center
}
</style>
<template>
    <a-space direction="vertical" :style="{ width: '100%' }" :size="[0, 48]">
        <a-layout>
            <!-- 左侧菜单栏 -->
            <a-layout-sider class="layout-sider" width="75px">
                <div class="top-left-logo">
                </div>
                <div class="layout-left-menu ant-menu-item-selected" v-for="(item, index) in parentMenus"
                    @mouseenter="onMenu(item.children)" @mouseleave="hideMenu">
                    <div class="layout-left-menu-content" :style="item.checked ? { color: '#1677ff' } : ''">
                        <div class="layout-left-menu-content-icon">
                            <svg-icon :name="item.meta.icon" :color="item.checked ? '#1677ff' : ''" />
                        </div>
                        <div style="width: 100%;font-size: 13px;">{{ item.meta.title }}</div>
                    </div>
                </div>
                <a-layout-sider v-show="hoverMenus" class="layout-sider-two-hover" width="140px">
                    <a-menu :items="menuItemsHover" mode="inline" v-model:selected-keys="selectedKeys"
                        v-model:openKeys="openKeys" :style="{ height: '100%', borderRight: 0 }"
                        @click="clickHoverMenuItem" @mouseleave="hideMenuHover">
                    </a-menu>
                </a-layout-sider>
            </a-layout-sider>
            <a-layout>
                <a-layout-header class="layout-header">Header</a-layout-header>
                <a-layout>
                    <a-layout-sider class="layout-sider-two" width="140px">
                        <a-menu :items="menuItems" mode="inline" v-model:selected-keys="selectedKeys" v-model:openKeys="openKeys"
                            :style="{ height: '100%', borderRight: 0 }" @click="clickMenuItem">
                        </a-menu>
                    </a-layout-sider>
                    <a-layout-content>
                        <div style="margin:15px 10px;min-height: 75vh">
                            <RouterView />
                        </div>
                        <a-layout-footer class="layout-footer">Footer</a-layout-footer>
                    </a-layout-content>
                </a-layout>
            </a-layout>
        </a-layout>
    </a-space>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type MenuProps } from 'ant-design-vue';
import router from '@/router/route-nodes'

const routerF = useRouter();
//当前路由
const currentRoute = useRoute();
const selectedKeys = ref<string[]>([currentRoute.name as string]);
const openKeys = ref<string[]>([]);
const hoverMenus = ref(false)
const menuItems = ref([])
const menuItemsHover = ref([])
const parentMenus = ref(router.handlerRoutes)
const findMatchingChildRoute = (currentRouteName, routes) => {
    for (const item of routes) {
        if (item.children) {
            let matchingChild = item.children?.find((n) => n.name === currentRouteName);
            if (matchingChild) {
                return item.children;
            }
            for (const value of item.children) {
                matchingChild = value.children?.find((n) => n.name === currentRouteName);
                if (matchingChild) {
                    openKeys.value = [value.name];
                    return item.children;
                }
            }
        }
    };
    return null;
};
const routeDataToMenusData = (items) => {
    return items.map((item) => {
        return {
            key: item.name,
            label: item.meta.title,
            icon: item.meta.icon,
            path: item.path,
            children: item.children ? routeDataToMenusData(item.children) : null
        }
    })
}
// 跟随页面路由变化，切换菜单选中状态
menuItems.value = routeDataToMenusData(findMatchingChildRoute(currentRoute.name, router.handlerRoutes))
const onMenu = (children) => {
    hoverMenus.value = true;
    menuItemsHover.value = routeDataToMenusData(children)
}
const getMenuItemsPath = (items, key) => {
    let path = ''
    let menu = items.find(item => item.key === key)
    if (menu) {
        path = menu.path
    } else {
        items.forEach(element => {
            if (element.children) {
                path = getMenuItemsPath(element.children, key);
            }
        });
    }
    return path;
}
const clickHoverMenuItem: MenuProps['onClick'] = ({ key }) => {
    if (key === currentRoute.name) return;
    menuItems.value = menuItemsHover.value
    const path = getMenuItemsPath(menuItems.value, key);
    routerF.push(path);
};
// 点击菜单
const clickMenuItem: MenuProps['onClick'] = ({ key }) => {
    if (key === currentRoute.name) return;
    const path = getMenuItemsPath(menuItems.value, key);
    routerF.push(path);
};
const hideMenu = (event: MouseEvent): void => {
    const elementB = document.querySelector('.layout-sider-two-hover');
    const isMouseOverB = elementB && elementB.contains(event.relatedTarget as Node);
    if (!isMouseOverB) {
        hoverMenus.value = false;
        menuItemsHover.value = []
    }
}
const hideMenuHover = () => {
    hoverMenus.value = false;
     menuItemsHover.value = []
}
watch(() => currentRoute.name, () => {
    for (const item of parentMenus.value) {
        let matchingChild = item.children?.find((n) => n.name === currentRoute.name);
        if (matchingChild) {
            item.checked = true;
        } else {
            item.checked = false;
            if (item.children) {
                for (const value of item.children) {
                    matchingChild = value.children?.find((n) => n.name === currentRoute.name);
                    if (matchingChild) {
                        item.checked = true;
                    }
                }
            }
        }
    };
},
    {
        deep: true,
        immediate: true
    })
</script>