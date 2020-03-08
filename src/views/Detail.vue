<template>
    <div class="detail">
        <div class="home-top">
            <div class="top-logo-wrapper">
                <el-image
                        :src="require('../images/logo.png')"
                        fit="contain"></el-image>
            </div>
            <div class="top-search-wrapper">
                <div class="top-search">
                    <input type="text" v-model="queryFator.searchWord">
                    <button @click="getNewProductListBySearch">搜索</button>
                </div>
            </div>
            <div class="top-code-wrapper">
                <el-image
                        :src="require('../images/code.jpg')"
                        fit="contain"></el-image>
            </div>
        </div>
        <div class="detail-content">
            <div class="image-wrapper">
                <div class="big-image-wrapper" v-if="productDetail.productVO">
                    <el-image
                            :src="bigImage"
                            fit="contain"
                            :preview-src-list="productDetail.productVO.productImages"
                    ></el-image>
                    <!--<img :src="" alt="">-->
                </div>
                <ul class="small-image-list" v-if="productDetail.productVO">
                    <li class="small-image-wrapper" v-for="(item,index) in productDetail.productVO.productImages.slice(0,5)" @click="onChangeBigImage(index)">
                        <img :src="item" alt="">
                    </li>
                </ul>
            </div>
            <div class="detail-desc" v-if="productDetail.productVO">
                <h3 class="desc-name">
                    {{productDetail.productVO.description}}
                </h3>
                <div class="desc-price-wrapper">
                    <!--第一版-->
                    <!--<p>市场价：<span class="market-price">￥{{productDetail.productItemVOList[indexOfPrice].marketPrice}}</span></p>-->
                    <!--<p>价格: <span class="retail-price">￥{{productDetail.productItemVOList[indexOfPrice].retailPrice}}</span></p>-->

                    <!--第二版-->
                    <p v-if="indexOfPrice===-1&&productDetail.productVO.retailPrice===productDetail.productVO.maxRetailPrice">会员价：<span class="retail-price">￥{{productDetail.productVO.retailPrice}}</span></p>
                    <p v-if="indexOfPrice===-1&&productDetail.productVO.retailPrice!==productDetail.productVO.maxRetailPrice">会员价：<span class="retail-price">￥{{productDetail.productVO.retailPrice}}-{{productDetail.productVO.maxRetailPrice}}</span></p>
                    <p v-if="indexOfPrice!==-1">会员价：<span class="retail-price">￥{{productDetail.productItemVOList[indexOfPrice].retailPrice}}</span></p>

                </div>
                <div class="desc-spec">
                    <span>规格</span>
                    <ul class="spec-list">
                        <li class="spec-item" v-for="(item,index) in productDetail.productItemVOList" @click="changeMarketPrice(index)">{{item.name}}</li>
                        <!--<li class="spec-item">-->
                            <!--<el-popover-->
                                    <!--v-for="(item,index) in productDetail.productItemVOList"-->
                                    <!--placement="top-start"-->
                                    <!--:title="item.name"-->
                                    <!--width="200"-->
                                    <!--trigger="hover"-->
                                    <!--:content=`市场价${item.marketPrice}`>-->
                                <!--<el-button slot="reference">{{item.name}}</el-button>-->
                            <!--</el-popover>-->
                        <!--</li>-->

                    </ul>
                </div>
                <el-button type="success" round style="margin-top: 30px" @click="goToSmart(productDetail.productVO.lightingMatchImgs[0])">智能配灯</el-button>
            </div>
        </div>
        <footer style="margin-bottom: 20px">
            <el-alert
                    title="商品详情"
                    type="success"
                    >
            </el-alert>
            <div class="detail-image-wrapper" v-if="productDetail.productVO">
                <img v-for="(item,index) in productDetail.productVO.productDetailImages" :src="item" alt="">
            </div>

        </footer>
    </div>
</template>

