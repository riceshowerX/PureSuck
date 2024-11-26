// MoxDesign 1.1 优化版

// 公共方法：创建元素并设置属性
function createElement(tag, className, styles = {}, attributes = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    Object.assign(element.style, styles);
    Object.assign(element, attributes);
    return element;
}

// MoxToast
function MoxToast(options = {}) {
    const defaults = {
        message: "This is a toast message",
        duration: 3000,
        position: "bottom", // "top" 或 "bottom"
        backgroundColor: "var(--card2-color)",
        textColor: "var(--text-color)",
        borderColor: "var(--border-color)",
    };

    const settings = { ...defaults, ...options };

    // 清除已有的Toast
    const oldToast = document.getElementById("mox-toast");
    if (oldToast) {
        oldToast.classList.remove("show");
        oldToast.classList.add("hide");
        setTimeout(() => oldToast.remove(), 500); // 等待动画完成后移除
    }

    // 创建新Toast
    const toast = createElement("div", "mox-toast", {
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
        borderColor: settings.borderColor,
        position: "fixed",
        zIndex: 9999,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 20px",
        borderRadius: "5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        bottom: settings.position === "bottom" ? "45px" : "auto",
        top: settings.position === "top" ? "45px" : "auto",
    });

    toast.textContent = settings.message;
    document.body.appendChild(toast);

    // 动画显示
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 500); // 等待动画完成后移除
    }, settings.duration);
}

// MoxNotification
function MoxNotification(options = {}) {
    const defaults = {
        title: "Notification Title",
        message: "This is a notification message",
        duration: 4500,
        position: "bottom-right", // "top-left", "top-right", "bottom-left", "bottom-right"
        backgroundColor: "var(--card2-color)",
        textColor: "var(--text-color)",
        borderColor: "var(--border-color)",
        icon: null,
    };

    const settings = { ...defaults, ...options };

    // 创建容器（如果不存在）
    let container = document.querySelector('.mox-notification-container');
    if (!container) {
        container = createElement('div', 'mox-notification-container', {
            position: 'fixed',
            zIndex: 9999,
            right: settings.position.includes("right") ? "20px" : "auto",
            left: settings.position.includes("left") ? "20px" : "auto",
            bottom: settings.position.includes("bottom") ? "20px" : "auto",
            top: settings.position.includes("top") ? "20px" : "auto",
        });
        document.body.appendChild(container);
    }

    // 创建通知
    const notification = createElement("div", "mox-notification", {
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
        borderColor: settings.borderColor,
        borderRadius: "8px",
        padding: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        opacity: 0,
        transition: "opacity 0.3s ease-in-out",
    });

    // 添加图标
    if (settings.icon) {
        const iconContainer = createElement("div", "icon", { marginRight: "10px" });
        if (settings.icon.startsWith("http")) {
            const img = createElement("img", "", { width: "20px", height: "20px" }, { src: settings.icon });
            iconContainer.appendChild(img);
        } else {
            iconContainer.classList.add(settings.icon); // 使用CSS类
        }
        notification.appendChild(iconContainer);
    }

    // 添加标题和消息
    const content = createElement("div", "mox-content");
    const title = createElement("div", "mox-title");
    title.textContent = settings.title;
    const message = createElement("div", "mox-message");
    message.textContent = settings.message;

    content.appendChild(title);
    content.appendChild(message);
    notification.appendChild(content);

    // 添加关闭按钮
    const closeButton = createElement("div", "mox-close-btn", { cursor: "pointer", marginLeft: "auto" });
    closeButton.textContent = "×";
    closeButton.onclick = () => hideNotification(notification);

    notification.appendChild(closeButton);
    container.appendChild(notification);

    // 显示通知
    setTimeout(() => notification.style.opacity = 1, 10);

    // 自动隐藏
    if (settings.duration > 0) {
        setTimeout(() => hideNotification(notification), settings.duration);
    }
}

// 隐藏通知
function hideNotification(notification) {
    notification.style.opacity = 0;
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

/**
    使用示例：
    MoxToast({
        message: "操作成功！",
        duration: 2000,
        position: "top",
        backgroundColor: "#4caf50",
        textColor: "#fff"
    });

    MoxNotification({
        title: "新消息",
        message: "你有一条新的通知。",
        duration: 5000,
        position: "top-right",
        icon: "https://example.com/icon.png"
    });
**/
