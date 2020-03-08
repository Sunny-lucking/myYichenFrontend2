import ajax from './ajax'
// 1. 定义基础路径
const BASE_URL = 'https://yichen.zhagen.ren'
// 2. 获取商品分类
export const getCategory = () => ajax(BASE_URL + '/dengtao/api/classification/list')

// 3. 获取商品列表
export const getProductList = (pageNum=1,size=24,sortMode=0,selectMode=0,maxRetailPrice='',minRetailPrice='',searchWord='',typeId='',brandId='',style='',spaceId='',material='',colorId='') => ajax(BASE_URL + '/dengtao/api/product/list',{
    pageNum,
    size,
    sortMode,
    selectMode,
    maxRetailPrice,
    minRetailPrice,
    searchWord,
    typeId,
    brandId,
    style,
    spaceId,
    material,
    colorId
})

// 4.获取智能配灯背景图
export const getSmartBgImage = (style='',space='') => ajax(BASE_URL + '/dengtao/api/intelligentCollocation/listBackgroundImages',{
    style,
    space
})

// 5.获取智能配灯分类CateList
export const getSmartCateList = () => ajax(BASE_URL + '/dengtao/api/intelligentCollocation/listBackgroundImageClassifications')

// 5.获取智能配灯分类CateList
export const getProductDetail = (id) => ajax(BASE_URL + '/dengtao/api/product/getProduct/'+ id);
