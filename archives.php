
<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<?php
/**
 * 归档页面
 *
 * @package custom
 */
$this->need('header.php');
?>

<div class="wrapper">

    <?php $hasImg = !empty($this->fields->img); ?>
    <article class="post <?= $hasImg ? 'post--photo post--cover' : 'post--text'; ?> post--index main-item" 
             data-aos="fade-up" data-aos-anchor-placement="top-bottom">
        <div class="post-inner">
            <header class="post-item post-header <?= $hasImg ? 'no-bg' : ''; ?>">
                <div class="wrapper post-wrapper">
                    <div class="avatar post-author">
                        <img src="<?= $this->options->authorAvatar ?: $this->options->themeUrl('images/avatar.png'); ?>" 
                             alt="作者头像" class="avatar-item avatar-img">
                        <span class="avatar-item"><?php $this->author(); ?></span>
                    </div>
                </div>
            </header>

            <!-- 大图样式 -->
            <?php if ($hasImg): ?>
                <figure class="post-media <?= $this->is('post') ? 'single' : ''; ?>">
                    <img data-aos="zoom-out" itemprop="image" 
                         src="<?php $this->fields->img(); ?>" alt="头图" width="2000" height="800">
                </figure>
            <?php endif; ?>

            <section class="post-item post-body">
                <div class="wrapper post-wrapper">
                    <h1 class="post-title">
                        <a href="<?php $this->permalink() ?>" title="<?php $this->title() ?>">
                            <?php $this->title() ?>
                        </a>
                    </h1>
                    <div class="inner-post-wrapper">

                        <div class="meta post-meta">
                            这里会归档一切文章<br>
                            共创作了 <?= getTotalPostsCount(); ?> 篇文章，合 <?= allOfCharacters(); ?> 字
                        </div>

                        <?php
                        // 获取所有文章并按年份、月份分组
                        $this->widget('Widget_Contents_Post_Recent', 'pageSize=100')->to($posts);
                        $archives = [];

                        while ($posts->next()) {
                            $year = $posts->date->format('Y');
                            $monthDay = $posts->date->format('m-d');
                            $archives[$year][$monthDay][] = clone $posts;
                        }

                        // 输出归档
                        foreach ($archives as $year => $items) {
                            echo "<h2 class='timeline-year'>{$year}</h2>";
                            echo '<div id="timeline">';
                            foreach ($items as $monthDay => $posts) {
                                foreach ($posts as $item) {
                                    echo '<div class="timeline-item">';
                                    echo '<div class="timeline-dot"></div>';
                                    echo '<div class="timeline-content">';
                                    echo "<div class='timeline-date'>{$monthDay}</div>";
                                    echo "<div class='timeline-title'><a href='{$item->permalink}'>{$item->title}</a></div>";
                                    echo '</div>'; // timeline-content
                                    echo '</div>'; // timeline-item
                                }
                            }
                            echo '</div>'; // timeline
                        }
                        ?>
                    </div>
                </div>
            </section>
        </div>
    </article>
</div>

<nav class="nav main-pager" role="navigation" aria-label="Pagination" data-js="pager">
    <div class="nav main-lastinfo">
        <span class="nav-item-alt">
            <?php
            $footerInfo = Typecho_Widget::widget('Widget_Options')->footerInfo ?? '';
            echo $footerInfo;
            ?>
        </span>
    </div>
</nav>

<?php $this->need('sidebar.php'); ?>
<?php $this->need('footer.php'); ?>