<script>
    import {getProductDetail} from "./../service/api"
    export default {
        name: "Detail",
        data(){
            return{
                queryFator:{
                    searchWord: ''
                },
                productDetail:{},
                indexOfPrice:-1,//用于改价格
                bigImage:''
            }
        },
        methods:{
            changeMarketPrice(index){
              this.indexOfPrice = index;
            },
            goToSmart(url){
                console.log(url);
                localStorage.setItem('smartUrl', url);
                this.$router.push({
                    name:'smart',
                    params:{
                        url: url
                    }
                })
            },
            onChangeBigImage(index){
              this.bigImage = this.productDetail.productVO.productImages[index];
            },
            getNewProductListBySearch(){
                let that = this;
                this.$router.push({
                    name:'home',
                    params:{
                        searchWord:that.queryFator.searchWord,
                        id:12
                    }
                })
            }
        },
        mounted(){
            // console.log();
            getProductDetail(localStorage.getItem('detailID')).then(res =>{

                this.productDetail = res.data;
                console.log(this.productDetail);

                this.bigImage = this.productDetail.productVO.productImages[0]
            })
        }
    }
</script>

<style scoped lang="scss">
    .detail{
        width: 76%;
        height: 100%;
        /*background-color:red;*/
        margin: 0 auto;
        .home-top{
            display: flex;
            flex-direction: row;
            height: 160px;
            /*background-color: pink;*/
            .top-logo-wrapper{
                height: 100%;
                flex: 0 0 200px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .top-search-wrapper{
                padding: 40px 110px;
                height: 100%;
                box-sizing: border-box;
                flex: 1;
                .top-search{
                    display: flex;
                    flex-direction: row;
                    /*background-color: pink;*/
                    border-radius: 50px;
                    border: 5px solid #fb5f02;
                    input{
                        flex: 1;
                        outline: none;
                        border: none;
                        background-color: transparent;
                        font-size: 28px;
                        padding: 0 30px;
                    }
                    button{
                        width: 100px;
                        border: none;
                        outline: none;
                        background-color: #fb5f02;
                        border-bottom-right-radius: 50px;
                        border-top-right-radius: 50px;
                        font-size: 28px;
                        color: white;
                        cursor: pointer;
                        // &:hover{
                        //   // background-color: rgb(196, 18, 18);
                        // }
                    }
                }
            }
            .top-code-wrapper{
                height: 100%;
                flex: 0 0 180px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .detail-content{
            display: flex;
            .image-wrapper{
                flex: 0 0 400px;
                /*background-color: red;*/
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                .big-image-wrapper{
                    margin: 0 auto;
                    width: 80%;
                    height: 500px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .small-image-list{
                    list-style: none;
                    margin-top: 10px;
                    margin-bottom: 20px;
                    flex: 0 0 70px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    width: 100%;
                    /*overflow-x: auto;*/
                    /*overflow-y: hidden;*/

                    .small-image-wrapper{
                        padding: 0 10px;
                        box-sizing: border-box;
                        flex: 0 0 65px;
                        height: 100%;
                        margin-left: 10px;
                        &:hover{
                            border: 3px solid orangered;
                            box-sizing: border-box;
                            cursor: pointer;
                        }
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
        .detail-desc{
                flex: 1;
                /*background-color: yellow;*/
                .desc-price-wrapper{
                    margin-top: 20px;
                    padding: 15px;
                    box-sizing:border-box;
                    background-color: #fff2e8;
                    p{
                        color: #6c6c6c;
                        margin-bottom: 10px;
                        span{
                            margin-left: 50px;
                        }
                        .market-price{
                            text-decoration: line-through;
                            color: rgb(60, 60, 60);
                            font-weight: bold;
                            font-size: 14px;
                        }
                        .retail-price{
                            color: #F40;
                            font-size: 26px;
                        }
                    }

                }
                .desc-spec{
                    display: flex;
                    margin-top: 20px;
                    padding: 15px;
                    box-sizing:border-box;
                    span{
                        color: #6c6c6c;
                        margin-top: 20px;
                    }
                    .spec-list{
                        list-style: none;
                        margin-left: 50px;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        .spec-item{
                            font-size: 13px;
                            margin-top: 20px;
                            margin-left: 20px;
                            flex-wrap: wrap;
                            padding: 3px 6px;
                            border: 1px solid #DCDCDC;
                            color: #3C3C3C;
                            &:hover{
                                border: 2px solid #f40;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        .detail-image-wrapper{
            margin-top: 20px;
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            vertical-align: top;
        }
    }
</style>
