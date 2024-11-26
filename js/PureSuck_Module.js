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
function handleGoTopButton() {
    const goTopBtn = document.getElementById('go-top');
    if (!goTopBtn) {
        console.warn('回到顶部按钮元素不存在');
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            goTopBtn.classList.toggle('visible', entry.boundingClientRect.top < 0);
        });
    });
    observer.observe(document.body);

    const goTopAnchor = document.querySelector('#go-top .go');
    goTopAnchor?.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 生成 TOC 目录
function generateTOC() {
    const tocSection = document.getElementById("toc-section");
    const toc = document.querySelector(".toc");
    const postWrapper = document.querySelector(".inner-post-wrapper");

    if (!toc || !postWrapper) return;

    const elements = Array.from(postWrapper.querySelectorAll("h1, h2, h3, h4, h5, h6"));
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

    toc.appendChild(fragment);

    handleScroll(elements);

    if (tocSection) {
        tocSection.style.display = "block";
        const rightSidebar = document.querySelector(".right-sidebar");
        if (rightSidebar) {
            rightSidebar.style.position = "absolute";
            rightSidebar.style.top = "0";
        }
    }
    window.dispatchEvent(new Event('scroll'));
}

// 获取元素顶部位置
function getElementTop(element) {
    const rect = element.getBoundingClientRect();
    return rect.top + window.scrollY;
}

// 移除 TOC 目录项的活动类
function removeClass(elements) {
    elements.forEach(element => {
        const anchor = document.querySelector(`#link-${element.id}`);
        if (anchor) {
            anchor.classList.remove("li-active");
        }
    });
}

// 处理滚动事件，更新 TOC 目录高亮
function handleScroll(elements) {
    let ticking = false;
    const tocItems = document.querySelectorAll(".toc li");
    const siderbar = document.querySelector(".siderbar");

    const elementTops = elements.map(element => getElementTop(element));

    window.addEventListener("scroll", throttle(() => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentPosition = window.scrollY;
                let activeElement = null;

                elements.forEach((element, index) => {
                    const targetTop = elementTops[index];
                    const elementHeight = element.offsetHeight;
                    const offset = elementHeight / 2;

                    const nextElement = elements[index + 1];
                    const nextTargetTop = nextElement ? elementTops[index + 1] : Number.MAX_SAFE_INTEGER;

                    if (currentPosition + offset >= targetTop && currentPosition + offset < nextTargetTop) {
                        activeElement = element;
                    }
                });

                if (!activeElement && elements.length > 0) {
                    activeElement = elements[0];
                }

                if (activeElement) {
                    removeClass(elements);
                    const anchor = document.querySelector(`#link-${activeElement.id}`);
                    if (anchor) {
                        anchor.classList.add("li-active");

                        const index = elements.indexOf(activeElement);
                        const sidebarTop = tocItems[index].offsetTop;
                        siderbar.style.transform = `translateY(${sidebarTop + 4}px)`;
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    }, 100)); // 使用节流（throttle）来减少滚动事件触发频率
}

// 解析朋友卡片
function parseFriendCards() {
    const container = document.body;
    const fragment = document.createDocumentFragment();

    function identifyGroups(node) {
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
                groups.push(...identifyGroups(node.firstChild));
            }

            node = node.nextSibling;
        }
        return groups;
    }

    function replaceGroups(groups) {
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

    const groups = identifyGroups(container.firstChild);
    replaceGroups(groups);

    container.appendChild(fragment);
}

// 解析可折叠面板
function parseCollapsiblePanels() {
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

// 解析选项卡
function parseTabs() {
    const tabContainers = document.querySelectorAll('.tabs');

    tabContainers.forEach(container => {
        const tabs = Array.from(container.querySelectorAll('.tab'));
        const contentSections = Array.from(container.querySelectorAll('.tab-content'));

        tabs.forEach((tab, index) => {
            tab.removeEventListener('click', tabClickHandler);  // 移除旧事件
            tab.addEventListener('click', function () {
                tabs.forEach(t => t.classList.remove('active'));
                contentSections.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                contentSections[index].classList.add('active');
            });
        });

        function tabClickHandler() {}
    });
}

// 页面加载完成后初始化功能
document.addEventListener('DOMContentLoaded', function () {
    handleGoTopButton();
    generateTOC();
    parseFriendCards();
    parseCollapsiblePanels();
    parseTabs();
});
