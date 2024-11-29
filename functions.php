<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;

/**
 * 为主题设置文章头图和摘要字段
 *
 * @param Typecho_Widget_Helper_Form $layout
 */
function themeFields($layout)
{
    // 创建文章头图输入框
    $img = createTextField('img', _t('文章头图'), _t('输入文章头图的 URL 地址，为空则不显示'));
    $layout->addItem($img);

    // 创建文章摘要输入框
    $desc = createTextField('desc', _t('文章摘要'), _t('文章摘要信息，会显示在首页文章卡片内，为空则默认显示文章开头一段文字'));
    $layout->addItem($desc);
}


/**
 * 创建文本字段的帮助方法
 *
 * @param string $name 字段名称
 * @param string $label 字段标签
 * @param string $description 字段描述
 * @return Typecho_Widget_Helper_Form_Element_Text
 */
function createTextField($name, $label, $description)
{
    // 创建一个文本输入字段
    $field = new Typecho_Widget_Helper_Form_Element_Text($name, NULL, NULL, $label, $description);
    // 设置样式
    $field->input->setAttribute('class', 'text w-100');
    return $field;
}




function themeInit($archive)
{
    Helper::options()->commentsAntiSpam = false;
}

function parseOwOcodes($content)
{
    // 读取 JSON 文件
    $jsonFile = __DIR__ . '/js/OwO.json';
    if (!file_exists($jsonFile)) {
        return htmlspecialchars($content, ENT_QUOTES, 'UTF-8');
    }

    $jsonContent = file_get_contents($jsonFile);
    $shortcodes = json_decode($jsonContent, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return htmlspecialchars($content, ENT_QUOTES, 'UTF-8');
    }

    // 遍历 JSON 文件中的所有表情包类型
    foreach ($shortcodes as $key => $package) {
        if (isset($package['type']) && $package['type'] === 'image' && isset($package['container'])) {
            foreach ($package['container'] as $data) {
                $shortcode = htmlspecialchars($data['input'], ENT_QUOTES, 'UTF-8');
                $imgUrl = Typecho_Common::url(htmlspecialchars($data['icon'], ENT_QUOTES, 'UTF-8'), Helper::options()->siteUrl);
                $imgTag = sprintf(
                    '<img src="%s" width="%s" loading="lazy" alt="%s">',
                    $imgUrl,
                    htmlspecialchars($package['width'], ENT_QUOTES, 'UTF-8'),
                    htmlspecialchars($data['text'], ENT_QUOTES, 'UTF-8')
                );
                $content = str_replace($shortcode, $imgTag, $content);
            }
        }
    }

    return $content;
}


// 封装的数据库操作函数
function getOptionValue($name) {
    $db = Typecho_Db::get();
    return $db->fetchRow($db->select()->from('table.options')->where('name = ?', $name))['value'] ?? null;
}

function updateOptionValue($name, $value) {
    $db = Typecho_Db::get();
    $update = $db->update('table.options')->rows(['value' => $value])->where('name = ?', $name);
    return $db->query($update);
}

function insertOptionValue($name, $value) {
    $db = Typecho_Db::get();
    $insert = $db->insert('table.options')->rows(['name' => $name, 'user' => '0', 'value' => $value]);
    return $db->query($insert);
}

function deleteOptionValue($name) {
    $db = Typecho_Db::get();
    $delete = $db->delete('table.options')->where('name = ?', $name);
    return $db->query($delete);
}

// 通用的通知和自动刷新功能
function showNotification($message, $redirectUrl) {
    echo "<div class=\"tongzhi home\">{$message}，请等待自动刷新！如果等不到请点击 <a href=\"{$redirectUrl}\">这里</a></div>";
    echo '<script language="JavaScript">
            window.setTimeout(function() {
                location = "' . $redirectUrl . '";
            }, 2500);
          </script>';
}

