<!--header.php-->
<!DOCTYPE HTML>
<html lang="zh-CN">

<head>
    <meta charset="<?= $this->options->charset(); ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php $this->header(); ?>

    <title>
        <?php $this->archiveTitle([
            'category' => _t('分类 %s 下的文章'),
            'search' => _t('包含关键字 %s 的文章'),
            'tag' => _t('标签 %s 下的文章'),
            'author' => _t('%s 发布的文章')
        ], '', ' - '); ?>
        <?= $this->options->title(); ?>
    </title>

    <!-- 动态生成 CSS -->
    <?php generateDynamicCSS(); ?>

    <!-- 主题初始化脚本 -->
    <script>
        (function() {
            const savedTheme = localStorage.getItem('theme') || 'auto';
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const initialTheme = savedTheme === 'auto' ? systemTheme : savedTheme;
            document.documentElement.setAttribute('data-theme', initialTheme);
        })();
    </script>

    <!-- 切换主题功能 -->
    <script>
        function setTheme(theme) {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const appliedTheme = theme === 'auto' ? systemTheme : theme;

            document.documentElement.setAttribute('data-theme', appliedTheme);
            localStorage.setItem('theme', theme);

            updateIcon(theme);
        }

        function toggleTheme() {
            const currentTheme = localStorage.getItem('theme') || 'auto';
            const nextTheme = currentTheme === 'light' ? 'dark' : (currentTheme === 'dark' ? 'auto' : 'light');

            setTheme(nextTheme);

            const messages = {
                light: "已切换至浅色模式",
                dark: "已切换至深色模式",
                auto: "模式将跟随系统 ㆆᴗㆆ"
            };

            MoxToast({ message: messages[nextTheme] });
        }

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

        document.addEventListener('DOMContentLoaded', () => {
            setTheme(localStorage.getItem('theme') || 'auto');
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('theme') === 'auto') {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                updateIcon('auto');
            }
        });
    </script>

    <!-- 样式和脚本引入 -->
    <link rel="stylesheet" href="<?= $this->options->themeUrl('css/PureSuck_Style.css'); ?>">
    <link rel="stylesheet" href="<?php $this->options->themeUrl('/css/a11y-dark.min.css'); ?>">
    <link rel="stylesheet" href="<?php $this->options->themeUrl('/css/PureSuck_Module.css'); ?>">
    <link rel="stylesheet" href="<?php $this->options->themeUrl('/css/aos.css'); ?>">
    <link rel="stylesheet" href="<?php $this->options->themeUrl('/css/MoxDesign.css'); ?>">

    <script defer src="<?php $this->options->themeUrl('/js/medium-zoom.min.js'); ?>"></script>
    <script defer src="<?php $this->options->themeUrl('/js/highlight.min.js'); ?>"></script>
    <script defer src="<?php $this->options->themeUrl('/js/PureSuck_Module.js'); ?>"></script>
    <script defer src="<?php $this->options->themeUrl('/js/OwO.min.js'); ?>"></script>
    <script defer src="<?php $this->options->themeUrl('/js/MoxDesign.js'); ?>"></script>

    <!-- 引入 AOS -->
    <link rel="stylesheet" href="<?php $this->options->themeUrl('/css/aos.css'); ?>">
    <script defer src="<?php $this->options->themeUrl('/js/aos.js'); ?>"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            AOS.init({ duration: 800, offset: 120 });
        });

        document.addEventListener("pjax:success", function() {
            AOS.init({ duration: 800, offset: 120 });
        });
    </script>

    <!-- Pjax 支持 -->
    <?php if ($this->options->enablepjax == '1'): ?>
        <script defer src="<?php $this->options->themeUrl('/js/pjax.min.js'); ?>"></script>
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                new Pjax({
                    history: true,
                    cacheBust: false,
                    timeout: 6500,
                    elements: 'a[href^="<?php Helper::options()->siteUrl() ?>"]:not([target="_blank"], [no-pjax]), form[action]',
                    selectors: ["pjax", "script[data-pjax]", "title", ".main", ".right-sidebar"]
                });

                document.addEventListener('pjax:error', (e) => {
                    console.error(e);
                    window.location.href = e.triggerElement.href;
                });

                document.addEventListener("pjax:success", () => {
                    runShortcodes();
                    initializeStickyTOC();  // 确保在 PJAX 刷新后调用
                    AOS.refresh();
                });
            });

            // 初始化 TOC
            function initializeStickyTOC() {
                const toc = document.querySelector('.toc');
                if (toc) {
                    toc.classList.add('sticky');
                }
            }

            // 初始化评论框的 OwO 表情
            function initializeCommentsOwO() {
                const observer = new MutationObserver((mutations, observer) => {
                    const container = document.querySelector('.OwO-container');
                    const textarea = document.querySelector('.OwO-textarea');

                    if (container && textarea) {
                        new OwO({
                            logo: '表情',
                            container: container,
                            target: textarea,
                            api: '<?php $this->options->themeUrl('/json/OwO.json'); ?>',
                            position: 'down',
                            width: '100%',
                            maxHeight: '250px'
                        });

                        console.log('OwO 初始化成功');
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            }

            document.addEventListener('DOMContentLoaded', initializeCommentsOwO);
            document.addEventListener('pjax:success', initializeCommentsOwO);
        </script>
    <?php endif; ?>

    <!-- 标题线条样式 -->
    <?php if ($this->options->postTitleAfter != 'off'): ?>
        <style>
            .post-title::after {
                bottom: <?php echo $this->options->postTitleAfter == 'wavyLine' ? '-5px' : '5px'; ?>;
                left: 0;
                <?php if ($this->options->postTitleAfter == 'boldLine'): ?>
                    width: 58px;
                    height: 13px;
                <?php elseif ($this->options->postTitleAfter == 'wavyLine'): ?>
                    width: 80px;
                    height: 12px;
                    mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="10" viewBox="0 0 40 10" preserveAspectRatio="none"><path d="M0 5 Q 10 0, 20 5 T 40 5" stroke="black" stroke-width="2" fill="transparent"/></svg>') repeat-x;
                    mask-size: 40px 12px;
                <?php elseif ($this->options->postTitleAfter == 'handDrawn'): ?>
                    width: 130px;
                    height: 6px;
                    background: #2a2a2a;
                    border-radius: 6px;
                    transform: rotate(10deg);
                <?php endif; ?>
            }
        </style>
    <?php endif; ?>
</head>

<body>
    <div class="wrapper">
        <header class="header" data-js="header">
            <div class="wrapper header-wrapper header-title">
                <span class="el-avatar el-avatar--circle">
                    <img src="<?= $this->options->logoIndex; ?>" alt="博主头像" width="120" height="120" style="object-fit:cover;">
                </span>
                <div class="header-title"><?= $this->options->titleIndex(); ?></div>
                <p class="header-item header-about"><?= $this->options->customDescription ?: 'ワクワク'; ?></p>
                <div class="nav header-item header-credit">
                    Powered by Typecho
                    <br>
                    <a href="https://github.com/MoXiaoXi233/PureSuck-theme">Theme PureSuck</a>
                </div>
                <nav class="nav header-item header-nav">
                    <span class="nav-item<?= $this->is('index') ? ' nav-item-current' : ''; ?>">
                        <a href="<?= $this->options->siteUrl(); ?>" title="首页">首页</a>
                    </span>
                    <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
                    <?php while ($pages->next()): ?>
                        <span class="nav-item<?= $this->is('page', $pages->slug) ? ' nav-item-current' : ''; ?>">
                            <a href="<?= $pages->permalink(); ?>" title="<?= $pages->title(); ?>">
                                <?= $pages->title(); ?>
                            </a>
                        </span>
                    <?php endwhile; ?>
                </nav>
                <div class="theme-toggle-container">
                    <button class="theme-toggle" onclick="toggleTheme()" aria-label="日夜切换">
                        <span id="theme-icon"></span>
                    </button>
                </div>
            </div>
        </header>
        <main class="main">
