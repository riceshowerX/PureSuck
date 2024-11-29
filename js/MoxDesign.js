// MoxDesign 3.2 - 升级版，使用 jQuery
const defaults = {
    message: "这是一个通知消息",
    duration: 3000,
    position: "bottom",
    backgroundColor: "var(--card2-color)",
    textColor: "var(--text-color)",
    borderColor: "var(--border-color)",
    icon: null,
    title: "通知标题",
    onShow: null, // 显示回调
    onHide: null // 隐藏回调
};

// 通用的通知组件创建函数
function createNotificationElement(options, type) {
    const settings = { ...defaults, ...options }; // 合并默认配置和用户传入的选项

    const $notification = $('<div>', {
        class: `mox-${type}`,
        style: `background-color: ${settings.backgroundColor}; color: ${settings.textColor}; border-color: ${settings.borderColor}; z-index: 2000;`,
        role: 'alert',
        'aria-live': 'polite'
    });

    const $content = $('<div>', { class: `${type}-content` });

    // 如果有图标
    if (settings.icon) {
        const $icon = $('<div>', { class: 'icon' });
        if (settings.icon.startsWith("http")) {
            $icon.append($('<img>', { src: settings.icon, alt: "通知图标" }));
        } else {
            $icon.addClass(settings.icon);
        }
        $content.append($icon);
    }

    const $title = $('<div>', { class: `${type}-title`, text: settings.title });
    const $message = $('<div>', { class: `${type}-message`, text: settings.message });

    $content.append($title, $message);
    $notification.append($content);

    const $closeButton = $('<div>', {
        class: `${type}-close-btn`,
        text: "×",
        click: () => hideNotification($notification, settings.onHide)
    });

    $notification.append($closeButton);

    const fragment = document.createDocumentFragment();
    fragment.appendChild($notification[0]);

    // 如果提供了 onShow 回调，则执行
    settings.onShow && settings.onShow();

    return fragment;
}

// Toast 消息队列
let toastQueue = [];

function MoxToast(options = {}) {
    const settings = { ...defaults, ...options };

    // 将 toast 添加到队列
    toastQueue.push(settings);

    // 如果队列中只有一个 toast，则显示它
    if (toastQueue.length === 1) {
        showToast();
    }
}

function showToast() {
    if (toastQueue.length === 0) return; // 队列为空时，直接返回

    const currentToastSettings = toastQueue[0];
    const toast = createNotificationElement(currentToastSettings, "toast");

    // 确保元素创建成功
    if (!toast) {
        console.error("无法创建通知元素");
        return;
    }

    const $toast = $(toast);
    $('body').append($toast);
    $toast.addClass('show');

    setTimeout(() => {
        hideNotification($toast, () => {
            toastQueue.shift();  // 从队列中移除当前的 toast
            if (toastQueue.length > 0) {
                showToast(); // 递归显示下一个 toast
            }
        });
    }, currentToastSettings.duration);
}

// Notification 消息
function MoxNotification(options = {}) {
    const settings = { ...defaults, ...options };

    let $container = $('.mox-notification-container');
    if ($container.length === 0) {
        $container = $('<div>', { class: 'mox-notification-container' }).appendTo('body');
    }

    const notification = createNotificationElement(settings, "notification");
    $container.append(notification);
    $(notification).addClass('show');

    if (settings.duration > 0) {
        setTimeout(() => hideNotification($(notification), settings.onHide), settings.duration);
    }
}

// 隐藏通知
function hideNotification($notification, onHide) {
    $notification.removeClass('show').addClass('hide');
    $notification.on('animationend', () => {
        $notification.remove();
        onHide && onHide();
    });
}
