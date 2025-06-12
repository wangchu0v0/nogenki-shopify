// Judge.me Review Modifier - Performance Optimized
// 性能优化版本：减少延迟，提升加载速度

(function() {
    'use strict';
    
    // 配置参数
    const CONFIG = {
        maxRetries: 10,
        retryInterval: 100,
        observerConfig: { childList: true, subtree: true },
        selectors: {
            badge: '.jdgm-prev-badge__text',
            widget: '.jdgm-widget'
        }
    };
    
    let modificationCount = 0;
    let retryCount = 0;
    
    // 高性能文字替换函数
    function optimizedTextReplace(element) {
        if (element.hasAttribute('data-optimized')) return false;
        
        const text = element.textContent.trim();
          // 快速模式：直接匹配常见格式 - 扩展英语支持
        const reviewMatch = text.match(/(\d+)[\s\u00A0]*(?:件のレビュー|reviews?|review\(s\)|customer\s+reviews?|个评价|則評價)/i);
        
        if (reviewMatch) {
            const count = reviewMatch[1];
            element.textContent = `(${count})`;
            element.setAttribute('data-optimized', 'true');
            element.style.cssText = `
                font-size: 10px !important;
                font-family: "Libre Baskerville", serif !important;
                color: #666 !important;
                transform: translateY(-1px) !important;
                line-height: 1 !important;
            `;
            return true;
        }
        
        return false;
    }
    
    // 即时处理函数（页面加载时）
    function immediateProcess() {
        const elements = document.querySelectorAll(CONFIG.selectors.badge);
        let processed = 0;
        
        elements.forEach(element => {
            if (optimizedTextReplace(element)) {
                processed++;
            }
        });
        
        if (processed > 0) {
            console.log(`✅ 即时处理了 ${processed} 个评价元素`);
            modificationCount += processed;
        }
        
        return processed;
    }
    
    // DOM变化观察器
    function createObserver() {
        const observer = new MutationObserver((mutations) => {
            let hasNewNodes = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // 检查添加的节点是否包含评价元素
                        const elements = node.matches && node.matches(CONFIG.selectors.badge) 
                            ? [node] 
                            : node.querySelectorAll ? node.querySelectorAll(CONFIG.selectors.badge) : [];
                        
                        elements.forEach(element => {
                            if (optimizedTextReplace(element)) {
                                hasNewNodes = true;
                                modificationCount++;
                            }
                        });
                    }
                });
            });
            
            if (hasNewNodes) {
                console.log(`🔄 动态处理了新的评价元素，总计: ${modificationCount}`);
            }
        });
        
        observer.observe(document.body, CONFIG.observerConfig);
        return observer;
    }
    
    // 初始化函数
    function initialize() {
        console.log('🚀 Judge.me性能优化修改器启动');
        
        // 立即处理已存在的元素
        const immediateCount = immediateProcess();
        
        // 如果没有找到元素，进行少量重试
        if (immediateCount === 0 && retryCount < CONFIG.maxRetries) {
            retryCount++;
            setTimeout(initialize, CONFIG.retryInterval);
            return;
        }
        
        // 启动观察器监听新添加的元素
        createObserver();
        
        // 最终检查（确保处理完整）
        setTimeout(() => {
            const finalCount = immediateProcess();
            if (finalCount > 0) {
                console.log(`🔧 最终检查处理了 ${finalCount} 个元素`);
            }
            console.log(`📊 总计处理: ${modificationCount} 个评价元素`);
        }, 1000);
    }
    
    // 启动时机优化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM已准备好，立即执行
        setTimeout(initialize, 0);
    }
    
})();
