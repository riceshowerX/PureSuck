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

    <!-- 引入外部 CSS 文件 -->
    <link rel="stylesheet" href="<?= $this->options->themeUrl('/css/PureSuck_Style.css'); ?>">
    <link rel="stylesheet" href="<?= $this->options->themeUrl('/css/a11y-dark.min.css'); ?>">
    <link rel="stylesheet" href="<?= $this->options->themeUrl('/css/PureSuck_Module.css'); ?>">
    <link rel="stylesheet" href="<?= $this->options->themeUrl('/css/MoxDesign.css'); ?>">
    <link rel="stylesheet" href="<?= $this->options->themeUrl('/css/theme.css'); ?>"> <!-- 新增引用的外部 CSS 文件 -->

    <!-- 引入外部 JS 文件 -->
    <script defer src="<?= $this->options->themeUrl('/js/theme.js'); ?>"></script>

    <!-- AOS 样式和脚本 -->
    <link rel="stylesheet" href="<?= $this->options->themeUrl('/css/aos.css'); ?>">
    <script defer src="<?= $this->options->themeUrl('/js/aos.js'); ?>"></script>

    <!-- 引入其他必要脚本 -->
    <script defer src="<?= $this->options->themeUrl('/js/medium-zoom.min.js'); ?>"></script>
    <script defer src="<?= $this->options->themeUrl('/js/highlight.min.js'); ?>"></script>
    <script defer src="<?= $this->options->themeUrl('/js/PureSuck_Module.js'); ?>"></script>
    <script defer src="<?= $this->options->themeUrl('/js/OwO.min.js'); ?>"></script>
    <script defer src="<?= $this->options->themeUrl('/js/MoxDesign.js'); ?>"></script>

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
                        <span id="theme-icon" class="icon-auto"></span>
                    </button>
                </div>
            </div>
        </header>
        <main class="main">
