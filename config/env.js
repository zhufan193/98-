/**
 * 配置编译环境和线上环境之间的切换
 * initUrl: 初始地址
 * baseUrl: 初始化后加载域名地址
 * fileBaseUrl: 初始化后加载图片和文件所在域名地址
 * 
 */
const is_compile = false; // 是否为编译环境
const initUrl = is_compile ? 'https://cddtest.oeyeu.com/api/v1/' : 'http://api.98hangyun.com/api/v1/';
const secondUrl='http://test.98hangyun.com/api.aspx';

const mockUrl = 'https://mockapi.eolinker.com/fiB3TLU408a985ee43710f6bae6d355d5db426f2c03076f';
const mockList = ['search'];

export {
    is_compile,
    initUrl,
    mockUrl,
    mockList,
	secondUrl
}