// 主题配置
function themeConfig($form) {
    // 获取主题名称
    $themeName = basename(strtok(Helper::options()->themeUrl, '/'));
    $currentSettings = getOptionValue("theme:{$themeName}");
    
    // 处理表单提交
    if (isset($_POST['type'])) {
        $redirectUrl = Helper::options()->adminUrl('options-theme.php');
        
        if ($_POST["type"] === "备份模板设置数据") {
            if (getOptionValue("theme:{$themeName}bf")) {
                updateOptionValue("theme:{$themeName}bf", $currentSettings);
                showNotification("备份已更新", $redirectUrl);
            } else {
                insertOptionValue("theme:{$themeName}bf", $currentSettings);
                showNotification("备份完成", $redirectUrl);
            }
        }

        if ($_POST["type"] === "还原模板设置数据") {
            $backup = getOptionValue("theme:{$themeName}bf");
            if ($backup) {
                updateOptionValue("theme:{$themeName}", $backup);
                showNotification("恢复完成", $redirectUrl);
            } else {
                echo '<div class="tongzhi home">没有模板备份数据，恢复不了哦！</div>';
            }
        }

        if ($_POST["type"] === "删除备份数据") {
            if (getOptionValue("theme:{$themeName}bf")) {
                deleteOptionValue("theme:{$themeName}bf");
                showNotification("删除成功", $redirectUrl);
            } else {
                echo '<div class="tongzhi home">不用删了！备份不存在！！！</div>';
            }
        }
    }

    // 显示主题基本信息
    echo '<h3>当前主题版本：<span style="color: #b45864;">1.2.5</span></h3>';
    echo '<h4>主题开源页面及文档：<span style="color: #b45864;">
            <a href="https://github.com/MoXiaoXi233/PureSuck-theme" style="color: #3273dc; text-decoration: none;">PureSuck-theme</a>
          </span></h4>';
    echo '<h5>*备份功能只在 SQL 环境下测试正常，遇到问题请清空配置重新填写*</h5>';
    
    // 表单操作
    echo '
    <form class="protected home" action="?' . $themeName . 'bf" method="post">
        <input type="submit" name="type" class="btn btn-s" value="备份模板设置数据" />
        <input type="submit" name="type" class="btn btn-s" value="还原模板设置数据" />
        <input type="submit" name="type" class="btn btn-s" value="删除备份数据" />
    </form>';

    // 配置项（可以通过 $form->addInput 来添加配置项）
    $form->addInput(new \Typecho\Widget\Helper\Form\Element\Text('logoUrl', null, null, _t('favicon.ico 地址'), _t('填写ico格式图片 URL 地址')));

    $form->addInput(new \Typecho\Widget\Helper\Form\Element\Text('titleIndex', null, null, _t('网站标题'), _t('网站左侧标题文字')));

    $form->addInput(new \Typecho\Widget\Helper\Form\Element\Text('logoIndex', null, null, _t('左侧 LOGO 地址'), _t('填写 JPG/PNG/Webp 等图片 URL 地址')));

    $form->addInput(new \Typecho\Widget\Helper\Form\Element\Text('authorAvatar', null, null, _t('作者头像地址'), _t('填写 JPG/PNG/Webp 等图片 URL 地址')));

    $form->addInput(new \Typecho\Widget\Helper\Form\Element\Textarea('customDescription', null, null, _t('左侧个人描述'), _t('填写自定义描述内容')));

    $form->addInput(new \Typecho\Widget\Helper\Form\Element\Textarea('leftSideCustomCode', null, null, _t('左侧自定义区域'), _t('支持自定义HTML')));

    $form->addInput(new \Typecho\Widget\Helper\Form\Element\Textarea('footerScript', null, null, _t('Footer Script 标签'), _t('在这里填入JavaScript代码')));

    $form->addInput(new \Typecho\Widget\Helper\Form\Element\Textarea('footerInfo', null, null, _t('网页底部信息'), _t('填写网页底部的自定义信息')));

    // Pjax 配置
    $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio('enablepjax', ['1' => _t('启用'), '0' => _t('关闭')], '1', _t('是否启用 Pjax 加载')));

    $form->addInput(new \Typecho\Widget\Helper\Form\Element\Textarea('PjaxScript', null, null, _t('Pjax回调函数'), _t('在这里填入需要被 Pjax 回调的函数')));

    // 主题样式细调
    $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio('postTitleAfter', [
        'off' => _t('关'),
        'boldLine' => _t('粗线条'),
        'wavyLine' => _t('波浪线条'),
    ], 'off', _t('主标题下的装饰线条样式')));

    // 搜索功能显示选项
    $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio('showSearch', ['1' => _t('显示'), '0' => _t('隐藏')], '1', _t('是否显示搜索功能')));

    // TOC 模块显示选项
    $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio('showTOC', ['1' => _t('显示'), '0' => _t('隐藏')], '1', _t('是否显示 TOC 目录树')));

    // 分类模块显示选项
    $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio('showCategory', ['1' => _t('显示'), '0' => _t('隐藏')], '1', _t('是否显示分类模块')));

    // 标签模块显示选项
    $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio('showTag', ['1' => _t('显示'), '0' => _t('隐藏')], '1', _t('是否显示标签模块')));

    // 文章页显示版权信息选项
    $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio('showCopyright', ['1' => _t('显示'), '0' => _t('隐藏')], '1', _t('是否在文章页尾显示版权信息')));

    // 代码高亮设置
    $form->addInput(new Typecho_Widget_Helper_Form_Element_Checkbox('codeBlockSettings', [
        'ShowLineNumbers' => _t('显示代码行号'),
        'ShowCopyBtn' => _t('显示复制按钮'),
    ], [], _t('代码块个性化设置')));

    // 配色方案选择
    $form->addInput(new Typecho_Widget_Helper_Form_Element_Radio('colorScheme', [
        'pink' => _t('素粉'),
        'green' => _t('淡绿'),
        'blue' => _t('墨蓝'),
        'yellow' => _t('落黄'),
    ], 'pink', _t('配色方案')));
}



