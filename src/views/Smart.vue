<template>
    <div class="smart">
      <div class="smart-backgrounp-wrapper" :style="{backgroundImage: 'url(' + currentBackgroundImage + ')'}" v-if="backgroundImageList.length">
      </div>
      <!--<div class="move-box" @mousedown="move" :style="{backgroundImage: 'url(' + currentProductImage + ')'}">-->
      <div class="move-box" >
          <vue-draggable-resizable :w="200" :h="200" v-on:dragging="onDrag" v-on:resizing="onResize" :parent="false" >
          </vue-draggable-resizable>
      </div>
      <div class="bottom-tab">
          <div class="tab-item" @click="goToHome">
              <div class=item-name>产品</div>
              <img src="./../images/lamb.png" alt="">
          </div>
          <div class="tab-item" @click="drawer = true">
              <div class=item-name>背景</div>
              <img src="./../images/lamb.png" alt="">
          </div>

      </div>


        <el-drawer
            title="背景选择"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose">
        <div class="category-wrapper">
            <div class="category-top-wrapper">
                <el-dropdown v-for="(item,index) in smartCateList" :key="index">
                    <el-button type="primary">
                        {{item.classificationName}}<i class="el-icon-arrow-down el-icon--right" ></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(subitem,subindex) in item.children" :key="subindex" @click.native="onClickGetBgImage(item.classificationName,subitem.id)">{{subitem.classificationName}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            </div>
            <div class="category-content-wrapper" v-infinite-scroll="load" style="overflow:auto"  v-if="backgroundImageList.length">

                <div class="content-item" v-for="(item,index) in backgroundImageList" :key="index" @click="clickForSetCurrentBackImg(item.img)">

                    <div class="image-wrapper">
                        <el-image
                            :src="item.img"
                            fit="caover"
                        ></el-image>
                    </div>
                    <h4 class="cate-item-name">{{item.spaceId}}</h4>
                </div>
            </div>
        </div>

        </el-drawer>
    </div>
</template>

<script>
    import {getSmartBgImage} from "./../service/api"
    import {getSmartCateList} from "./../service/api"
    import VueDraggableResizable from 'vue-draggable-resizable'
    import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
    export default {
        name: "Smart",
        components:{VueDraggableResizable },
        data(){
            return{
                width: 0,
                height: 0,
                x: 0,
                y: 0,


                positionX:0,
                positionY:0,

                drawer: false,
                direction: 'rtl',

                backgroundImageList: [],
                currentBackgroundImage: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1849480071,4139468631&fm=26&gp=0.jpg',
                smartCateList:[],
                currentProductImage:''
            }
        },
        mounted(){
            // this.$nextTick(()=>{
            //     console.log(this.$route.params.url);
            //     document.getElementsByClassName('vdr')[0].style.backgroundImage = this.$route.params.url
            // })


            this.currentProductImage = this.$route.params.url;
            // localStorage.setItem('', this.$route.params.url);
            document.getElementsByClassName('vdr')[0].style.backgroundImage  = 'url(' + localStorage.getItem('smartUrl') + ')'
            getSmartBgImage().then( res =>{
                this.backgroundImageList = res.data.records;
                console.log(this.backgroundImageList);
                this.currentBackgroundImage = res.data.records[0].img
            })
            getSmartCateList().then( res =>{
                console.log(res.data);
                this.smartCateList = res.data
            })
        },
        methods:{
            onResize: function (x, y, width, height) {
                this.x = x
                this.y = y
                this.width = width
                this.height = height
            },
            onDrag: function (x, y) {
                this.x = x
                this.y = y
            },
            goToHome(){
                console.log("haha");
                this.$router.push({path:"/home"})
            },
            clickForSetCurrentBackImg(url){
                this.currentBackgroundImage =url
            },
            onClickGetBgImage(classificationName,subItemId){
                if(classificationName === "风格"){
                    console.log("我点击了风格");
                    getSmartBgImage(subItemId).then( res =>{
                       console.log(res)
                       this.backgroundImageList = res.data.records;
                       console.log(this.backgroundImageList);
                    })

                }else if(classificationName === "空间"){
                    console.log("我点击了空间");
                     getSmartBgImage('',subItemId).then( res =>{
                       this.backgroundImageList = res.data.records;
                       console.log(this.backgroundImageList);
                    })
                }
                console.log(classificationName,subItemId)
                console.log("111");
            },
            load () {
             this.count += 2
            },
            move(e){
                let odiv = e.target;        //获取目标元素

                //算出鼠标相对元素的位置
                let disX = e.clientX - odiv.offsetLeft;
                let disY = e.clientY - odiv.offsetTop;
                document.onmousemove = (e)=>{       //鼠标按下并移动的事件
                    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                    let left = e.clientX - disX;
                    let top = e.clientY - disY;

                    //绑定元素位置到positionX和positionY上面
                    this.positionX = top;
                    this.positionY = left;

                    //移动当前元素
                    odiv.style.left = left + 'px';
                    odiv.style.top = top + 'px';
                };
                document.onmouseup = (e) => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            },
            handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
            }

    },
    }
</script>

<style scoped lang="scss">
.smart{
    width: 100%;
    height: 100%;
    // background-color: red;

    .smart-backgrounp-wrapper{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -99;
        background-size: cover;
    }
    .move-box{
        position: relative;     /*定位*/
        top: 10px;
        left: 10px;
        width: 200px;
        height: 200px;
        /*border: 1px solid red;*/
        background: transparent;       /*设置一下背景*/
        /*background: url("https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1942228860,2558899803&fm=74&app=80&f=JPEG&size=f121,140?sec=1880279984&t=abf17d190924b8af96593f499a24d3bc");*/
        background-size:cover;
    }
    .bottom-tab{
        position: absolute;
        bottom: 50px;
        left: 50px;
        display: flex;
        .tab-item{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 30px;
            // font-weight: bolder;
            margin-left: 30px;
            cursor: pointer;
            img{
                width: 50px;
                height: 50px;
            }
        }
    }
    .category-wrapper{
        .category-top-wrapper{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }
        .category-content-wrapper{
            padding: 0px 30px;
            box-sizing: border-box;
            margin-top: 30px;
            width: 100%;
            height: 900px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-around;
            &::after{
                content: '';
                width: 30%;
            }
            .content-item{
                width: 30%;
                height: 200px;
                display: flex;
                flex-direction: column;
                align-items: center;
                .image-wrapper{
                    width: 100%;
                    height: 6vw;
                }
                .cate-item-name{
                    margin-top: 20px;
                    color: white;
                    font-size: 30px;
                }
            }
        }

    }
}
</style>
<style lang="scss">
.el-image{
    width: 100%!important;
    height: 100%!important;
}
.el-drawer{
    background-color: transparent!important;
}
.el-drawer__header{
    color: white!important;
}
.el-button{
        padding: 12px 50px!important;
}
.vdr{
    /*background: url("https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=1942228860,2558899803&fm=74&app=80&f=JPEG&size=f121,140?sec=1880279984&t=abf17d190924b8af96593f499a24d3bc");*/
    background-size: cover;
}
</style>
