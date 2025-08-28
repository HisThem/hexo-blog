const path = require('path');

hexo.extend.filter.register('after_render:html', function (data) {
    // 获取当前时间戳
    const timestamp = new Date().getTime();

    // 为 CSS 和 JS 添加时间戳
    data = data.replace(/(href=".*?\.css)"/g, `$1?${timestamp}"`);
    data = data.replace(/(src=".*?\.js)"/g, `$1?${timestamp}"`);

    return data;
});