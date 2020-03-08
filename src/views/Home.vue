<template>
  <div class="home">
    <div class="home-top">
      <div class="top-logo-wrapper">
        <!--<img src="./../images/logo.png" alt="">-->
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
        <!--<img src="" alt="">-->
      </div>
    </div>
    <div class="home-category">
      <div class="category-title">
        <span class="first-box">所有分类 ></span>
        <span class="select-box" v-for="(item,index) in queryFator.cateArr" v-show="item.id" @click="onCancelSubCate(item.id)">{{item.chinese}}:{{item.children}} <span class="select-cancel">x</span></span>
      </div>
      <div class="category-content">
        <div class="content-wrapper" v-for="(item,index) in cateList">
          <div class="content-title">{{item.classificationName}}:</div>
          <div class="content-list">
            <div class="content-subtitle" v-for="(subitem,subindex) in item.children[0].children" @click="onClickSubCate(subitem.id,index,subitem.classificationName)">{{subitem.classificationName}}</div>
          </div>
        </div>
      </div>

    </div>
    <div class="content-footer">
      <el-select v-model="sortValue" placeholder="排序">
          <el-option
            v-for="item in sortArray"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      <el-select v-model="selectValue" placeholder="筛选">
          <el-option
            v-for="item in selectArray"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      <el-select v-model="priceValue" placeholder="价格">
          <el-option
            v-for="item in priceArray"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      <p class="price-wrapper"><input type="text" placeholder="￥" v-model="queryFator.minRetailPrice">-<input type="text" placeholder="￥" v-model="queryFator.maxRetailPrice"> <button @click="getNewProductList">确定</button></p>
    </div>
    <div class="product-list">
      <div class="product-item" v-for="(item,index) in productList" @click="goToDetail(item.id)">
      <!--<div class="product-item" v-for="(item,index) in productList">-->
        <div class="image-wrapper">
          <el-image
            :src="item.productImages[0]"
            fit="cover"></el-image>
        </div>
        <!--第一版-->
        <!--<p class="item-price">-->
          <!--<span class="retail-price" >￥{{item.retailPrice}}</span>-->
          <!--<span class="market-price">￥{{item.marketPrice}}</span>-->
        <!--</p>-->

        <!--第二版-->
        <p class="item-price">
          <span class="retail-price" v-if="item.retailPrice!==item.maxRetailPrice">￥{{item.retailPrice}}-{{item.maxRetailPrice}}</span>
          <span class="retail-price" v-else>￥{{item.retailPrice}}</span>
          <!--<span class="market-price">￥{{item.marketPrice}}</span>-->
        </p>

        <div class="item-desc">
          {{item.description}}
        </div>
      </div>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
              background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-size="12"
        layout="total, prev, pager, next"
        :total="productTotal">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getCategory } from '../service/api'
