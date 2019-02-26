# modify-image-upload

  *上传图片组件（在上传图片时可以对图片进行修改，增加文字、水印、压缩图片质量等）*

## Install
###npm 安装使用
```
   npm install modify-image-upload --save
   import UploadImage from "modify-image-upload" 
   或者
   const UploadImage = reqiure("modify-image-upload")
```
### 直接引用
```
Html
....
<script src="../lib/index.min.js"></script>
....
<body>
<script>
     var config = {}
	 createUpload.init(config)
</script>
</body>
```
## 参数介绍
需要传入一个对象，对象具体内容如下表：

| 参数key |类型 | 描述 |
| :-------: | :------: | :--------------------------- |
|el|String|元素选择器（#id）|
|action|String|上传路径|
|contentHtml|String|替换原始按钮（html字符串）|
|quality|Number|图片压缩后的质量 默认0.9|
|maxSize|Number|图片上传最大尺寸（kb）默认4096Kb|
|compressover|Number|图片超出尺寸时压缩（2048kb）|
|addFonts|String / Array|需要添加的文字 (1行、多行(数组))|
|fontsAlign|String|多行文字对其方式（left、right、center）|
|lineSpace|Number|多行文本间距|
|fontColor|String|需要添加的文字颜色|
|fontStyle|String|添加文字的大小和样式（参照cavans font属性的写法）|
|drawFonts|Function|支持自定义字体（canvas画布文字渲染函数）（ctx）=>{}|
|addImg|String|需要添加的图片（http链接或者base64)|
|imageStyle|Object| 图片宽高尺寸 透明度（默认0.5）属性值（全是number）： width height opacity|
|repeat|String| 图片的平铺方式（repeat、repeat-x、repeat-y、no-repeat", 不能addPos一起使用|
|addPos|Array| 添加文字和图片的相对于上传图片的位置 [x(数字、'left'、'right', 'center'), y(数字、'top'、'bottom', 'middle')] （默认 ['left', 'top']）|
|startUpload|Function|开始选择图片之前的回掉，如果返回true 则继续，否则停止图片上传|
|onError|Function|失败时候的回掉： （type, val）{} 其中参数type：包括‘文件上传接口报错’， ‘上传图片过大’， ‘图片类型错误’|
|onSuccess|Function|成功时候的回掉： （result）{}  参数result是上传接口成功的回掉|