// 主题配色
function getColorScheme()
{
    $colorScheme = Typecho_Widget::widget('Widget_Options')->colorScheme;
    return $colorScheme;
}


function generateDynamicCSS()
{
    // 获取颜色方案
    $colorScheme = getColorScheme();

    // 定义颜色映射数组
    $colorMap = [
        'pink' => ['theme' => '#ea868f', 'hover' => '#DB2777'],
        'green' => ['theme' => '#48c774', 'hover' => '#15803d'],
        'blue' => ['theme' => '#3273dc', 'hover' => '#3B82F6'],
        'yellow' => ['theme' => '#feb272', 'hover' => '#B45309']
    ];

    // 设置默认颜色
    $defaultColor = ['theme' => '#ea868f', 'hover' => '#d1606e'];

    // 获取当前配色方案
    $colors = isset($colorMap[$colorScheme]) ? $colorMap[$colorScheme] : $defaultColor;
    $themeColor = htmlspecialchars($colors['theme'], ENT_QUOTES, 'UTF-8');
    $themeHoverColor = htmlspecialchars($colors['hover'], ENT_QUOTES, 'UTF-8');

    // 深色模式颜色映射数组
    $darkColorMap = [
        'pink' => ['theme' => '#b45864', 'hover' => '#d72b6f'],
        'green' => ['theme' => '#2e7c55', 'hover' => '#0f6933'],
        'blue' => ['theme' => '#2855b0', 'hover' => '#1f55e6'],
        'yellow' => ['theme' => '#bf763f', 'hover' => '#934109']
    ];

    // 获取当前深色模式下的颜色
    $darkColors = isset($darkColorMap[$colorScheme]) ? $darkColorMap[$colorScheme] : $defaultColor;
    $darkThemeColor = htmlspecialchars($darkColors['theme'], ENT_QUOTES, 'UTF-8');
    $darkThemeHoverColor = htmlspecialchars($darkColors['hover'], ENT_QUOTES, 'UTF-8');

    // 输出动态CSS
    echo '<style>
        :root {
            --themecolor: ' . $themeColor . ';
            --themehovercolor: ' . $themeHoverColor . ';
        }

        [data-theme="dark"] {
            --themecolor: ' . $darkThemeColor . ';
            --themehovercolor: ' . $darkThemeHoverColor . ';
        }
    </style>';
}