import { getProductList } from '../service/api'
export default {
  name: 'home',
  components: {
    // HelloWorld
  },
  data(){
      return{
        queryFator:{
          pageNum:1, // 页码
          size:24, // 页容量
          sortMode:0, // 排序
          selectMode:0, // 筛选
          maxRetailPrice:'', // 最高价
          minRetailPrice:'', // 最低价
          searchWord:'', //搜索
          typeId:'', // 类型
          cateArr:[ //id 是子节点的id，children是子节点的名字
            {name:'brandId',id:'',chinese:'品牌',children:''},
            {name:'colorId',id:'',chinese:'颜色/工艺分类',children:''},
            {name:'material',id:'',chinese:'材质',children:''},
            {name:'spaceId',id:'',chinese:'空间',children:''},
            {name:'style',id:'',chinese:'风格',children:''},
            {name:'typeId',id:'',chinese:'类型',children:''},
          ]
        },
        currentPage1: 1,
        productTotal:0,
        cateList:[],
        productList:[],

        // 排序
        sortArray: [{
          value: '0',
          label: '默认'
        }, {
          value: '1',
          label: '浏览量从多到少'
        }],
        sortValue: '',

        // 筛选
        selectArray: [{
          value: '0',
          label: '默认'
        }, {
          value: '1',
          label: '推荐'
        }, {
          value: '2',
          label: '新品'
        }],
        selectValue: '' ,

         // 价格
        priceArray: [{
          value: '2',
          label: '价格从低到高'
        }, {
          value: '3',
          label: '价格从高到低'
        }],
        priceValue: ''
      }
  },
  methods:{
      goToDetail(id){
          localStorage.setItem('detailID', id);
        this.$router.push({
            name:'detail',
            params:{
                id:id
            }
        })
      },
      onCancelSubCate(id){
        console.log(id);
        this.queryFator.cateArr.forEach(item => {
          if(item.id === id){
            item.id = ''
          }
        })
        console.log(this.queryFator.cateArr);
        this.getNewProductList();
      },
      onClickSubCate(id,index,classificationName){
        console.log(id,index,classificationName);
        this.queryFator.cateArr[index].id = id;
        this.queryFator.cateArr[index].children = classificationName;
        this.getNewProductList();

      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      // 根据页码获取数据
      handleCurrentChange(val) {
        this.queryFator.pageNum = val;
        getProductList(this.queryFator.pageNum,this.queryFator.size,this.queryFator.sortMode,this.queryFator.selectMode,this.queryFator.maxRetailPrice,this.queryFator.minRetailPrice,this.queryFator.searchWord,this.queryFator.cateArr[5].id,this.queryFator.cateArr[0].id,this.queryFator.cateArr[4].id,this.queryFator.cateArr[3].id,this.queryFator.cateArr[2].id,this.queryFator.cateArr[1].id).then( res => {
          this.productList = res.data.records;
          this.productTotal = res.data.total;
        })
        console.log(`当前页: ${val}`);
      },
      getNewProductListBySearch(){
        this.queryFator.pageNum = 1;
        this.queryFator.sortMode = 0;
        this.queryFator.selectMode = 0;
        this.queryFator.maxRetailPrice = ''
        this.queryFator.minRetailPrice = ''
        this.queryFator.cateArr[5].id = '';
        this.queryFator.cateArr[0].id = '';
        this.queryFator.cateArr[4].id = '';
        this.queryFator.cateArr[3].id = '';
        this.queryFator.cateArr[2].id = '';
        this.queryFator.cateArr[1].id = '';

        getProductList(this.queryFator.pageNum,this.queryFator.size,this.queryFator.sortMode,this.queryFator.selectMode,this.queryFator.maxRetailPrice,this.queryFator.minRetailPrice,this.queryFator.searchWord,this.queryFator.cateArr[5].id,this.queryFator.cateArr[0].id,this.queryFator.cateArr[4].id,this.queryFator.cateArr[3].id,this.queryFator.cateArr[2].id,this.queryFator.cateArr[1].id).then( res => {
          this.productList = res.data.records;
          this.productTotal = res.data.total;
        })
      },
      getNewProductList(){
        getProductList(this.queryFator.pageNum,this.queryFator.size,this.queryFator.sortMode,this.queryFator.selectMode,this.queryFator.maxRetailPrice,this.queryFator.minRetailPrice,this.queryFator.searchWord,this.queryFator.cateArr[5].id,this.queryFator.cateArr[0].id,this.queryFator.cateArr[4].id,this.queryFator.cateArr[3].id,this.queryFator.cateArr[2].id,this.queryFator.cateArr[1].id).then( res => {
          this.productList = res.data.records;
          this.productTotal = res.data.total;
        })
      }
  },
  watch:{
    sortValue(v){
      console.log(v);
      this.queryFator.sortMode = v;
      this.queryFator.pageNum = 1;
      this.getNewProductList();
      // getProductList(this.queryFator.pageNum,this.queryFator.size,this.queryFator.sortMode,this.queryFator.selectMode,this.queryFator.maxRetailPrice,this.queryFator.minRetailPrice,this.queryFator.searchWord).then( res => {
      //     this.productList = res.data.records;
      //     this.productTotal = res.data.total;
      //   })
      console.log( this.productList);
    },
    selectValue(v){
      console.log(v);
      this.queryFator.selectMode = v;
      this.getNewProductList();
      // this.queryFator.pageNum = 1;
      //     getProductList(this.queryFator.pageNum,this.queryFator.size,this.queryFator.sortMode,this.queryFator.selectMode,this.queryFator.maxRetailPrice,this.queryFator.minRetailPrice,this.queryFator.searchWord).then( res => {
      //     this.productList = res.data.records;
      //     this.productTotal = res.data.total;
      //   })
      console.log( this.productList);
    },
    priceValue(v){
      console.log(v);
      this.queryFator.sortMode = v;
      this.queryFator.pageNum = 1;
      this.getNewProductList();
      // getProductList(this.queryFator.pageNum,this.queryFator.size,this.queryFator.sortMode,this.queryFator.selectMode,this.queryFator.maxRetailPrice,this.queryFator.minRetailPrice,this.queryFator.searchWord).then( res => {
      //     this.productList = res.data.records;
      //     this.productTotal = res.data.total;
      //   })
      console.log( this.productList);
    }
  },
  mounted () {
      // 一开始就获取分类数据
    getCategory().then ( res =>{
        this.cateList = res.data;
        console.log(this.cateList);
    })

      if (this.$route.params.searchWord){
          this.queryFator.searchWord = this.$route.params.searchWord
          this.getNewProductListBySearch()
      } else{
          // 一开始就获取第一页的商品列表
          getProductList().then( res =>{
              console.log(res);
              this.productList = res.data.records;
              this.productTotal = res.data.total;
              console.log(this.productList);
          })
      }

  }
}
</script>

<style scoped lang="scss">
  .home{
    width: 76%;
    /*background-color: blue;*/
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
          }
        }
      }
      .top-code-wrapper{
        height: 100%;
        flex: 0 0 200px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .home-category{
      .category-title{
        margin-bottom: 20px;
        .select-box{
          margin-left: 5px;
          border: 1px solid #e8e8e8;
          color: #666;
          font-size: 13px;
          padding: 5px 10px;
          cursor: pointer;
          box-sizing: border-box; //select-cancel
          .select-cancel{
            text-align: center;
            font-size: 16px;

          }
          &:hover{
            border: 1px solid orangered;
            .select-cancel{
              color: orangered;
              font-weight: bold;
            }
          }
        }
      }
      font-size: 13px;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #dedede;
      .category-content{
        .content-wrapper{
          padding: 10px 0;
          display: flex;
          flex-direction: row;
          border-bottom: 1px dashed #dedede;
          &:last-child{
            border-bottom:none;
          }
          .content-title{
            padding-left: 20px;
            box-sizing: border-box;
            width: 120px;
            color: #999;
          }
          .content-list{
            flex: 1;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .content-subtitle{
              margin-top: 5px;
              margin-left: 20px;
              color:#000;
              font-weight: 400;
              &:hover{
                color: orangered;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .content-footer{
      background-color: #f5f5f5;
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: left;
      align-items: center;
      .price-wrapper{
        margin-top: 8px;
        margin-bottom: 8px;
        margin-left: 5px;
        display: flex;
        padding: 10px 20px;
        box-sizing: border-box;
        input{
          width: 55px;
          height: 22px;
        }
        button{
          margin-left: 5px;
          padding: 0 10px;
          display: none;
          // &:hover{
          //   background-color: red;
          // }
        }
      }
      .price-wrapper:hover{
        background: white;
        border: 1px solid #ccc;
        button{
          margin-left: 5px;
          display: inline;
          background-color: #f40;
          outline: none;
          border: none;
          color: white;
          &:hover{
            background-color:#e40;
            cursor: pointer;
          }
        }
      }
    }
    .product-list{
      border: 1px solid white;
      box-sizing: border-box;
      margin-top: 20px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      &::after{
        content: '';
        width: 30%;
      }
      .product-item{
        margin-left: 20px;
        padding-bottom: 10px;
        border: 1px solid white;
        box-sizing: border-box;
        margin-top: 20px;
        width: 20%;
        height: 20%;
        .image-wrapper{
          width: 100%;
          height: 16vw;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .item-price{
          font-size: 20px;
          color: #f40;
          font-weight: bold;
          margin-top: 5px;
          margin-left: 5px;
          .market-price{
            text-decoration: line-through;
            color: #999;
            font-size: 14px;
            margin-left: 20px;
          }
        }
        .item-desc{
          // padding-bottom: 20px;
          padding: 0px 0 0px 5px;
          margin-top: 20px;
          box-sizing: border-box;
          color: #3d3d3d;
          font-size: 13px;
         overflow: hidden ;
          display: -webkit-box ;
          -webkit-line-clamp: 2 ;
          -webkit-box-orient: vertical ;
          word-break: break-all ;
        }
        &:hover{
          border: 1px solid #f40;
          box-sizing: border-box;
        }
      }
    }
    .pagination-wrapper{
      width: 100%;
      /*margin-left: 50%;*/
      /*<!--transform: translateX(-10%)-->*/
      /*margin: 0 auto;*/
      align-items: center;
    }
  }
  .el-select{
    width: 200px;
    margin-left: 20px;
  }
  .el-image{
    width: 100%;
    height: 100%;
  }
.el-pagination{
  align-items: center!important;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

</style>
<style lang="scss">
   .el-pagination{
      align-items: center;
   }
   .el-pagination .number{
      font-size: 20px!important;
    }
    .el-pagination .el-icon{
      font-size: 20px!important;
    }
</style>
