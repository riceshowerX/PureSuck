// MoxDesign 3.0 - 升级版，保留原有接口
// 通用的通知组件（Toast / Notification）创建函数
function createNotificationElement(options, type) {
    // 默认配置
    const defaults = {
        message: "这是一个通知消息", // 默认消息
        duration: 3000, // 显示时间
        position: "bottom", // 位置（top 或 bottom）
        backgroundColor: "var(--card2-color)", // 背景颜色
        textColor: "var(--text-color)", // 文本颜色
        borderColor: "var(--border-color)", // 边框颜色
        icon: null, // 图标（可以是URL或者字体图标）
        title: "通知标题", // 标题
    };

    // 合并用户传入的配置与默认配置
    const settings = { ...defaults, ...options };

    // 创建一个文档片段，避免多次操作DOM
    const fragment = document.createDocumentFragment();

    // 创建通知元素
    const notification = document.createElement("div");
    notification.className = `mox-${type}`; // 添加类型的class，便于样式管理
    notification.style.backgroundColor = settings.backgroundColor;
    notification.style.color = settings.textColor;
    notification.style.borderColor = settings.borderColor;

    // 创建内容容器
    const content = document.createElement("div");
    content.className = `${type}-content`;

    // 如果有图标，创建图标元素
    if (settings.icon) {
        const icon = document.createElement("div");
        icon.className = "icon";
        if (settings.icon.startsWith("http")) {
            const img = document.createElement("img");
            img.src = settings.icon;
            img.alt = "通知图标";
            icon.appendChild(img);
        } else {
            icon.classList.add(settings.icon); // 如果是字体图标，添加类名
        }
        content.appendChild(icon);
    }

    // 创建标题
    const title = document.createElement("div");
    title.className = `${type}-title`;
    title.textContent = settings.title;
    content.appendChild(title);

    // 创建消息内容
    const message = document.createElement("div");
    message.className = `${type}-message`;
    message.textContent = settings.message;
    content.appendChild(message);

    // 将内容添加到通知元素中
    notification.appendChild(content);

    // 创建关闭按钮
    const closeButton = document.createElement("div");
    closeButton.className = `${type}-close-btn`;
    closeButton.textContent = "×";
    closeButton.onclick = function () {
        hideNotification(notification); // 点击关闭按钮时，隐藏通知
    };
    notification.appendChild(closeButton);

    // 将通知添加到文档片段中
    fragment.appendChild(notification);
    return fragment;
}

// 显示 Toast 消息
function MoxToast(options = {}) {
    const settings = { ...defaults, ...options };

    // 创建 Toast 元素
    const toast = createNotificationElement(settings, "toast");
    document.body.appendChild(toast); // 将通知添加到页面

    // 使用 CSS 动画显示和隐藏
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        // 等待动画结束后移除元素
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, settings.duration);
}

// 显示 Notification 消息
function MoxNotification(options = {}) {
    const settings = { ...defaults, ...options };

    // 查找或创建通知容器
    let container = document.querySelector('.mox-notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'mox-notification-container';
        document.body.appendChild(container);
    }

    // 创建 Notification 元素
    const notification = createNotificationElement(settings, "notification");
    container.appendChild(notification); // 将通知添加到容器中

    // 使用 CSS 动画显示 Notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // 如果设置了持续时间，自动隐藏通知
    if (settings.duration > 0) {
        setTimeout(() => {
            hideNotification(notification);
        }, settings.duration);
    }
}

// 隐藏通知并移除 DOM 元素
function hideNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300); // 等待动画结束后移除通知
}