function allOfCharacters()
{
    $chars = 0;
    $db = Typecho_Db::get();
    $select = $db->select('text')->from('table.contents');
    $rows = $db->fetchAll($select);
    foreach ($rows as $row) {
        $chars += mb_strlen(trim($row['text']), 'UTF-8');
    }

    // 将字符数转换为适当的单位
    if ($chars >= 10000) {
        $chars /= 10000;
        $unit = 'w'; // 万
    } else if ($chars >= 1000) {
        $chars /= 1000;
        $unit = 'k'; // 千
    } else {
        $unit = '';
    }

    return sprintf('%.2lf %s', $chars, $unit);
}


function getTotalPostsCount()
{
    $db = Typecho_Db::get();

    // 查询文章总数
    $select = $db->select('COUNT(*) AS count')->from('table.contents')->where('type = ?', 'post');
    $result = $db->fetchObject($select);

    return $result ? $result->count : 0;
}


function add_zoomable_to_images($content)
{
    // 排除的元素
    $exclude_elements = [
        '.no-zoom', // 排除带有 no-zoom 类的元素
        '#no-zoom', // 排除带有 no-zoom ID 的元素
    ];

    // 正则匹配所有图片
    $content = preg_replace_callback('/<img[^>]+>/', function ($matches) use ($exclude_elements) {
        $img = $matches[0];

        // 检查是否在排除列表中
        foreach ($exclude_elements as $exclude) {
            if (strpos($img, $exclude) !== false) {
                return $img; // 如果匹配到排除项，则返回原始图片标签
            }
        }

        // 如果没有被排除，添加 data-zoomable 属性
        if (strpos($img, 'data-zoomable') === false) {
            $img = preg_replace('/<img/', '<img data-zoomable', $img);
        }

        return $img;
    }, $content);

    return $content;
}


