// 节流函数（throttle）
const throttle = (callback, delay) => {
    let lastTime = 0;
    return () => {
        const now = Date.now(); // 使用 Date.now() 提高兼容性
        if (now - lastTime >= delay) {
            requestAnimationFrame(callback); // 使用 requestAnimationFrame 提升性能
            lastTime = now;
        }
    };
};

// 回到顶部按钮
class GoTopButton {
    constructor() {
        this.goTopBtn = $('#go-top');
        if (this.goTopBtn.length) {
            this.addObserver();
            this.addEventListeners();
        }
    }

    addObserver() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // 根据是否可视添加/移除按钮显示
                this.goTopBtn.toggleClass('visible', entry.boundingClientRect.top < 0);
            });
        });
        observer.observe(document.body);
    }

    addEventListeners() {
        this.goTopBtn.find('.go').on('click', (e) => {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 'smooth');
        });
    }
}

// TOC 目录生成
class TOC {
    constructor() {
        this.tocSection = $("#toc-section");
        this.toc = $(".toc");
        this.postWrapper = $(".inner-post-wrapper");

        if (this.toc.length && this.postWrapper.length) {
            this.generateTOC();
        }
    }

    generateTOC() {
        const elements = this.postWrapper.find("h1, h2, h3, h4, h5, h6");
        if (!elements.length) return;

        const ul = $('<ul>', { id: 'toc' });

        elements.each((index, element) => {
            const $element = $(element);
            const sanitizedId = `heading-${index}`.replace(/[^a-zA-Z0-9_-]/g, '');  // 清理 ID
            $element.attr('id', $element.attr('id') || sanitizedId);
            const li = $('<li>', { class: `li li-${element.tagName[1]}` });
            li.text($element.text());  // 使用 text() 方法插入纯文本
            ul.append(li);
        });

        const dirDiv = $('<div>', { class: 'dir' }).append(ul);
        dirDiv.append('<div class="sider"><span class="siderbar"></span></div>');
        
        this.toc.append(dirDiv);

        this.handleScroll(elements);

        // 确保 #toc-section 存在才进行显示
        if (this.tocSection.length) {
            this.tocSection.show();
            $(".right-sidebar").css({ position: 'absolute', top: 0 });
        }

        $(window).trigger('scroll');
    }

    handleScroll(elements) {
        const tocItems = $(".toc li");
        const siderbar = $(".siderbar");

        const elementTops = elements.map((_, element) => this.getElementTop(element)).toArray();

        const observer = new IntersectionObserver(entries => {
            let activeElement = null;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activeElement = entry.target;
                }
            });

            if (activeElement) {
                this.removeClass(elements);
                const anchor = $(`#link-${activeElement.id}`);
                if (anchor.length) {
                    anchor.addClass("li-active");
                    const index = elements.index(activeElement);
                    const sidebarTop = tocItems.eq(index).offset().top;
                    siderbar.css('transform', `translateY(${sidebarTop + 4}px)`);
                }
            }
        }, { rootMargin: '0px 0px -50% 0px' });

        elements.each((_, element) => observer.observe(element));
    }

    getElementTop(element) {
        const rect = element.getBoundingClientRect();
        return rect.top + $(window).scrollTop();
    }

    removeClass(elements) {
        elements.each((_, element) => {
            const anchor = $(`#link-${element.id}`);
            if (anchor.length) {
                anchor.removeClass("li-active");
            }
        });
    }
}

// 解析朋友卡片
class FriendCards {
    constructor() {
        this.container = $(document.body);
        this.parseFriendCards();
    }

    parseFriendCards() {
        const fragment = $(document.createDocumentFragment());
        const groups = this.identifyGroups(this.container[0].firstChild);
        this.replaceGroups(groups);
        this.container.append(fragment);
    }

