// MoxDesign 2.0 - 升级版，保留原有接口
// 通用的 Toast 消息组件
function MoxToast(options = {}) {
    const defaults = {
        message: "This is a toast message",
        duration: 3000,
        position: "bottom", // top 或 bottom
        backgroundColor: "var(--card2-color)",
        textColor: "var(--text-color)",
        borderColor: "var(--border-color)", // 使用CSS变量或默认值
    };

    const settings = { ...defaults, ...options };

    const toast = document.createElement("div");
    toast.id = "mox-toast";
    toast.textContent = settings.message;
    toast.style.backgroundColor = settings.backgroundColor;
    toast.style.color = settings.textColor;
    toast.style.borderColor = settings.borderColor;
    toast.classList.add(settings.position);

    // 确保页面上不会同时有多个 Toast
    const oldToast = document.getElementById("mox-toast");
    if (oldToast) {
        oldToast.remove();
    }

    document.body.appendChild(toast);

    // 使用 CSS 动画处理显示和隐藏
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 500); // 等待动画完成后移除元素
    }, settings.duration);
}

// 通知组件 (支持图片、图标、标题等)
function MoxNotification(options = {}) {
    const defaults = {
        title: "Notification Title",
        message: "This is a notification message",
        duration: 4500,
        position: "bottom-right",
        backgroundColor: "var(--card2-color)",
        textColor: "var(--text-color)",
        borderColor: "var(--border-color)",
        icon: null,
    };

    const settings = { ...defaults, ...options };

    let container = document.querySelector('.mox-notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'mox-notification-container';
        document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = "mox-notification";
    notification.style.backgroundColor = settings.backgroundColor;
    notification.style.color = settings.textColor;
    notification.style.borderColor = settings.borderColor;

    if (settings.icon) {
        const icon = document.createElement("div");
        icon.className = "icon";
        if (settings.icon.startsWith("http")) {
            const img = document.createElement("img");
            img.src = settings.icon;
            img.alt = "Notification Icon";
            icon.appendChild(img);
        } else {
            icon.classList.add(settings.icon);
        }
        notification.appendChild(icon);
    }

    const content = document.createElement("div");
    content.className = "mox-content";

    const title = document.createElement("div");
    title.className = "mox-title";
    title.textContent = settings.title;
    content.appendChild(title);

    const message = document.createElement("div");
    message.className = "mox-message";
    message.textContent = settings.message;
    content.appendChild(message);

    notification.appendChild(content);

    const closeButton = document.createElement("div");
    closeButton.className = "mox-close-btn";
    closeButton.textContent = "×";
    closeButton.onclick = function () {
        hideNotification(notification);
    };
    notification.appendChild(closeButton);

    container.appendChild(notification);

    // 显示 Notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    if (settings.duration > 0) {
        setTimeout(() => {
            hideNotification(notification);
        }, settings.duration);
    }
}

function hideNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

