<div class="right-sidebar" id="right-sidebar">

    <!-- 搜索功能 -->
    <?php if ($this->options->showSearch === '1'): ?>
        <div class="search-section">
            <header class="section-header">
                <span class="icon-search" aria-hidden="true"></span>
                <span class="title">搜索</span>
            </header>
            <section class="section-body">
                <form method="get" action="<?php $this->options->siteUrl(); ?>" class="search-container" role="search">
                    <input type="text" name="s" class="search-input" placeholder="输入关键字搜索" aria-label="搜索内容">
                    <button type="submit" class="search-button" aria-label="搜索">
                        <span class="icon-search" aria-hidden="true"></span>
                    </button>
                </form>
            </section>
        </div>
    <?php endif; ?>

    <!-- 分类模块 -->
    <?php if ($this->options->showCategory === '1'): ?>
        <div class="category-section">
            <header class="section-header">
                <span class="icon-emo-wink" aria-hidden="true"></span>
                <span class="title">分类</span>
            </header>
            <section class="section-body">
                <div class="category-cloud">
                    <?php $this->widget('Widget_Metas_Category_List')->to($categories); ?>
                    <?php if ($categories->have()): ?>
                        <ul>
                            <?php while ($categories->next()): ?>
                                <li><a href="<?php $categories->permalink(); ?>" class="category"><?php $categories->name(); ?></a></li>
                            <?php endwhile; ?>
                        </ul>
                    <?php else: ?>
                        <p>没有任何分类</p>
                    <?php endif; ?>
                </div>
            </section>
        </div>
    <?php endif; ?>

    <!-- 标签模块 -->
    <?php if ($this->options->showTag === '1'): ?>
        <div class="tag-section">
            <header class="section-header">
                <span class="icon-hashtag" aria-hidden="true"></span>
                <span class="title">标签</span>
            </header>
            <section class="section-body">
                <div class="tag-cloud">
                    <?php $this->widget('Widget_Metas_Tag_Cloud')->to($tags); ?>
                    <?php if ($tags->have()): ?>
                        <ul>
                            <?php while ($tags->next()): ?>
                                <li><a href="<?php $tags->permalink(); ?>" class="tag"><?php $tags->name(); ?></a></li>
                            <?php endwhile; ?>
                        </ul>
                    <?php else: ?>
                        <p>没有任何标签</p>
                    <?php endif; ?>
                </div>
            </section>
        </div>
    <?php endif; ?>

    <!-- 文章目录（TOC） -->
    <?php if ($this->options->showTOC === '1' && ($this->is('post') || $this->is('page') || $this->is('archives'))): ?>
        <div class="toc-section" id="toc-section" style="display: none;">
            <header class="section-header">
                <span class="icon-article" aria-hidden="true"></span>
                <span class="title">文章目录</span>
            </header>
            <section class="section-body">
                <div class="toc"></div>
            </section>
        </div>
    <?php endif; ?>

</div>


<script>
document.addEventListener("DOMContentLoaded", function () {
    // 判断是否是文章页
    if (!window.location.href.includes('article')) {
        return; // 如果不是文章页，直接退出
    }

    // 延迟生成 TOC，确保页面内容加载完成
    setTimeout(function () {
        const tocSection = document.querySelector("#toc-section");
        const toc = document.querySelector('.toc');
        const headers = document.querySelectorAll('.content h2, .content h3'); // 支持 h2, h3 级别标题

        // 如果 tocSection 不存在，则仅在第一次输出
        if (!tocSection) {
            if (!window.tocSectionLogged) {
                console.log('toc-section 不存在');
                window.tocSectionLogged = true;  // 防止重复输出
            }
            return;  // 直接退出，不继续执行后续操作
        }

        // 如果没有标题，隐藏 TOC
        if (headers.length === 0) {
            tocSection.style.display = 'none';
            return;
        }

        // 动态生成 TOC
        toc.innerHTML = Array.from(headers).map((header, index) => {
            const id = 'toc-item-' + index;
            header.id = id;
            return `<a href="#${id}" class="toc-link">${header.textContent}</a>`;
        }).join('');

        // 显示 TOC
        tocSection.style.display = 'block';
    }, 500); // 延迟 500ms
});

</script>
