/** 这个JS包含了各种需要处理的内容 **/
/** 回到顶部按钮，TOC目录，内部卡片部分内容解析都在这里 **/

// 节流函数（throttle）
function throttle(callback, delay) {
    let lastTime = 0;
    return function () {
        const now = new Date().getTime();
        if (now - lastTime >= delay) {
            callback();
            lastTime = now;
        }
    };
}

function handleGoTopButton() {
    const goTopBtn = document.getElementById('go-top');
    if (!goTopBtn) return;  // 如果元素不存在，退出函数

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.boundingClientRect.top < 0) {
                goTopBtn.classList.add('visible');
            } else {
                goTopBtn.classList.remove('visible');
            }
        });
    });
    observer.observe(document.body);

    const goTopAnchor = document.querySelector('#go-top .go');
    if (goTopAnchor) {  // 确保 goTopAnchor 存在
        goTopAnchor.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function generateTOC() {
    const tocSection = document.getElementById("toc-section");
    const toc = document.querySelector(".toc");
    const postWrapper = document.querySelector(".inner-post-wrapper");

    if (!toc || !postWrapper) return;  // 如果 toc 或 postWrapper 不存在，退出

    const elements = Array.from(postWrapper.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    if (!elements.length) return;  // 如果没有标题元素，退出

    const fragment = document.createDocumentFragment();
    const ul = document.createElement('ul');
    ul.id = 'toc';

    elements.forEach((element, index) => {
        if (!element.id) {
            element.id = `heading-${index}`;
        }
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

    toc.addEventListener("click", event => {
        if (event.target.matches('.toc-a')) {
            event.preventDefault();
            const targetId = event.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const targetTop = targetElement.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: targetTop,
                    behavior: "smooth"
                });
                setTimeout(() => {
                    window.location.hash = targetId;
                }, 300);
            }
        }
    });

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

function getElementTop(element) {
    let actualTop = element.offsetTop;
    let current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}

function removeClass(elements) {
    elements.forEach(element => {
        const anchor = document.querySelector(`#link-${element.id}`);
        if (anchor) {
            anchor.classList.remove("li-active");
        }
    });
}

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

function parseTabs() {
    const tabContainers = document.querySelectorAll('.tabs');

    tabContainers.forEach(container => {
        const tabs = Array.from(container.querySelectorAll('.tab'));
        const contentSections = Array.from(container.querySelectorAll('.tab-content'));

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contentSections.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                contentSections[index].classList.add('active');
            });
        });
    });
}

// 调用这些函数
handleGoTopButton();
generateTOC();
parseFriendCards();
parseCollapsiblePanels();
parseTabs();
