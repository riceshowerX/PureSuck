// 节流函数（throttle）
function throttle(callback, delay) {
    let lastTime = 0;
    return function () {
        const now = performance.now(); // 使用更高精度的性能计时器
        if (now - lastTime >= delay) {
            callback();
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

    addObserver() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                this.goTopBtn.classList.toggle('visible', entry.boundingClientRect.top < 0);
            });
        });
        observer.observe(document.body);
    }

    addEventListeners() {
        const goTopAnchor = this.goTopBtn.querySelector('.go');
        goTopAnchor?.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    siderbar.style.transform = `translateY(${sidebarTop + 4}px)`;
                }
            }
        }, {
            rootMargin: '0px 0px -50% 0px' // 提前触发高亮
        });

        elements.forEach(element => observer.observe(element));
    }

    getElementTop(element) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
    }

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

        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('friend-name')) {
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
                            <div class="friends-card-text">
                                ${node.innerHTML}
                            </div>
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
            const title = element.getAttribute('title');
            const content = element.innerHTML;

            const newContent = `<div class="collapsible-panel">
                <button class="collapsible-header">
                    ${title}
                    <span class="icon icon-down-open"></span>
                </button>
                <div class="collapsible-content" style="max-height: 0; overflow: hidden; transition: all .4s cubic-bezier(0.345, 0.045, 0.345, 1);">
                    <div class="collapsible-details">${content}</div>
                </div>
            </div>`;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newContent;
            const newPanel = tempDiv.firstChild;

            const button = newPanel.querySelector('.collapsible-header');
            const contentDiv = newPanel.querySelector('.collapsible-content');
            const icon = button.querySelector('.icon');

            button.addEventListener('click', function () {
                this.classList.toggle('active');
                if (contentDiv.style.maxHeight && contentDiv.style.maxHeight !== '0px') {
                    contentDiv.style.maxHeight = '0px';
                    icon.classList.remove('icon-up-open');
                    icon.classList.add('icon-down-open');
                } else {
                    contentDiv.style.maxHeight = contentDiv.scrollHeight + "px";
                    icon.classList.remove('icon-down-open');
                    icon.classList.add('icon-up-open');
                }
            });

            element.parentNode.replaceChild(newPanel, element);
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
