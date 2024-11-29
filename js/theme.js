// 更新图标 (全局函数，包含 null 检查)
function updateIcon(theme) {
    const iconElement = document.getElementById('theme-icon');
    if (iconElement) {
        iconElement.className = {
            light: 'icon-sun-inv',
            dark: 'icon-moon-inv',
            auto: 'icon-auto'
        }[theme] || 'icon-auto';
    }
}

// 主题初始化脚本 (立即执行函数)
(function() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme === 'auto' ? systemTheme : savedTheme;
    document.documentElement.setAttribute('data-theme', initialTheme);

    updateIcon(initialTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'auto') {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateIcon(newTheme);
        }
    });

    function setTheme(theme) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const appliedTheme = theme === 'auto' ? systemTheme : theme;
        document.documentElement.setAttribute('data-theme', appliedTheme);
        localStorage.setItem('theme', theme);
        updateIcon(theme);
    }

    window.toggleTheme = function() {
        const currentTheme = localStorage.getItem('theme') || 'auto';
        const nextTheme = currentTheme === 'light' ? 'dark' : (currentTheme === 'dark' ? 'auto' : 'light');
        setTheme(nextTheme);

        const messages = {
            light: "已切换至浅色模式",
            dark: "已切换至深色模式",
            auto: "模式将跟随系统 ㆆᴗㆆ"
        };

        MoxToast({ message: messages[nextTheme] });
    };
})();

// OwO 初始化函数 (全局函数)
function initializeCommentsOwO() {
    const textarea = document.querySelector('.OwO-textarea');
    const container = document.querySelector('.OwO-container');

    if (textarea && container) {
        new OwO({
            logo: '表情',
            container: container,
            target: textarea,
            api: '<?php $this->options->themeUrl("/json/OwO.json"); ?>',
            position: 'down',
            width: '100%',
            maxHeight: '250px'
        });
    }
}

// PJAX 支持
if (document.readyState !== 'loading') {
    initPjax();
} else {
    document.addEventListener('DOMContentLoaded', initPjax);
}

function initPjax() {
    // PJAX 初始化及事件处理
    if (document.querySelector('[data-pjax]')) {
        new Pjax({
            history: true,
            cacheBust: false,
            timeout: 6500,
            elements: 'a[href^="<?php Helper::options()->siteUrl() ?>"]:not([target="_blank"], [no-pjax]), form[action]',
            selectors: ["pjax", "script[data-pjax]", "title", ".main"]
        });

        // 处理 PJAX 错误
        document.addEventListener('pjax:error', (e) => {
            MoxToast({
                message: "页面加载失败，请稍后重试",
                type: 'danger'
            });
            console.error(e);
        });

        // 处理 PJAX 成功加载
        document.addEventListener("pjax:success", () => {
            AOS.refresh();
            initializeCommentsOwO();
            updateIcon(localStorage.getItem('theme') || 'auto');
        });

        // 在初始加载时初始化 OwO
        initializeCommentsOwO();
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 返回 true，表示异步响应
  setTimeout(() => {
    sendResponse({ response: '异步响应完成' });
  }, 1000); // 模拟异步操作（如 setTimeout）
  
  return true;  // 表示异步操作会返回响应
});
