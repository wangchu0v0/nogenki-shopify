# Judge.me 插件后台CSS

## 使用以下CSS（优化版）：

```css
.jdgm-star{color:#A889A8!important}
.jdgm-prev-badge__text[data-judgeme-modified="true"]{font-family:"Libre Baskerville",serif!important;font-size:10px!important;color:#666!important}
```

## 设置位置：
1. 登录Judge.me后台
2. 进入 Settings → Advanced → Custom CSS
3. 复制粘贴上面的CSS代码
4. 保存

## 说明：
- 这个CSS只设置样式，不做内容替换
- 内容替换会由新增的JavaScript文件处理
- `[data-judgeme-modified="true"]` 选择器会匹配被JavaScript修改过的元素