    identifyGroups(node) {
        const groups = [];
        let currentGroup = null;

        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE && $(node).attr('friend-name')) {
                if (!currentGroup) {
                    currentGroup = [];
                    groups.push(currentGroup);
                }
                currentGroup.push(node);
            } else if (node.nodeType === Node.ELEMENT_NODE ||
                (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')) {
                currentGroup = null;
            }

            if (node.firstChild) {
                groups.push(...this.identifyGroups(node.firstChild));
            }

            node = node.nextSibling;
        }
        return groups;
    }

    replaceGroups(groups) {
        groups.forEach(group => {
            if (group.length > 0) {
                const friendsBoardList = $('<div>', { class: 'friendsboard-list' });

                group.forEach(node => {
                    const $node = $(node);
                    const friendName = $node.attr('friend-name');
                    const avatarUrl = $node.attr('ico');
                    const url = $node.attr('url');

                    if (this.isValidURL(url)) {
                        const newContent = $(`
                            <a href="${url}" class="friendsboard-item" target="_blank">
                                <div class="friends-card-header">
                                    <span class="friends-card-username">${friendName}</span>
                                    <span class="friends-card-dot"></span>
                                </div>
                                <div class="friends-card-body">
                                    <div class="friends-card-text">${$node.text()}</div>
                                    <div class="friends-card-avatar-container">
                                        <img src="${avatarUrl}" alt="Avatar" class="friends-card-avatar">
                                    </div>
                                </div>
                            </a>
                        `);

                        friendsBoardList.append(newContent);
                    }
                });

                const firstNode = $(group[0]);
                firstNode.empty().append(friendsBoardList);

                for (let i = 1; i < group.length; i++) {
                    $(group[i]).remove();
                }
            }
        });
    }

    isValidURL(url) {
        const pattern = new RegExp('^(https?:\\/\\/)?([a-z0-9-]+\\.)+[a-z0-9]{2,4}(\\/[^\\s]*)?$', 'i');
        return pattern.test(url);
    }
}

// 解析可折叠面板
class CollapsiblePanels {
    constructor() {
        this.parseCollapsiblePanels();
    }

    parseCollapsiblePanels() {
        const elements = $('[collapsible-panel]');

        elements.each((_, element) => {
            const $element = $(element);
            const title = $element.attr('title');
            const content = $element.text();  // 使用 text() 方法，防止解析 HTML

            const newContent = $(`
                <div class="collapsible-panel">
                    <button class="collapsible-header">
                        ${title}
                        <span class="icon icon-down-open"></span>
                    </button>
                    <div class="collapsible-content" style="max-height: 0; overflow: hidden; transition: all .4s cubic-bezier(0.345, 0.045, 0.345, 1);">
                        <div class="collapsible-details">${content}</div>
                    </div>
                </div>
            `);

            const button = newContent.find('.collapsible-header');
            const contentDiv = newContent.find('.collapsible-content');
            const icon = button.find('.icon');

            button.on('click', () => {
                $(button).toggleClass('active');
                if (contentDiv.css('max-height') && contentDiv.css('max-height') !== '0px') {
                    contentDiv.css('max-height', '0px');
                    icon.removeClass('icon-up-open').addClass('icon-down-open');
                } else {
                    contentDiv.css('max-height', contentDiv[0].scrollHeight);
                    icon.removeClass('icon-down-open').addClass('icon-up-open');
                }
            });

            $element.replaceWith(newContent);
        });
    }
}

// 解析选项卡
class Tabs {
    constructor() {
        this.parseTabs();
    }

    parseTabs() {
        const tabContainers = $('.tabs');

        tabContainers.each((_, container) => {
            const $container = $(container);
            const tabs = $container.find('.tab');
            const contentSections = $container.find('.tab-content');

            tabs.each((tabIndex, tab) => {
                $(tab).off('click').on('click', function () {
                    tabs.removeClass('active');
                    contentSections.removeClass('active');
                    $(this).addClass('active');
                    contentSections.eq(tabIndex).addClass('active');
                });
            });
        });
    }
}

// 页面加载完成后初始化功能
$(document).ready(() => {
    new GoTopButton();
    new TOC();
    new FriendCards();
    new CollapsiblePanels();
    new Tabs();
});
