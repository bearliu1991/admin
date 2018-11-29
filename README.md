# yktadmin

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

  deleteuploadfile: "api/deleteuploadfile",
  // 上传图片
  upload: "api/upload",
  // 查看图片
  overview: "api/overview",
  const uploadService = 'api' 添加前缀

// 上传名片
export const uploadPostcard = (params) => api.get('/uploadpostcard', params)
// 下载名片(没有api)
export const downloadPostcard = (params) => {
    let downLoadUrl = "/downloadpostcard" + '?' + params.fileName + "=" + params.filePath
    window.location.href = downLoadUrl
}
// 获得sessionId
export const getSessionId = () => api.get('/getSessionId')

mi.uploadService = new jsonProxy("/webuploader/upload/");
initUrl: this.url + '/webuploader/upload'
