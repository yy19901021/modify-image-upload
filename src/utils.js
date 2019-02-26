// 绘制字体
function drawFonts (context, config) {
  if (config.drawFonts) {
    config.drawFonts(context);
    return
  }
  let width = config.canvasWidth;
  let height = config.canvasHeight;
  let fontSize = config.fontStyle.match(/([0-9]+)\s*px/) ? config.fontStyle.match(/([0-9]+)\s*px/)[1] : 14;
  context.font = config.fontStyle;
  context.fillStyle = config.fontColor;
  let positions = getDrawPositions(context, config, width, height, fontSize);
  let drawFontsArr = Array.isArray(config.addFonts) ? config.addFonts : [config.addFonts]
  for (let i = 0; i < positions.length; i++) {
    const element = positions[i];
    context.fillText(drawFontsArr[i], element[0], element[1])
  }
}
// 获取文字绘制位置
function getDrawPositions (ctx, config, width, height, fontSize) {
  fontSize = fontSize - 0
  let positions = [];
  let fonts = [];
  if (Array.isArray(config.addFonts)) {
    fonts = config.addFonts.concat([])
  } else {
    fonts.push(config.addFonts)
  }
  let maxFonts = fonts[0]
  for (let i = 1; i < fonts.length; i++) {
    const element = fonts[i];
    if (element.length > maxFonts.length) {
      maxFonts = element;
    }
  }
  let maxFontWidth = ctx.measureText(maxFonts).width;
  let addPos = config.addPos; // 基准位置
  if (isNaN(addPos[0] - 0)) {
    switch (addPos[0]) {
      case 'left':
        addPos[0] = fontSize
        break;
      case 'center':
        addPos[0] = (width - maxFontWidth)/2
        break;
      case 'right':
        addPos[0] = width - maxFontWidth
        break;
      default:
        console.error('config.addPos[0]参数错误')
        break;
    }
  }
  if (isNaN(addPos[1] - 0)) {
    switch (addPos[1]) {
      case 'top':
        addPos[1] = fontSize
        break;
      case 'middle':
        addPos[1] = (height - fontSize * fonts.length)/2
        break;
      case 'bottom':
        addPos[1] = height - fontSize * fonts.length
        break;
      default:
        console.error('config.addPos[1]参数错误')
        break;
    }
  }
  for (let j = 0; j < fonts.length; j++) {
    let pos = []
    const element = fonts[j];
    let prewidth = ctx.measureText(element).width;
    pos[1] = addPos[1] - 0 + j * (fontSize - 0 + config.lineSpace)
    switch (config.fontsAlign) {
      case 'left':
        pos[0] = addPos[0]
        break;
      case 'right':
        pos[0] = addPos[0] - 0 + (maxFontWidth - prewidth)
        break;
      case 'center':
        pos[0] = addPos[0] - 0 + (maxFontWidth - prewidth)/2
        break;
      default:
      console.error('fontsAlign参数不正确')
      pos[0] = addPos[0]
        break;
    }
    positions.push(pos)
  }
  return positions
}
// 创建画布
function createCanvas (config, width, height, uploadImage) {
  let canvasEl = document.createElement('canvas');
  canvasEl.width = width;
  canvasEl.height = height;
  var ctx = canvasEl.getContext('2d');
  config.canvasWidth = width;
  config.canvasHeight = height;
  ctx.beginPath();
  ctx.drawImage(uploadImage, 0, 0, width, height); // 画原始图片
  ctx.closePath();
  ctx.save();
  if (config.addFonts || Array.isArray(config.addFonts)) {
    drawFonts(ctx, config)
    document.body.appendChild(canvasEl)
    uploadImageToServer(canvasEl, config)
  }
  if (config.addImg) {
    drawPicture(ctx, config, function() {
      document.body.appendChild(canvasEl)
      uploadImageToServer(canvasEl, config)
    })
  }
 
  
}
// 图片上传http函数
function httpPost (config, file) {
  let onError = config.onError
  let success = config.onSuccess
  let HttpRequst = new XMLHttpRequest();
  HttpRequst.onreadystatechange = function () {
    if(HttpRequst.readyState === XMLHttpRequest.DONE && HttpRequst.status === 200) {
      success(HttpRequst.responseText)
    }
    if (HttpRequst.status === 404 || HttpRequst.status === 500) {
      onError('文件上传接口报错', HttpRequst.responseText)
    }
  }
  HttpRequst.open('post', config.action, true)
  for (const key in config.headers) {
    HttpRequst.setRequestHeader(key, config.headers[key])
  }
  HttpRequst.send(file)
}

