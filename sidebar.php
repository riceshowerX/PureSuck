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
                    <input type="text" name="s" class="search-input" placeholder="输入关键字搜索" aria-label="输入关键字搜索">
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
                        <?php while ($categories->next()): ?>
                            <a href="<?php $categories->permalink(); ?>" class="category"><?php $categories->name(); ?></a>
                        <?php endwhile; ?>
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
                        <?php while ($tags->next()): ?>
                            <a href="<?php $tags->permalink(); ?>" class="tag"><?php $tags->name(); ?></a>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <p>没有任何标签</p>
                    <?php endif; ?>
                </div>
            </section>
        </div>
    <?php endif; ?>

    <!-- TOC -->
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
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // 初始化TOC
                initializeStickyTOC();

                // 监听页面滚动，动态显示/隐藏TOC
                window.addEventListener('scroll', function() {
                    const tocSection = document.getElementById('toc-section');
                    if (window.scrollY > 100) {
                        tocSection.style.display = 'block'; // 滚动超过100px时显示
                    } else {
                        tocSection.style.display = 'none'; // 滚动回顶部时隐藏
                    }
                });
            });

            function initializeStickyTOC() {
                const toc = document.querySelector('.toc');
                if (!toc) return;

                // 获取所有的文章标题
                const headings = document.querySelectorAll('h2, h3, h4, h5, h6');
                const tocList = document.createElement('ul');

                headings.forEach((heading, index) => {
                    const tocItem = document.createElement('li');
                    const tocLink = document.createElement('a');
                    tocLink.href = `#${heading.id}`;
                    tocLink.textContent = heading.textContent;
                    tocItem.appendChild(tocLink);
                    tocList.appendChild(tocItem);
                });

                toc.appendChild(tocList);
            }
        </script>
    <?php endif; ?>

</div>