function parse_Shortcodes($content)
{
    // 替换短代码结束标签后的 <br> 标签
    $content = preg_replace('/\[\/(alert|window|friend-card|collapsible-panel|timeline|tabs)\](<br\s*\/?>)?/i', '[/$1]', $content);
    $content = preg_replace('/\[\/timeline-event\](<br\s*\/?>)?/i', '[/timeline-event]', $content);
    $content = preg_replace('/\[\/tab\](<br\s*\/?>)?/i', '[/tab]', $content);

    // 处理 [alert] 短代码
    $content = preg_replace_callback('/\[alert type="([^"]*)"\](.*?)\[\/alert\]/s', function ($matches) {
        $type = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
        $text = htmlspecialchars($matches[2], ENT_QUOTES, 'UTF-8');
        return "<div alert-type=\"$type\">$text</div>";
    }, $content);

    // 处理 [window] 短代码
    $content = preg_replace_callback('/\[window type="([^"]*)" title="([^"]*)"\](.*?)\[\/window\]/s', function ($matches) {
        $type = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
        $title = htmlspecialchars($matches[2], ENT_QUOTES, 'UTF-8');
        $text = preg_replace('/^<br\s*\/?>/', '', $matches[3]);
        $text = htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); // 防止注入
        return "<div window-type=\"$type\" title=\"$title\">$text</div>";
    }, $content);

    // 处理 [friend-card] 短代码
    $content = preg_replace_callback('/\[friend-card name="([^"]*)" ico="([^"]*)" url="([^"]*)"\](.*?)\[\/friend-card\]/s', function ($matches) {
        $name = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
        $ico = htmlspecialchars($matches[2], ENT_QUOTES, 'UTF-8');
        $url = htmlspecialchars($matches[3], ENT_QUOTES, 'UTF-8');
        $description = htmlspecialchars($matches[4], ENT_QUOTES, 'UTF-8');
        return "<div friend-name=\"$name\" ico=\"$ico\" url=\"$url\">$description</div>";
    }, $content);

    // 处理 [collapsible-panel] 短代码
    $content = preg_replace_callback('/\[collapsible-panel title="([^"]*)"\](.*?)\[\/collapsible-panel\]/s', function ($matches) {
        $title = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
        $text = preg_replace('/^<br\s*\/?>/', '', $matches[2]);
        $text = htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); // 防止注入
        return "<div collapsible-panel title=\"$title\">$text</div>";
    }, $content);

    // 处理 [timeline] 短代码
    $content = preg_replace_callback('/\[timeline\](.*?)\[\/timeline\]/s', function ($matches) {
        $innerContent = $matches[1];
        $innerContent = preg_replace_callback('/\[timeline-event date="([^"]*)" title="([^"]*)"\](.*?)\[\/timeline-event\]/s', function ($eventMatches) {
            $date = htmlspecialchars($eventMatches[1], ENT_QUOTES, 'UTF-8');
            $title = htmlspecialchars($eventMatches[2], ENT_QUOTES, 'UTF-8');
            $eventText = htmlspecialchars($eventMatches[3], ENT_QUOTES, 'UTF-8');
            return "<div timeline-event date=\"$date\" title=\"$title\">$eventText</div>";
        }, $innerContent);
        return "<div id=\"timeline\">$innerContent</div>";
    }, $content);

    // 处理 [tabs] 短代码
    $content = preg_replace_callback('/\[tabs\](.*?)\[\/tabs\]/s', function ($matches) {
        $innerContent = $matches[1];
        $innerContent = preg_replace_callback('/\[tab title="([^"]*)"\](.*?)\[\/tab\]/s', function ($tabMatches) {
            $title = htmlspecialchars($tabMatches[1], ENT_QUOTES, 'UTF-8');
            $tabContent = preg_replace('/^\s*<br\s*\/?>/', '', $tabMatches[2]);
            $tabContent = htmlspecialchars($tabContent, ENT_QUOTES, 'UTF-8'); // 防止注入
            return "<div tab-title=\"$title\">$tabContent</div>";
        }, $innerContent);
        return "<div tabs>$innerContent</div>";
    }, $content);

    // 处理 [bilibili-card] 短代码
    $content = preg_replace_callback('/\[bilibili-card bvid="([^"]*)"\]/', function ($matches) {
        $bvid = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
        $url = "//player.bilibili.com/player.html?bvid=$bvid&autoplay=0";
        return "
        <div class='bilibili-card'>
            <iframe src='$url' scrolling='no' border='0' frameborder='no' framespacing='0' allowfullscreen='true'></iframe>
        </div>
    ";
    }, $content);

    // 图片底部文字注释结构
    // 使用正则表达式匹配所有的图片标签
    $pattern = '/<img.*?src=[\'"](.*?)[\'"].*?>/i';

    // 使用 preg_replace_callback 来处理每个匹配到的图片标签
    $content = preg_replace_callback($pattern, function ($matches) {
        // 获取图片的 alt 属性
        $alt = '';
        if (preg_match('/alt=[\'"](.*?)[\'"]/i', $matches[0], $alt_matches)) {
            $alt = $alt_matches[1];
        }

        // 如果 alt 属性不为空，则添加注释
        if (!empty($alt)) {
            // 将图片标签替换为带有注释的图片标签
            return '<figure data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-delay="85">' . $matches[0] . '<figcaption>' . htmlspecialchars($alt, ENT_QUOTES, 'UTF-8') . '</figcaption></figure>';
        }

        // 如果没有 alt 属性，直接返回原图片标签
        return $matches[0];
    }, $content);

    return $content;
}

