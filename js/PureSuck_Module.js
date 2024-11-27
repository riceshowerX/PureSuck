// 节流函数（throttle）
function throttle(callback, delay) {
    // 检查 callback 是否为函数
    if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
    }

    let lastTime = 0;
    return function () {
        const now = Date.now(); // 使用 Date.now() 提高兼容性
        // 如果时间间隔大于等于 delay，则执行回调
        if (now - lastTime >= delay) {
            requestAnimationFrame(callback); // 使用 requestAnimationFrame 来提升性能
            lastTime = now;
        }
    };
}

// 回到顶部按钮
class GoTopButton {
    constructor() {
        this.goTopBtn = document.getElementById('go-top');
        if (this.goTopBtn) {
            this.addObserver();
            this.addEventListeners();
        }
    }

    // 观察页面的滚动，控制回到顶部按钮的显示与隐藏
    addObserver() {
        const observer = new IntersectionObserver(entries => {
            let isVisible = entries.some(entry => entry.boundingClientRect.top < 0);
            this.goTopBtn.classList.toggle('visible', isVisible); // 如果页面向上滚动，显示按钮
        });
        observer.observe(document.body);
    }

    // 给回到顶部按钮添加点击事件
    addEventListeners() {
        const goTopAnchor = this.goTopBtn.querySelector('.go');
        goTopAnchor?.addEventListener('click', (e) => {
            e.preventDefault(); // 防止默认行为
            window.scrollTo({ top: 0, behavior: 'smooth' }); // 平滑滚动到顶部
        });
    }
}

// TOC 目录生成
class TOC {
    constructor() {
        this.tocSection = document.getElementById("toc-section");
        this.toc = document.querySelector(".toc");
        this.postWrapper = document.querySelector(".inner-post-wrapper");

        if (this.toc && this.postWrapper) {
            this.generateTOC();
        }
    }

    // 生成目录
    generateTOC() {
        const elements = Array.from(this.postWrapper.querySelectorAll("h1, h2, h3, h4, h5, h6"));
        if (!elements.length) return;

        const fragment = document.createDocumentFragment();
        const ul = document.createElement('ul');
        ul.id = 'toc';

        elements.forEach((element, index) => {
            element.id = element.id || `heading-${index}`;
            const li = document.createElement('li');
            li.className = `li li-${element.tagName[1]}`;
            li.innerHTML = `<a href="#${element.id}" id="link-${element.id}" class="toc-a">${element.textContent}</a>`;
            ul.appendChild(li);
        });

        const dirDiv = document.createElement('div');
        dirDiv.className = 'dir';
        dirDiv.appendChild(ul);
        dirDiv.innerHTML += `<div class="sider"><span class="siderbar"></span></div>`;
        fragment.appendChild(dirDiv);

        this.toc.appendChild(fragment);
        this.handleScroll(elements);

        if (this.tocSection) {
            this.tocSection.style.display = "block";
            const rightSidebar = document.querySelector(".right-sidebar");
            if (rightSidebar) {
                rightSidebar.style.position = "absolute";
                rightSidebar.style.top = "0";
            }
        }

        window.dispatchEvent(new Event('scroll'));
    }

    // 处理滚动时的高亮显示
    handleScroll(elements) {
        const tocItems = document.querySelectorAll(".toc li");
        const siderbar = document.querySelector(".siderbar");

        const elementTops = elements.map(element => this.getElementTop(element));

        const observer = new IntersectionObserver(entries => {
            let activeElement = null;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activeElement = entry.target;
                }
            });

            if (activeElement) {
                this.removeClass(elements);
                const anchor = document.querySelector(`#link-${activeElement.id}`);
                if (anchor) {
                    anchor.classList.add("li-active");
                    const index = elements.indexOf(activeElement);
                    const sidebarTop = tocItems[index].offsetTop;
                    siderbar.style.transform = `translateY(${sidebarTop + 4}px)`; // 更新侧边栏位置
                }
            }
        }, {
            rootMargin: '0px 0px -50% 0px' // 提前触发高亮
        });

        elements.forEach(element => observer.observe(element));
    }

    // 获取元素顶部位置
    getElementTop(element) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
    }

    // 移除高亮样式
    removeClass(elements) {
        elements.forEach(element => {
            const anchor = document.querySelector(`#link-${element.id}`);
            if (anchor) {
                anchor.classList.remove("li-active");
            }
        });
    }
}

