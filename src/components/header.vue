<template>
    <div class="home-top">
        <div class="top-logo-wrapper">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578055844093&di=b6ca6a8e8a37c86f5dd4760093db5aee&imgtype=0&src=http%3A%2F%2Fphoto.16pic.com%2F00%2F61%2F24%2F16pic_6124483_b.jpg" alt="">
        </div>
        <div class="top-search-wrapper">
            <div class="top-search">
                <input type="text" v-model="queryFator.searchWord">
                <button @click="getNewProductListBySearch">搜索</button>
            </div>
        </div>
        <div class="top-code-wrapper">
            <img src="https://img.alicdn.com/tfs/TB1vg2XbQL0gK0jSZFxXXXWHVXa-380-160.png" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        name: "header"
    }
</script>

<style scoped lang="scss">

</style>