function parse_alerts($content)
{
    $content = preg_replace_callback('/<div alert-type="(.*?)">(.*?)<\/div>/', function ($matches) {
        // 获取并转义数据，防止 XSS
        $type = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
        $innerContent = htmlspecialchars($matches[2], ENT_QUOTES, 'UTF-8');
        
        // 默认图标
        $iconClass = 'icon-info-circled';

        // 根据 alert-type 设置不同的图标
        switch ($type) {
            case 'green':
                $iconClass = 'icon-ok-circle';
                break;
            case 'blue':
                $iconClass = 'icon-info-circled';
                break;
            case 'yellow':
                $iconClass = 'icon-attention';
                break;
            case 'red':
                $iconClass = 'icon-cancel-circle';
                break;
        }

        // 返回经过处理的警告框 HTML
        return '<div role="alert" class="alert-box ' . $type . '">
                    <i class="' . $iconClass . '"></i>
                    <p class="text-xs font-semibold">' . $innerContent . '</p>
                </div>';
    }, $content);

    return $content;
}


function parse_windows($content)
{
    $content = preg_replace_callback('/<div window-type="(.*?)" title="(.*?)">(.*?)<\/div>/', function ($matches) {
        // 获取并转义数据，防止 XSS
        $type = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
        $title = htmlspecialchars($matches[2], ENT_QUOTES, 'UTF-8');
        $innerContent = htmlspecialchars($matches[3], ENT_QUOTES, 'UTF-8');

        // 返回修改后的窗口元素
        return '<div class="notifications-container">
                    <div class="window ' . $type . '">
                        <div class="flex">
                            <div class="window-prompt-wrap">
                                <p class="window-prompt-heading">' . $title . '</p>
                                <div class="window-prompt-prompt">
                                    <p>' . $innerContent . '</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>';
    }, $content);

    return $content;
}


function parse_timeline($content)
{
    $content = preg_replace_callback('/<div timeline-event date="(.*?)" title="(.*?)">(.*?)<\/div>/', function ($matches) {
        // 获取并转义数据，防止 XSS
        $date = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
        $title = htmlspecialchars($matches[2], ENT_QUOTES, 'UTF-8');
        $innerContent = htmlspecialchars($matches[3], ENT_QUOTES, 'UTF-8');

        // 返回修改后的时间轴项
        return '<div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">' . $date . '</div>
                        <p class="timeline-title">' . $title . '</p>
                        <p class="timeline-description">' . $innerContent . '</p>
                    </div>
                </div>';
    }, $content);

    return $content;
}


function parsePicGrid($content)
{
    $pattern = '/\[PicGrid\](.*?)\[\/PicGrid\]/s';
    preg_match_all($pattern, $content, $matches);

    if (!empty($matches[1])) {
        foreach ($matches[1] as $match) {
            // 清理内容：去除 <br>、<figcaption> 和 <p> 标签
            $cleanMatch = preg_replace([
                '/<br>/',
                '/<figcaption>.*?<\/figcaption>/',
                '/<\/?p>/',
            ], '', $match);

            // 构建包含 pic-grid 类的 div 元素
            $gridContent = '<div class="pic-grid">' . $cleanMatch . '</div>';

            // 使用一次 str_replace 替换所有匹配项
            $content = str_replace('[PicGrid]' . $match . '[/PicGrid]', $gridContent, $content);
        }
    }

    return $content;
}


// 运行所有函数
function parseShortcodes($content)
{
    $content = parse_Shortcodes($content);
    $content = parse_alerts($content);
    $content = parse_windows($content);
    $content = parse_timeline($content);
    $content = parsePicGrid($content);

    $content = add_zoomable_to_images($content); # 图片放大

    return $content;
}
