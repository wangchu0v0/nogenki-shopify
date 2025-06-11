// Judge.me Review Text Modifier - Balanced Anti-Update Version
// 对抗Judge.me插件自动更新，平衡性能和有效性

(function() {
    'use strict';
    
    console.log('🚀 Judge.me修改器启动 - 平衡版本');
    
    const MODIFIED_ATTR = 'data-judgeme-modified';
    let modificationCount = 0;
    
    // 注入针对移动端和桌面端的响应式样式
    function injectGlobalStyles() {
        const styleId = 'judgeme-custom-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* 评价文字样式 - 括号格式 */
                .jdgm-prev-badge__text {
                    font-size: 14px !important;
                    color: #666 !important;
                    line-height: 1.2 !important;
                    vertical-align: middle !important;
                    margin-left: 4px !important;
                }
                
                /* 星星样式保持一致 */
                .jdgm-star {
                    font-size: 16px !important;
                    line-height: 1 !important;
                }
                
                .jdgm-prev-badge__stars {
                    display: inline-flex !important;
                    align-items: center !important;
                }
                
                /* 移动端响应式调整 */
                @media screen and (max-width: 768px) {
                    .jdgm-prev-badge__text {
                        font-size: 12px !important;
                    }
                    .jdgm-star {
                        font-size: 14px !important;
                    }
                }
                
                /* 修复theme dev与实际显示差异 */
                @media screen and (max-width: 480px) {
                    .jdgm-prev-badge__text {
                        font-size: 11px !important;
                    }
                    .jdgm-star {
                        font-size: 13px !important;
                    }
                }
            `;
            document.head.appendChild(style);
            console.log('✅ 注入响应式样式');
        }
    }    // 高效的文本修改函数
    function modifyReviewText() {
        injectGlobalStyles();
        
        let count = 0;
        
        // 直接查找Judge.me的文本元素
        const textElements = document.querySelectorAll('.jdgm-prev-badge__text:not([' + MODIFIED_ATTR + '])');
        
        textElements.forEach(element => {
            const originalText = element.textContent.trim();
            const numberMatch = originalText.match(/(\d+)/);
            
            if (numberMatch && originalText.includes('のレビュー')) {
                const reviewCount = numberMatch[1];
                const newText = `(${reviewCount})`;
                
                element.textContent = newText;
                element.setAttribute(MODIFIED_ATTR, 'true');
                element.style.cssText = `
                    font-size: 14px !important;
                    color: #666 !important;
                    line-height: 1.2 !important;
                    vertical-align: middle !important;
                    margin-left: 4px !important;
                `;
                
                count++;
                console.log(`✅ 修改: "${originalText}" → "${newText}"`);
            }
        });
        
        // 如果没找到标准元素，使用TreeWalker查找文本节点
        if (count === 0) {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        return node.textContent.includes('のレビュー') && 
                               !node.parentElement.hasAttribute(MODIFIED_ATTR) ? 
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
                const originalText = textNode.textContent.trim();
                const numberMatch = originalText.match(/(\d+)/);
                
                if (numberMatch) {
                    const newText = `(${numberMatch[1]})`;
                    
                    const span = document.createElement('span');
                    span.textContent = newText;
                    span.setAttribute(MODIFIED_ATTR, 'true');
                    span.style.cssText = `
                        font-size: 14px !important;
                        color: #666 !important;
                        line-height: 1.2 !important;
                        vertical-align: middle !important;
                        margin-left: 4px !important;
                    `;
                    
                    textNode.parentElement.replaceChild(span, textNode);
                    count++;
                    console.log(`✅ 深度修改: "${originalText}" → "${newText}"`);
                }
            });
        }
        
        if (count > 0) {
            modificationCount += count;
            console.log(`🎉 本次修改了 ${count} 个评价文本，总计: ${modificationCount}`);
        }
        
        return count;
    }    // 平衡的触发机制 - 减少性能消耗
    function initModifier() {
        // 立即执行
        modifyReviewText();
        
        // 分阶段延迟执行
        setTimeout(modifyReviewText, 500);
        setTimeout(modifyReviewText, 2000);
        
        let lastModification = Date.now();
        
        // 智能DOM变化监听
        const observer = new MutationObserver(function(mutations) {
            let shouldModify = false;
            
            // 避免频繁触发，最少间隔1秒
            if (Date.now() - lastModification < 1000) {
                return;
            }
            
            mutations.forEach(mutation => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && 
                            (node.textContent.includes('のレビュー') || 
                             (node.querySelector && node.querySelector('[class*="jdgm"]')))) {
                            shouldModify = true;
                        }
                    });
                }
            });
            
            if (shouldModify) {
                lastModification = Date.now();
                setTimeout(modifyReviewText, 200);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 页面焦点恢复时检查
        window.addEventListener('focus', function() {
            setTimeout(modifyReviewText, 300);
        });
        
        // 减少定期检查频率 - 从5秒改为10秒
        setInterval(function() {
            const unmodifiedElements = document.querySelectorAll('.jdgm-prev-badge__text:not([' + MODIFIED_ATTR + '])');
            if (unmodifiedElements.length > 0) {
                console.log('🔄 发现未修改元素，执行修复...');
                modifyReviewText();
            }
        }, 10000); // 每10秒检查一次
        
        // Judge.me事件监听
        window.addEventListener('judgeme_loaded', function() {
            console.log('🎯 检测到Judge.me加载事件');
            setTimeout(modifyReviewText, 500);
        });
        
        console.log('✅ 修改器初始化完成 - 平衡模式');
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModifier);
    } else {
        initModifier();
    }
    
})();
