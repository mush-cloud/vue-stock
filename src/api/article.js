import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/stockbasis/stockList',
    method: 'post',
    data: query
  })
}

export function createStock(data) {
  return request({
    url: '/vue-element-admin/stockbasis/stockAdd',
    method: 'post',
    data
  })
}

export function updateStock(data) {
  return request({
    url: '/vue-element-admin/stockbasis/stockUpdate',
    method: 'post',
    data
  })
}

export function formula(stockName) {
  return request({
    url: '/vue-element-admin/stockbasis/formula',
    method: 'post',
    params: { stockName }
  })
}

export function estimate(stockName, spj, minPrice) {
  return request({
    url: '/vue-element-admin/stockbasis/estimate',
    method: 'post',
    params: { stockName, spj, minPrice }
  })
}

export function updateStockDp() {
  return request({
    url: '/vue-element-admin/stockbasis/stockDp',
    method: 'post',
  })
}

export function linkTrackApi() {
  return request({
    url: '/vue-element-admin/stockbasis/stockBtch',
    method: 'post',
  })
}

export function listQuantify(data) {
  return request({
    url: '/vue-element-admin/stockquantify/quantifyList',
    method: 'post',
    data
  })
}
export function recommendQuantify() {
  return request({
    url: '/vue-element-admin/stockquantify/quantifyRecommend',
    method: 'post',
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
