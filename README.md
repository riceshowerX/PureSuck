
# PureSuck-Theme

> 原作者仓库：[MoXiaoXi233/PureSuck-theme](https://github.com/MoXiaoXi233/PureSuck-theme)  
> 魔改版：[云野](https://miksz.cc)

![Banner](https://s2.loli.net/2024/08/05/M4FTuyI2b7aU3Ag.png)
![Release Badge](https://img.shields.io/github/v/release/MoXiaoXi233/PureSuck-theme)
![License Badge](https://img.shields.io/badge/LICENSE-MIT-green)
![Author Badge](https://img.shields.io/badge/AUTHOR-MoXiify-pink)

PureSuck 是一个**干净、简约、优雅**的 Typecho 主题。  
这是我第一次认真做一个项目，如果遇到问题或有建议，欢迎反馈。主题的样式和功能还在不断迭代中，可能会随着版本更新而发生变化。感谢你的使用！

## 外观展示

你可以前往 [希记](https://note.moxiify.cn) 查看最新版的演示效果。

主题提供四种可选的强调色，并内置了几种多彩的小组件，欢迎通过 Issues 提交建议！

![PureSuck](https://s2.loli.net/2024/09/12/D8pVAM5QkwJzdjO.png)

## 任务清单

- [x] Pjax
- [ ] 重新设计组件
- [ ] 精简代码，优化性能
- [ ] 统一设计语言

## 特性

- **代码高亮**  
- 精美的动效设计  
- **简约干净的界面**  
- 灵活的自定义空间  
- **良好的阅读体验**  
- TOC 目录树  
- 头图支持  
- **流畅的体验**  
- 内置多个小组件  
- ~~作者人比较好，愿意陪你瞎扯~~

更多功能和细节，欢迎体验主题！

## 安装与设置

1. 从 [Releases][3] 下载最新的 zip 压缩包，解压后将文件夹放入 Typecho 主题目录。
2. 请确保主题文件夹命名为 `PureSuck`，否则可能会出现样式或功能缺失。
3. 主题设置可以在 `Typecho 后台 > 控制台 > 外观 > 设置外观` 中找到，里面有详细的设置说明。

**注**：若使用 CommentNotifier 回调函数，使用 `parseOwOcodes`。

### 推荐设置

- 启用 Typecho 评论区的 Markdown 功能。
- 允许以下 HTML 标签和属性：
    ```html
    <blockquote><pre><code><strong><em><h5><h6><a href title><table><thead><tr><th><tbody><td>
    <ol><ul><li>
    ```
  根据需求修改这些标签（例如，启用 `<blockquote>` 以支持引用，启用 `<pre><code>` 以支持代码块等）。
- 推荐使用字体「霞骛文楷」。
- 如遇问题，欢迎联系作者。

## 功能与组件

### 归档页面

在后台创建一个页面，并选择归档页面类型。

### 组件短代码

#### 警告框

```html
[alert type="red"]这是一个红色警告。[/alert]
[alert type="yellow"]这是一个黄色警告。[/alert]
[alert type="blue"]这是一个蓝色警告。[/alert]
[alert type="green"]这是一个绿色警告。[/alert]
[alert type="pink"]这是一个粉色警告。[/alert]
```
支持五种颜色的警告框。若想使用灰色警告框，可以使用内置的 `blockquote` 标签。

#### 彩色信息窗

```html
[window type="red" title="信息窗口"]这是一个信息窗口。[/window]
[window type="yellow" title="警告窗口"]这是一个警告窗口。<br>第二行内容。</window>
```
支持五种颜色，指定 `type` 和 `title`，使用 `<br>` 实现换行。

#### 友链卡片

```html
[friend-card name="好友" ico="avatar.jpg" url="http://example.com"]这是好友的描述。[/friend-card]
```
不支持选择颜色，样式跟随主题强调色。描述中可使用 `<br>` 换行。

#### 可折叠面板

```html
[collapsible-panel title="面板标题"]这是面板内容。[/collapsible-panel]
```
折叠较长的内容，默认使用灰色样式。

#### 标签页

```html
[tabs]
[tab title="博客信息"]这是博客信息内容。[tab]
[tab title="交流群"]这是交流群内容。[tab]
[tab title="申请友链"]其他内容。[tab]
[tab title="关于我们"]关于我们的内容。[tab]
[/tabs]
```

#### 时间线

```html
[timeline]
[timeline-event date="2023-01-01" title="事件 1"]事件 1 的描述。[/timeline-event]
[timeline-event date="2023-02-01" title="事件 2"]事件 2 的描述。[/timeline-event]
[/timeline]
```

#### 哔哩哔哩视频卡片

```html
[bilibili-card bvid="BV1KJ411C7SB"]
```
嵌入一个哔哩哔哩视频卡片，只需提供 `bvid` 视频 ID。

### 开发中的功能组件

#### 瀑布流图片

```html
[PicGrid]
![图片.jpg][1]
[/PicGrid]
```
使用 `[PicGrid]` 标签包裹图片，展示瀑布流布局，适合多张图片的展示。

#### MoxDesign 通知

确保在 `DOMContentLoaded` 后调用：

```javascript
MoxNotification({
    title: "持久通知",
    message: "此通知不会自动关闭。",
    duration: 0,  // 设置为 0 表示需要手动关闭
});
```

#### MoxDesign Toast

```javascript
MoxToast({
    message: "这是一个 Toast 消息",
    duration: 3000,
    position: "bottom",  // 可选 "top" 或 "bottom"
    backgroundColor: "var(--card2-color)",
    textColor: "var(--text-color)",
    borderColor: "var(--border-color)",
});
```

## 引用库

- [aos](https://github.com/michalsnik/aos)
- [medium-zoom](https://github.com/francoischalifour/medium-zoom)
- [OWO.JS](https://github.com/DIYgod/OwO)
- [HighLight.JS](https://github.com/highlightjs/highlight.js)
- [Pjax](https://github.com/MoOx/pjax)
- [Pace](https://github.com/CodeByZach/pace)

## License

本主题使用 **MIT** 协议开源，欢迎更多人参与或进行二次开发！  
感谢每一个使用本主题的朋友！
