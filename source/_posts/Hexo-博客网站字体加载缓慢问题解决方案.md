---
title: Hexo | 博客网站字体加载缓慢问题解决方案
date: 2024-12-10 00:44:58
tags: [Hexo]
categories: 
    - 网页设计
    - Hexo网页
home_cover: https://i.postimg.cc/k4Y9H9ZD/fontstyle.jpg
---
在本博客Gallery图库界面开发过程中，我发现使用了自定义字体的“Gallery”字样加载非常缓慢，往往在点开Gallery页面十余秒后，我所设定的字体才加载出来。

这种问题可能是字体文件过大导致。

在查阅各种资料后，我发现了三种简单易用的方法，使用后可大幅增加加载速度。字体可在40~50ms内加载完毕。
- （暂仅适用于ttf文件）使用font-spider插件，或者直接使用[网页版font-spider](https://www.mainww.com/)（更推荐使用网页版，插件版下载过程中可能出现各种错误）将字体文件缩小
- 在启动博客主页面时，提前加载子页面中使用的字体文件。
- 调用字体文件API代替字体文件

## Font-spider网页版（针对ttf格式字体文件）
字体文件一般都集成了各种语言的字符，如汉字、拉丁字母（英语、法语等所用字符），但也有更多我们可能根本不会使用的字符，如印度文字、日文字符、西里尔字母等。这些冗杂的字符极大地增加了字体文件的大小，拖慢了加载速度。

因此，我们可以通过Font-spider网页版等工具，将原字体文件中的汉字、拉丁字母等我们常用的字符集单独提取，构建一个更加简洁的新字体文件。相比于原字体文件千余KB的大小，新字体文件甚至可能仅有几十KB，对静态网页的字体加载极为有利。

点击链接[网页版font-spider](https://www.mainww.com/)跳转，

在“压缩后包含的文字”一栏填写需要用到的文字，可以点选右侧的“常用3600字简体中文”填入中文字符，也可以直接键入。
![font-spider](https://i.postimg.cc/sXkYJLhr/font-spider.png)
这里我键入的是英文字符及常用英文符号集:
```
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
1234567890-~!@#$%^&*()_+-=`[]{}|\/<>,.:;"'
```
此后，将字体的ttf文件拖入下方的虚线框中，点击“上传并压缩”，即可得到如下压缩结果：
![result](https://i.postimg.cc/7hSgtN3T/fontspiderresult.png)
点击ttf对应的下载按钮即可得到压缩后的ttf字体文件。

## 预加载字体文件
在网页主页面的ejs文件下（本hexo主题的文件地址为`node_modules\hexo-theme-keep\layout\_page\home.ejs`,其他主题也可能位于themes文件夹下的相类似位置。）
在该文件末尾加入以下代码：
```html
<script>
    window.onload = function() {
        /* 第一个字体文件 */
        const preloadFont1 = document.createElement('link');
        preloadFont1.rel = 'preload';
        preloadFont1.href = '<%- url_for("/font/NotoSerif-Italic-VariableFont_wdth,wght.ttf") %>'; //请将url_for(" ")内部修改为你的字体存放地址
        preloadFont1.as = 'font';
        preloadFont1.type = 'font/ttf';
        preloadFont1.crossOrigin = 'anonymous';
        document.head.appendChild(preloadFont1);

        /* 第二个字体文件 */
        const preloadFont2 = document.createElement('link');
        preloadFont2.rel = 'preload';
        preloadFont2.href = '<%- url_for("/font/NotoSerif-VariableFont_wdth,wght.ttf") %>'; //请将url_for(" ")内部修改为你的字体存放地址
        preloadFont2.as = 'font';
        preloadFont2.type = 'font/ttf';
        preloadFont2.crossOrigin = 'anonymous';
        document.head.appendChild(preloadFont2);

        //如需要更多字体文件可类比上述内容自行添加
    };
</script>
```
这段JS代码的目的是在网站主页面生成完毕后，为生成的html文件加入几行link标签，该link标签的内容为
```html
<link rel="preload" href="<%- url_for("/font/NotoSerif-Italic-VariableFont_wdth,wght.ttf") %>" as="font" type="font/ttf" crossorigin="anonymous">
<link rel="preload" href="<%- url_for("/font/NotoSerif-VariableFont_wdth,wght.ttf") %>" as="font" type="font/ttf" crossorigin="anonymous">
```
这会告诉浏览器在主页面加载后，预先加载这些字体文件，从而减少加载过程中可能出现的字体延迟。

## 调用字体文件API代替字体文件
阅读[Google Fonts API](https://developers.google.com/fonts/docs/getting_started?hl=zh-cn)可详细了解此方法的实行方式。

我们可以在css文件中直接调用Google Fonts API来使用Google Fonts字库中的各种字体。而为了增加调用的效率，Google Fonts API功能支持精确调用，例如，`https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&display=swap`仅调用了字重为300或400的Noto Serif SC字体，其余字重不会被调用。

使用时，仅需按照[Google Fonts API](https://developers.google.com/fonts/docs/getting_started?hl=zh-cn)链接中内容编写合适的API地址，在需要的界面编写如下代码：
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400&display=swap');
```
其中`url('  ')`内的部分填入API，该字体便可正常使用。

下面是一个具体使用示例：
```html
<style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400&display=swap');

    .keep-markdown-body p, .keep-markdown-body > .post p {
        font-family: 'Noto Serif SC', serif; /* 可以在此处直接使用，和字体文件的用法相同 */
        font-size: 18px;
        letter-spacing: 0.05rem;
    }
</style>
```
实测在引入示例中的字库时，网页字体加载时间不超过50ms.

## 补充
如后续有更好的方法，将会在此补充。