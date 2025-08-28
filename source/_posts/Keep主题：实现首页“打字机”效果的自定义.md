---
title: Keep主题 | 实现首页“打字机”效果的自定义
date: 2024-11-28 11:30:37
mathjax: true
tags: [Hexo, Keep]
categories: 
    - 网页设计
    - Hexo网页
    - Keep主题
home_cover: https://i.postimg.cc/bNvb9Hsd/typing.jpg
---
在基于Hexo框架的[Keep主题](https://github.com/XPoet/hexo-theme-keep)下，暂时无法调整`first-screen`首页正中央的`description`（或`hitokoto`）的打字机效果，然而原本的打字机效果并不理想：字符输出速度慢，输出的速度没有起伏变化，光标距离文字较远。这些问题使得字符输出效果不够真实、自然。

在长时间翻阅Keep主题的源代码后，得到下文中所提供的解决办法。该办法可自定义打字机的如下效果：
1. **光标样式**
2. **输出速度**
3. **是否始终显示光标闪烁**
4. **启用/关闭打字机效果**

<!-- more -->
## 自定义光标样式
在`node_modules\hexo-theme-keep\layout\_partial\first-screen.ejs`路径下，找到如下代码行：
``` js
<% if (fs_hitokoto === true) { %>
    <div class="desc-item border-box"><span class="desc hitokoto"></span><span class="cursor">丨</span></div>
<% } else { %>
    <% for (const idx in final_description) { %>    
        <% if (final_description[idx]) { %>
            <div class="desc-item border-box"><span class="desc"><%= final_description[idx] %></span><span class="cursor">丨</span></div>
        <% } %>
    <% } %>
<% } %>
```
此处实现了光标的显示，`<span class="cursor">丨</span>`中的`丨`便是要显示的光标。
直接将`丨`改为你想要的符号，以实现光标的自定义。

{% note primary %}
注意！这段代码中，共有两处`<span class="cursor">丨</span>`可以修改。第一处是hitokoto的光标，第二处是自定义description的光标。
{% endnote %}


笔者在此处将“丨”改为英文符号“|”，使得光标紧贴上一个字母，呈现`test|`的效果（原本为`test丨`），与真实光标更加相似（缺点是光标比原来粗，观感稍有逊色）。

## 自定义输出速度
### 自定义线性速度
在`node_modules\hexo-theme-keep\source\js\page\home-page.js`路径下，找到`initTypewriter`函数：
``` js
const initTypewriter = () => {
  const isHitokoto = fsc?.hitokoto === true

  if (fsc?.enable !== true) {
    return
  }

  if (fsc?.enable === true && !isHitokoto && !fsc?.description) {
    return
  }


  const descBox = document.querySelector('.first-screen-content .description')
  if (descBox) {
    descBox.style.opacity = '0'

    setTimeout(
      () => {
        descBox.style.opacity = '1'
        const descItemList = descBox.querySelectorAll('.desc-item')
        descItemList.forEach((descItem) => {
          const desc = descItem.querySelector('.desc')
          const cursor = descItem.querySelector('.cursor')
          const text = desc.innerHTML
          desc.innerHTML = ''
          let charIndex = 0

          if (text) {
            const typewriter = () => {
              if (charIndex < text.length) {
                desc.textContent += text.charAt(charIndex)
                  charIndex++
                  setTimeout(typewriter, 100)
              } else {
                cursor.style.display = 'none'
              }
            }
            typewriter()
          }
        })
      },
      isHitokoto ? 400 : 300
    )
  } 
    
}
```
这段代码实现了打字机效果，调整其中
``` js
setTimeout(typewriter, 100)
```
这行代码中的数字大小即可调整输出速度。

### 自定义随机输出速度
为了使输出更像“真人手打”的，我们可以设置*随机的*输出速度，并在每输出一个词后的*空格处*多停顿一段时间。
在`node_modules\hexo-theme-keep\source\js\page\home-page.js`路径下，找到`initTypewriter`函数,进而找到其中的`typewriter`函数：
``` js
const typewriter = () => {
    if (charIndex < text.length) {
      desc.textContent += text.charAt(charIndex)
        charIndex++
        setTimeout(typewriter, 100)
    } else {
      cursor.style.display = 'none'
    }
  }
```
进行如下改动：
``` js
const typewriter = () => {
  if (charIndex < text.length) {
    desc.textContent += text.charAt(charIndex)
    //自定义速度
    if(text.charAt(charIndex) === ' '){
      charIndex++
      const randomNumber = Math.floor(Math.random() * 3);
      if(randomNumber === 0){
        setTimeout(typewriter, 100)
      }else if(randomNumber === 1){
        setTimeout(typewriter, 130)
      }else{
        setTimeout(typewriter, 180)
      }
      
    }else{
      charIndex++
      const randomNumber = Math.floor(Math.random() * 3);
      if(randomNumber === 0){
        setTimeout(typewriter, 20)
      }else if(randomNumber === 1){
        setTimeout(typewriter, 40)
      }else{
        setTimeout(typewriter, 60)
      }
    }
  } else {
    cursor.style.display = 'none'
  }
}
```
使得填入`setTimeout`的数据不断变化，便可更好地模仿“真人手打”的效果。

## 始终显示光标闪烁
默认设置下，打字机在打字结束后会自动隐藏光标。若想在打字结束后仍然保留闪烁的光标，可在`node_modules\hexo-theme-keep\source\js\page\home-page.js`路径下，找到`initTypewriter`函数,进而找到其中的`typewriter`函数：
``` js
const typewriter = () => {
    if (charIndex < text.length) {
      desc.textContent += text.charAt(charIndex)
        charIndex++
        setTimeout(typewriter, 100)
    } else {
      cursor.style.display = 'none'
    }
  }
```
将`else`语句下的一行代码注释掉：
``` js
} else {
    // cursor.style.display = 'none'
}
```
即可实现效果。

## 启用/关闭打字机效果
在主题配置文件`keep.yml`或`_config.keep.yml`中，找到`first_screen`词条，在其下添加`enableTypewriter`词条。`enableTypewriter`的值可以自由配置，`true`为启用打字机，`false`为禁用打字机。
```yml
first_screen:
  enableTypewriter: false # true为启用打字机，false为禁用打字机
```
在`node_modules\hexo-theme-keep\source\js\page\home-page.js`路径下，找到`initTypewriter`函数，添加一个`if-else`判断语句,具体更改内容如下，请对照使用。
```js
const initTypewriter = () => {
    const isHitokoto = fsc?.hitokoto === true

    if (fsc?.enable !== true) {
      return
    }

    if (fsc?.enable === true && !isHitokoto && !fsc?.description) {
      return
    }

    if (fsc?.enableTypewriter === true){
      const descBox = document.querySelector('.first-screen-content .description')
      if (descBox) {
        descBox.style.opacity = '0'

        setTimeout(
          () => {
            descBox.style.opacity = '1'
            const descItemList = descBox.querySelectorAll('.desc-item')
            descItemList.forEach((descItem) => {
              const desc = descItem.querySelector('.desc')
              const cursor = descItem.querySelector('.cursor')
              const text = desc.innerHTML
              desc.innerHTML = ''
              let charIndex = 0

              if (text) {
                const typewriter = () => {
                  if (charIndex < text.length) {
                    desc.textContent += text.charAt(charIndex)
                      charIndex++
                      setTimeout(typewriter, 100)
                  } else {
                    cursor.style.display = 'none'
                  }
                }
                typewriter()
              }
            })
          },
          isHitokoto ? 400 : 300
        )
      }
    }else{
      const descBox = document.querySelector('.first-screen-content .description');
      if (descBox) {
        descBox.style.opacity = '1'; // 保证描述内容可见
        const descItemList = descBox.querySelectorAll('.desc-item');
        descItemList.forEach((descItem) => {
          const desc = descItem.querySelector('.desc');
          const cursor = descItem.querySelector('.cursor')
          const text = desc.innerHTML;
          cursor.style.display = 'none'
          desc.innerHTML = text; // 直接显示完整内容
          
        });
      }
    }
    
  }
```
这段代码添加了一个`if-else`判断，当识别`enableTypewriter`值为`true`时，便会执行原来的打字机代码，当识别为`false`时，便会执行新的代码，这段新代码会使得`description`（或`hitokoto`）的内容被直接显示。
此外，同样可以选择将新代码中的
``` js
cursor.style.display = 'none'
```
一行注释掉，从而在`description`（或`hitokoto`）句末保留闪烁的光标。

## 常见问题
为方便读者确认操作是否有误，笔者将修改后的`initTypewriter`最终代码贴在下方。该代码实现了：
- 随机而自然的输出速度
- 打字结束后保留闪烁光标
```js
const initTypewriter = () => {
  const isHitokoto = fsc?.hitokoto === true

  if (fsc?.enable !== true) {
    return
  }

  if (fsc?.enable === true && !isHitokoto && !fsc?.description) {
    return
  }

  if (fsc?.enableTypewriter === true){
    const descBox = document.querySelector('.first-screen-content .description')
    if (descBox) {
      descBox.style.opacity = '0'

      setTimeout(
        () => {
          descBox.style.opacity = '1'
          const descItemList = descBox.querySelectorAll('.desc-item')
          descItemList.forEach((descItem) => {
            const desc = descItem.querySelector('.desc')
            const cursor = descItem.querySelector('.cursor')
            const text = desc.innerHTML
            desc.innerHTML = ''
            let charIndex = 0

            if (text) {
              const typewriter = () => {
                if (charIndex < text.length) {
                  desc.textContent += text.charAt(charIndex)
                  //自定义速度
                  if(text.charAt(charIndex) === ' '){
                    charIndex++
                    const randomNumber = Math.floor(Math.random() * 3);
                    if(randomNumber === 0){
                      setTimeout(typewriter, 100)
                    }else if(randomNumber === 1){
                      setTimeout(typewriter, 130)
                    }else{
                      setTimeout(typewriter, 180)
                    }

                  }else{
                    charIndex++
                    const randomNumber = Math.floor(Math.random() * 3);
                    if(randomNumber === 0){
                      setTimeout(typewriter, 20)
                    }else if(randomNumber === 1){
                      setTimeout(typewriter, 40)
                    }else{
                      setTimeout(typewriter, 60)
                    }
                  }
                } else {
                  //打字结束后隐藏光标
                  // cursor.style.display = 'none'
                }
              }

              typewriter()
            }
          })
        },
        isHitokoto ? 400 : 300
      )
    }
  }else{
    const descBox = document.querySelector('.first-screen-content .description');
    if (descBox) {
      descBox.style.opacity = '1'; // 保证描述内容可见
      const descItemList = descBox.querySelectorAll('.desc-item');
      descItemList.forEach((descItem) => {
        const desc = descItem.querySelector('.desc');
        const cursor = descItem.querySelector('.cursor')
        const text = desc.innerHTML;
        cursor.style.display = 'none'
        desc.innerHTML = text; // 直接显示完整内容
        
      });
    }
  }
  
}
```