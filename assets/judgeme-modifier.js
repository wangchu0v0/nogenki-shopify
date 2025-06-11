// Judge.me Review Text Modifier - Enhanced Version
// 将"7件のレビュー"修改为"(7)"，字体大小12px
// 专门解决theme dev环境中的问题

(function() {
    'use strict';
    
    console.log('🚀 Judge.me增强修改器启动');
    
    // 防止重复修改的标记
    const MODIFIED_ATTR = 'data-judgeme-modified';
    
    // 创建并注入强制样式
    function injectGlobalStyles() {
        const styleId = 'judgeme-custom-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .jdgm-prev-badge__text,
                [class*="jdgm"] span {
                    font-size: 12px !important;
                    color: #666 !important;
                    line-height: 1 !important;
                    vertical-align: baseline !important;
                }
            `;
            document.head.appendChild(style);
            console.log('✅ 注入全局样式');
        }
    }
    
    // 主要修改函数
    function modifyReviewText() {
        // 注入全局样式
        injectGlobalStyles();
        let modifiedCount = 0;
        
        // 方法1: 查找所有可能包含评价文本的元素
        const selectors = [
            '.jdgm-prev-badge__text',
            '.jdgm-widget span',
            '.jdgm-prev-badge span',
            '[class*="jdgm"] span',
            'span'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 跳过已修改的元素
                if (element.hasAttribute(MODIFIED_ATTR)) {
                    return;
                }
                
                const text = element.textContent;
                
                // 检查是否包含日文评价模式且没有子元素
                if (text && text.includes('のレビュー') && element.children.length === 0) {
                    const numberMatch = text.match(/(\d+)/);
                    
                    if (numberMatch) {
                        const reviewCount = numberMatch[1];
                        const newText = '(' + reviewCount + ')';
                        
                        // 修改文本
                        element.textContent = newText;
                        
                        // 强制应用样式，使用setProperty确保优先级
                        element.style.setProperty('font-size', '12px', 'important');
                        element.style.setProperty('color', '#666', 'important');
                        element.style.setProperty('line-height', '1', 'important');
                        element.style.setProperty('vertical-align', 'baseline', 'important');
                        
                        // 标记为已修改
                        element.setAttribute(MODIFIED_ATTR, 'true');
                        
                        modifiedCount++;
                        console.log('✅ 修改:', text, '→', newText);
                    }
                }
            });
        });
        
        // 方法2: 使用TreeWalker查找文本节点（更彻底）
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            function(node) {
                return node.textContent.includes('のレビュー') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            const parent = textNode.parentElement;
            if (parent && !parent.hasAttribute(MODIFIED_ATTR)) {
                const text = textNode.textContent;            const numberMatch = text.match(/(\d+)/);
                
                if (numberMatch) {
                    const reviewCount = numberMatch[1];
                    const newText = '(' + reviewCount + ')';
                    
                    // 创建包装元素以应用样式
                    const span = document.createElement('span');
                    span.textContent = newText;
                    span.className = 'jdgm-modified-text';
                    span.style.setProperty('font-size', '12px', 'important');
                    span.style.setProperty('color', '#666', 'important');
                    span.style.setProperty('line-height', '1', 'important');
                    span.style.setProperty('vertical-align', 'baseline', 'important');
                    
                    // 替换原始文本节点
                    textNode.parentNode.replaceChild(span, textNode);
                    parent.style.setProperty('font-size', '12px', 'important');
                    parent.style.setProperty('color', '#666', 'important');
                    parent.setAttribute(MODIFIED_ATTR, 'true');
                    
                    modifiedCount++;
                    console.log('✅ 文本节点修改:', text, '→', newText);
                }
            }
        });
        
        if (modifiedCount > 0) {
            console.log('🎉 总共修改了', modifiedCount, '个文本');
        }
        
        return modifiedCount;
    }
    
    // 修改星星颜色
    function updateStarColors() {
        const stars = document.querySelectorAll('.jdgm-star');
        stars.forEach(star => {
            star.style.setProperty('color', '#A889A8', 'important');
            if (star.classList.contains('jdgm--off')) {
                star.style.setProperty('color', '#e0e0e0', 'important');
            }
        });
    }
    
    // 执行修改
    function executeModification() {
        console.log('🔧 执行修改...');
        const textChanges = modifyReviewText();
        updateStarColors();
        return textChanges;
    }
    
    // 立即执行
    executeModification();
    
    // 多次延迟执行，应对Judge.me异步加载
    const delays = [100, 300, 500, 1000, 1500, 2000, 3000, 5000];
    delays.forEach(delay => {
        setTimeout(() => {
            console.log(`⏰ ${delay}ms后重新检查...`);
            executeModification();
        }, delay);
    });
    
    // DOM变化监听器
    let observer;
    function startObserver() {
        if (observer) {
            observer.disconnect();
        }
        
        observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;
            
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            // 检查是否是Judge.me相关内容
                            if (node.classList && (
                                node.classList.contains('jdgm-widget') ||
                                node.classList.contains('jdgm-prev-badge') ||
                                node.querySelector && node.querySelector('[class*="jdgm"]')
                            )) {
                                shouldProcess = true;
                            }
                            
                            // 检查文本内容
                            if (node.textContent && node.textContent.includes('のレビュー')) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldProcess) {
                console.log('🔄 检测到Judge.me内容变化，重新执行修改...');
                setTimeout(executeModification, 100);
            }
        });
        
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('👀 DOM监听器已启动');
        }
    }
    
    // 启动监听器
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }
    
    // 定期强制检查
    setInterval(() => {
        console.log('🔄 定期检查...');
        executeModification();
    }, 8000);
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('📱 页面重新可见，执行检查...');
            setTimeout(executeModification, 500);
        }
    });
    
    console.log('🎯 Judge.me增强修改器初始化完成');
})();
