import axios from 'axios';

export const getNewsList = (page) => axios.get(`${process.env.JWZX_NEWS_LIST_URL}?page=${page}`);

export const getNewsContent = (id) => axios.get(`${process.env.JWZX_NEWS_CONTENT_URL}?id=${id}`);
