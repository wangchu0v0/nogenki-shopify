// Judge.me Review Text Modifier - Anti-Update Version
// 对抗Judge.me插件自动更新，强制保持我们的样式修改

(function() {
    'use strict';
    
    console.log('🚀 Judge.me修改器启动 - 抗更新版本');
    
    const MODIFIED_ATTR = 'data-judgeme-modified';
      // 修正的样式注入 - 只针对文字，不影响星星
    function injectGlobalStyles() {
        const styleId = 'judgeme-custom-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* 只针对评价文字，不影响星星 */
                .jdgm-prev-badge__text {
                    font-size: 12px !important;
                    color: #666 !important;
                    line-height: 1 !important;
                    vertical-align: baseline !important;
                }
                
                /* 确保星星保持原有大小 */
                .jdgm-star,
                .jdgm-prev-badge__stars {
                    font-size: 16px !important;
                }
            `;
            document.head.appendChild(style);
            console.log('✅ 注入修正的样式');
        }
    }
    // 主要修改函数
    function modifyReviewText() {
        injectGlobalStyles();
        
        let count = 0;
        
        // 使用TreeWalker查找文本节点
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    return node.textContent.includes('のレビュー') ? 
                           NodeFilter.FILTER_ACCEPT : 
                           NodeFilter.FILTER_REJECT;
                }
            }
        );
        
        const nodesToModify = [];
        let node;
        while (node = walker.nextNode()) {
            nodesToModify.push(node);
        }
        
        nodesToModify.forEach(textNode => {
            if (textNode.parentElement && 
                !textNode.parentElement.hasAttribute(MODIFIED_ATTR)) {
                
                const originalText = textNode.textContent.trim();
                const numberMatch = originalText.match(/(\d+)/);
                
                if (numberMatch) {
                    const newText = '(' + numberMatch[1] + ')';
                    
                    // 创建新的span元素
                    const span = document.createElement('span');
                    span.textContent = newText;
                    span.style.cssText = `
                        font-size: 12px !important;
                        color: #666 !important;
                        line-height: 1 !important;
                        vertical-align: baseline !important;
                    `;
                    
                    // 替换原文本节点
                    textNode.parentElement.replaceChild(span, textNode);
                    textNode.parentElement.setAttribute(MODIFIED_ATTR, 'true');
                    
                    count++;
                    console.log(`✅ 修改: "${originalText}" → "${newText}"`);
                }
            }
        });
        
        console.log(`🎉 修改了 ${count} 个评价文本`);
        return count;
    }      // 多重触发机制
    function initModifier() {
        // 立即执行
        modifyReviewText();
        
        // 延迟执行
        setTimeout(modifyReviewText, 1000);
        setTimeout(modifyReviewText, 3000);
        
        // DOM变化监听
        const observer = new MutationObserver(function(mutations) {
            let shouldModify = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && 
                            (node.textContent.includes('のレビュー') || 
                             node.querySelector && node.querySelector('[class*="jdgm"]'))) {
                            shouldModify = true;
                        }
                    });
                }
            });
            if (shouldModify) {
                setTimeout(modifyReviewText, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 页面可见性变化时重新检查
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(modifyReviewText, 500);
            }
        });
        
        // 强制定期检查 - 对抗插件更新
        setInterval(function() {
            console.log('🔄 定期强制检查Judge.me样式...');
            modifyReviewText();
        }, 5000); // 每5秒检查一次
        
        // 监听Judge.me可能的回调
        window.addEventListener('judgeme_loaded', function() {
            console.log('🎯 检测到Judge.me加载事件');
            setTimeout(modifyReviewText, 500);
        });
        
        // 监听任何可能的AJAX完成事件
        document.addEventListener('DOMSubtreeModified', function() {
            // 已废弃但某些浏览器仍支持
            if (document.querySelector('.jdgm-prev-badge__text')) {
                modifyReviewText();
            }
        });
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModifier);
    } else {
        initModifier();
    }
    
})();
