import { request } from '@/utils/request';
import * as ArticeType from '../type/artice';

export function getArticleCategoryList(params) {
  return request({
    url: '/article/category/list',
    method: 'get',
    params: params
  });
}
export function getParentCategory() {
  return request({
    url: '/article/category/parent',
    method: 'get',
  });
}
export function getCategorySelect() {
  return request({
    url: '/article/category/select',
    method: 'get',
  });
}
export function articleCategorySave(body) {
  return request({
    url: '/article/category/save',
    method: 'post',
    data: body,
    showSuccessMsg: true
  });
}
export function articleCategoryDel(body) {
  return request({
    url: '/article/category/del',
    method: 'delete',
    data: body,
    showSuccessMsg: true
  });
}
export function getArticletTagList(params) {
  return request({
    url: '/article/tag/list',
    method: 'get',
    params: params
  });
}
export function getTagSelect() {
  return request({
    url: '/article/tag/select',
    method: 'get',
  });
}
export function articleTagSave(body) {
  return request({
    url: '/article/tag/save',
    method: 'post',
    data: body,
    showSuccessMsg: true
  });
}
export function articleTagDel(body) {
  return request({
    url: '/article/tag/del',
    method: 'delete',
    data: body,
    showSuccessMsg: true
  });
}

export function articleSave(body: ArticeType.ArticleAdd) {
  return request({
    url: '/article/save',
    method: 'post',
    data: body,
    showSuccessMsg: true
  });
}
export function getArticleList(params) {
  return request({
    url: '/article/list',
    method: 'get',
    params: params
  });
}
export function articleDetail(params) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: params
  });
}
export function updalodImage(form) {
  return request({
    url: '/upload/image',
    method: 'post',
    requestType: 'form',
    data: form
  });
}