// 解析朋友卡片
class FriendCards {
    constructor() {
        this.container = document.body;
        this.parseFriendCards();
    }

    parseFriendCards() {
        const fragment = document.createDocumentFragment();
        const groups = this.identifyGroups(this.container.firstChild);
        this.replaceGroups(groups);
        this.container.appendChild(fragment);
    }

    identifyGroups(node) {
        const groups = [];
        let currentGroup = null;

        // 使用 querySelectorAll 改进为直接查找目标元素
        const friendNodes = Array.from(document.querySelectorAll('[friend-name]'));

        friendNodes.forEach(node => {
            if (node.hasAttribute('friend-name')) {
                if (!currentGroup) {
                    currentGroup = [];
                    groups.push(currentGroup);
                }
                currentGroup.push(node);
            } else {
                currentGroup = null;
            }
        });

        return groups;
    }

    replaceGroups(groups) {
        groups.forEach(group => {
            if (group.length > 0) {
                const friendsBoardList = document.createElement('div');
                friendsBoardList.classList.add('friendsboard-list');

                group.forEach(node => {
                    const friendName = node.getAttribute('friend-name');
                    const avatarUrl = node.getAttribute('ico');
                    const url = node.getAttribute('url');

                    const newContent = document.createElement('a');
                    newContent.href = url;
                    newContent.classList.add('friendsboard-item');
                    newContent.target = "_blank";
                    newContent.innerHTML = `
                        <div class="friends-card-header">
                            <span class="friends-card-username">${friendName}</span>
                            <span class="friends-card-dot"></span>
                        </div>
                        <div class="friends-card-body">
                            <div class="friends-card-text">${node.innerHTML}</div>
                            <div class="friends-card-avatar-container">
                                <img src="${avatarUrl}" alt="Avatar" class="friends-card-avatar">
                            </div>
                        </div>
                    `;

                    friendsBoardList.appendChild(newContent);
                });

                const firstNode = group[0];
                firstNode.innerHTML = '';
                firstNode.appendChild(friendsBoardList);

                for (let i = 1; i < group.length; i++) {
                    group[i].remove();
                }
            }
        });
    }
}

// 解析可折叠面板
class CollapsiblePanels {
    constructor() {
        this.parseCollapsiblePanels();
    }

    parseCollapsiblePanels() {
        const elements = document.querySelectorAll('[collapsible-panel]');

        elements.forEach(element => {
            const title = element.getAttribute('collapsible-panel');
            const content = element.querySelector('.panel-content');
            
            if (content) {
                const button = document.createElement('button');
                button.className = 'panel-toggle';
                button.textContent = title;
                
                button.addEventListener('click', () => {
                    content.classList.toggle('collapsed');
                });

                element.insertBefore(button, content);
            }
        });
    }
}

// 解析选项卡
class Tabs {
    constructor() {
        this.parseTabs();
    }

    parseTabs() {
        const tabContainers = document.querySelectorAll('.tabs');

        tabContainers.forEach(container => {
            const tabs = Array.from(container.querySelectorAll('.tab'));
            const contentSections = Array.from(container.querySelectorAll('.tab-content'));

            tabs.forEach((tab, index) => {
                tab.removeEventListener('click', this.tabClickHandler);  // 移除旧事件
                tab.addEventListener('click', function () {
                    tabs.forEach(t => t.classList.remove('active'));
                    contentSections.forEach(c => c.classList.remove('active'));
                    tab.classList.add('active');
                    contentSections[index].classList.add('active');
                });
            });
        });
    }

    tabClickHandler() {}
}

// 页面加载完成后初始化功能
document.addEventListener('DOMContentLoaded', () => {
    new GoTopButton();
    new TOC();
    new FriendCards();
    new CollapsiblePanels();
    new Tabs();
});