// 上传图片
function uploadImageToServer (canvasEl, config) {
  canvasEl.toBlob(function (res) {
    let file = new File([res], config.fileName, {fileType: config.fileType, filePath: config.filePath})
    let fileData = new FormData()
    fileData.append('file', file)
    httpPost(config ,fileData)
  }, 'image/jpeg', config.quality)
}

// 绘制图片
function drawPicture(ctx, config, callback) {
  let width = config.canvasWidth;
  let height = config.canvasHeight;
  let imageStyle = config.imageStyle
  let inputImage = new Image();
  let httpReg = /^http:\/\/.+\.(jpeg|png|jpg|gif|bmp)$/
  let base64Reg = /^(data:image\/(jpeg|png|jpg|gif|bmp);base64,)\s+[0-9a-zA-Z=+\/]+$/;
  if (config.addImg.trim().search(httpReg) || config.addImg.trim().search(base64Reg)) {
    inputImage.src = config.addImg.trim()
  } else {
    console.error('addImg参数格式不正确')
    return
  }
  inputImage.onload = function () {
    let imageWidth = imageStyle.width ? imageStyle.width : inputImage.width;
    let imageHeight = imageStyle.height ? imageStyle.height : inputImage.height
    let addPos = config.addPos
    if (isNaN(addPos[0] - 0)) {
      switch (addPos[0]) {
        case 'left':
          addPos[0] = 0
          break;
        case 'center':
          addPos[0] = width / 2 - imageWidth/2
          break;
        case 'right':
          addPos[0] = width - imageWidth
          break;
        default:
          console.error('config.addPos[0]参数错误')
          break;
      }
    }
    if (isNaN(addPos[1] - 0)) {
      switch (addPos[1]) {
        case 'top':
          addPos[1] = 0
          break;
        case 'middle':
          addPos[1] = height / 2 - imageHeight/2
          break;
        case 'bottom':
          addPos[1] = height - imageHeight
          break;
        default:
          console.error('config.addPos[1]参数错误')
          break;
      }
    }
    ctx.globalAlpha = imageStyle.opacity ? imageStyle.opacity : 1;
    ctx.beginPath();
    if (config.repeat) {
      let pat = ctx.createPattern(creatTempCanvasPat(inputImage, imageWidth, imageHeight), config.repeat);
      ctx.fillStyle = pat
      ctx.fillRect(0,0, config.canvasWidth, config.canvasHeight)
    } else {
      ctx.drawImage(inputImage, addPos[0], addPos[1], imageWidth, imageHeight);
    }
    ctx.closePath();
    ctx.save();
    callback && callback()
  }
}

// 创建一个临时的Pat， 平铺图像
function creatTempCanvasPat (img, width, height) {
    var canvasTemp = document.createElement('canvas');
    var contextTemp = canvasTemp.getContext('2d');
    canvasTemp.width = width; // 目标宽度
    canvasTemp.height = height; // 目标高
    contextTemp.drawImage(img, 0, 0, width, height);
    return canvasTemp
  }

module.exports = {
  //主函数创建图片的canvas画布绘制文字或图片上传
  createImage (file, config) {
    let uploadImage = new Image();
    config.fileName = file.name;
    config.fileType = file.type;
    config.filePath = file.path;
    if (file.size < config.compressover * 1024) {
      config.quality = 1.0
    }
    uploadImage.src = URL.createObjectURL(file);
    uploadImage.addEventListener('load', function (event) {
      createCanvas(config, uploadImage.width, uploadImage.height, uploadImage)
    })
  },
  imageIsOk (file, config) {
    if (file.size > config.maxSize * 1024) {
      config.onError('上传图片过大')
      return false
    }
    if (!/\.(jpeg|png|jpg|gif|bmp)$/.test(file.name)) {
      config.onError('图片类型错误')
      return false
    }
    return true
  },
  isType: {
    string: function(str) {
      return typeof str === 'string'
    },
    object: function (obj) {
      return obj instanceof Object
    },
    array: function (arr) {
      return Array.isArray(arr)
    },
    require: function(arg) {
      return !!arg || arg === 0
    },
    Function: function (val) {
      return !val || typeof val === 'function'
    },
    number: function(str) {
      return !isNaN(str - 0)
    },
  }
}