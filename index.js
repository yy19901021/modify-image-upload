
const Tools = require('./src/utils.js');
const defaultConfigArr = [
  {key: 'el', type: 'string', isReqiued: true},
  {key: 'action', type: 'string',  isReqiued: true},
  {key: 'headers', type: 'object', default: {}},
  {key: 'onError', type: 'Function', default: function () {}},
  {key: 'onSuccess', type: 'Function', default: function () {}},
  {key: 'contentHtml', type: 'string', default: ''},
  {key: 'quality', type: 'number', default: 0.9},
  {key: 'maxSize', type: 'number', default: 4096},
  {key: 'compressover', type: 'number', default: 2048},
  {key: 'addFonts', type: 'string | array'},
  {key: 'fontsAlign', type: 'string', default: 'left'},
  {key: 'lineSpace', type: 'number', default: 0},
  {key: 'fontColor', type: 'string', default: '#4d4d4d'},
  {key: 'fontStyle', type: 'string', default: '14px'},
  {key: 'drawFonts', type: 'Function', default: null},
  {key: 'addImg', type: 'string', default: null},
  {key: 'imageStyle', type: 'object', default: {opacity: 0.6}},
  {key: 'addPos', type: 'array', default: ['left', 'top']},
  {key: 'repeat', type: 'string', default: null},
  {key: 'startUpload', type: 'Function', default: null},
];
/**
 * 
 * @param {*} config 
 * 属性：
 * @required String el: 元素选择器（#id）
 * @required String action：上传路径
 * Object headers： 上传请求头部信息
 * Function onError: 失败时候的回掉）
 * Function onSuccess: 成功时候的回掉）
 * Function startUpload: 开始选择图片之前的回掉，如果返回true 则继续，否则停止图片上传
 * String contentHtml：替换原始按钮（html字符串）
 * Number quality： 图片压缩后的质量 默认0.9
 * Number maxSize：图片上传最大尺寸（kb）默认4096Kb
 * Number compressover: 图片超出尺寸时压缩（2048kb）
 * String | Array addFonts: 需要添加的文字 (1行、多行)
 * String fontsAlign: 多行文字对其方式
 * Number lineSpace: 多行文本间距
 * String fontColor: 需要添加的文字颜色
 * String fontStyle: 添加文字的大小和样式（参照cavans fonts属性的写法）
 * Function drawFonts：支持自定义字体（canvas画布文字渲染函数）（ctx）=>{}
 * String addImg: 需要添加的图片（http链接或者base64)
 * Object imageStyle: 图片宽高尺寸 透明度（默认0.5
 * String repeat: 图片的平铺方式（repeat|repeat-x|repeat-y|no-repeat", 不能addPos一起使用
 * Array addPos：添加文字和图片的相对于上传图片的位置 [x(数字、'left'、'right', 'center'), y(数字、'top'、'bottom', 'middle')] （默认 ['left', 'top']）
 */


let getHtmlTemplate = function (contentHtml) {
  let defaultHtml = '<div style="background: #2973b7;width:100%; padding:5px 10px; height: 20px; color: #fff; line-height: 20px; font-size: 14px; border-radius: 4px; border: 1px solid #ccc;">上传图片</div>';
  return '<div id="UploadBtn" style="cursor: pointer">'+ (!contentHtml ? defaultHtml :  contentHtml) +' <input type="file" name="FileUpload" id="FileUpload" style="display: none;"></div>'
}
let formatConfig = function (config) {
  let isNotOk = defaultConfigArr.some(function (item) {
    let val = config[item.key]
    if (item.isReqiued) {
      if (!Tools.isType.require(val)) {
        console.error(item.key + '是必须传的参数')
        return true
      }
    }
    if (val === undefined) {
      config[item.key] = item.default
      return
    }
    let types = item.type.split(' | ')
    if (!types.some(function(item2) {
      return Tools.isType[item2](val)
    })) console.error(item.key + '是必须' + item.type)
  })
  if (isNotOk) {
    return false
  }
  return config
}

let initUpload = function (config) {
  if (!formatConfig(config)) return
  let uploadEl = document.querySelector(config.el);
  uploadEl.innerHTML = getHtmlTemplate(config.contentHtml)
  let FileUpload = document.querySelector('#FileUpload')
  document.querySelector('#UploadBtn').onclick = function () {
    if (!config.startUpload || config.startUpload()) {
      FileUpload.click()
    }
  }
  let file;
  FileUpload.onchange = function (event) {
    file = event.target.files[0]
    if (!Tools.imageIsOk(file, config)) return 
    Tools.createImage(file, config)
  }
}

export default initUpload
export const init = initUpload