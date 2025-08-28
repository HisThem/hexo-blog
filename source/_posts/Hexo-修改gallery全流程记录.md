---
title: Hexo | 修改Gallery全流程记录
date: 2024-12-10 15:33:00
tags: [Hexo]
categories: 
    - 网页设计
    - Hexo网页
home_cover: https://i.postimg.cc/vZQyDSkc/Gallery.jpg
---

为便于自己对本博客的维护和更新，将Gallery页面的大幅改动记录在此，为以后的内容提供参考。

主要改动内容：
- 修改page-template.ejs的内容，为Gallery页面单独去除圆角背景板
- 修改photo-album.ejs的内容，为Gallery页面添加标题、副标题
- 通过css注入，修改页面排版、图片放大效果等细节内容
- 修改字体加载逻辑，优化字体显示速度（详见文章《Hexo | 博客网站字体加载缓慢问题解决方案》）

## 修改page-template.ejs
page-template.ejs位置：
```
node_modules\hexo-theme-keep\layout\_template\page-template.ejs
```
在line 19添加
```
if (current_page_data) { keep_container = '' }
```
使得keep_container为空，进而不渲染圆角背景板。

## 修改photo-album.ejs
photo-album.ejs位置：
```
node_modules\hexo-theme-keep\layout\_template\photo-album.ejs
```
在代码开头前添加
```html
<div class="photo-album-header">
    <h1 class="gallery-title">Gallery</h1>
    <h2 class="gallery-subtitle">Explore the beauty captured in moments.</h2>
</div>
```
从而显示标题和副标题内容。

## 修改css内容
添加一个gallery.css，在hexo的主题yml配置文件中，找到inject栏，填入gallery.css
```yml
inject:
  enable: true
  css:
    -
      - /css/gallery.css
    # - ...
```
在gallery.css文件中添加各种详细内容：
```css

/* 标题部分 */
    /* 父容器样式 */
    .photo-album-header {
        margin-top: 120px; /* 顶部间距 */
        text-align: center; /* 内容居中 */
        margin-bottom: 160px; /* 标题与图片之间的间距 */
    }

    /* 标题样式 */
    .gallery-title {
        font-size: 48px; /* 字体大小 */
        font-weight: 600; /* 字体加粗 */
        font-family: 'NOTO_SERIF'; /* 字体样式 */
        font-style: italic;
        color: #000000; /* 字体颜色 */
        letter-spacing: 2px; /* 字间距 */
        margin: 0; /* 去掉默认的外边距 */
        line-height: 1.2; /* 行高 */
    }

    /* 副标题样式 */
    .gallery-subtitle {
        font-size: 16px; /* 字体大小 */
        font-weight: 400; /* 正常粗细 */
        font-family: 'NOTO_SERIF'; /* 字体，可更换 */
        font-style: italic;
        color: #666; /* 字体颜色（灰色） */
        margin: 6px 0 0; /* 与主标题间距 */
        line-height: 1.5; /* 行高 */
        text-transform: none; /* 保持正常大小写 */
        letter-spacing: 0.5px; /* 字间距 */
    }

/* 图片部分 */
    /* 图片方角 */
    .page-template-container .photo-album-box img.photo {
        border-radius: 0rem;
    }

    /* 图片放大遮罩 */
    .zoom-in-image-mask.show {
        background: rgba(255, 255, 255, 1);
        visibility: visible;
    }

    /* 图片动画 */
    .zoom-in-image-mask .zoom-in-image {
        transition: transform 0.3s cubic-bezier(0.08, 0.93, 0.37, 0.99) !important;
    }
```
<style>
.post-page-container .post-content-container .post-content-top .cover-post-title {
    color: #484853;
    font-size: 2rem;
    line-height: 1.4;
    background: none;
    border-top-right-radius: var(--box-border-radius);
    backdrop-filter: blur(4px);
}
</style>