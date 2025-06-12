// Judge.me 非破坏性修复器 - 保护功能完整性
// 只修改显示文本，不破坏Judge.me的内部结构和功能

(function() {
    'use strict';
    
    console.log('🛡️ Judge.me非破坏性修复器启动');
    
    const CONFIG = {
        maxRetries: 10,
        retryInterval: 200,
        observerConfig: { childList: true, subtree: true },
        selectors: {
            badge: '.jdgm-prev-badge__text',
            widget: '.jdgm-widget'
        }
    };
    
    let modificationCount = 0;
    let processedElements = new Set();
    
    // 非破坏性文本替换 - 保护原始DOM结构
    function safeTextReplace(element) {
        // 避免重复处理
        if (processedElements.has(element)) return false;
        
        const originalText = element.textContent.trim();
        if (!originalText) return false;
        
        console.log(`🔍 检查元素: "${originalText}"`);
        
        // 扩展的多语言匹配
        const reviewMatch = originalText.match(/(\d+)[\s\u00A0]*(?:件のレビュー|reviews?|review\(s\)|customer\s+reviews?|个评价|則評價)/i);
        
        if (reviewMatch) {
            const count = reviewMatch[1];
            const newText = `(${count})`;
            
            // 如果已经是目标格式，跳过
            if (originalText === newText) {
                processedElements.add(element);
                return true;
            }
            
            // 关键改进：使用CSS隐藏原文本，而不是直接替换
            // 这样保护了Judge.me的内部功能
            
            // 方法1：创建覆盖层而不是替换内容
            if (!element.hasAttribute('data-judgeme-safe-processed')) {
                // 保存原始文本到属性中
                element.setAttribute('data-original-text', originalText);
                element.setAttribute('data-judgeme-safe-processed', 'true');
                  // 创建一个覆盖的span元素
                const overlay = document.createElement('span');
                overlay.textContent = newText;
                overlay.className = 'judgeme-text-overlay';                // 智能定位：精确替换文本位置，确保完全覆盖
                overlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: auto;
                    height: auto;
                    min-width: 30px;
                    min-height: 14px;
                    display: inline-block;
                    font-size: 10px !important;
                    font-family: "Libre Baskerville", serif !important;
                    color: #666 !important;
                    background: transparent;
                    z-index: 999;
                    pointer-events: none;
                    white-space: nowrap;
                    line-height: 1.2;
                `;
                  // 设置文本元素本身为relative定位容器，完全隐藏原文本
                element.style.cssText = `
                    color: transparent !important;
                    font-size: 0 !important;
                    line-height: 0 !important;
                    position: relative;
                    display: inline-block;
                    width: auto;
                    height: auto;
                    overflow: hidden;
                `;
                
                // 直接添加到文本元素内部，而不是父元素
                element.appendChild(overlay);
                
                processedElements.add(element);
                modificationCount++;
                
                console.log(`✅ 安全替换: "${originalText}" → "${newText}" (保护结构)`);
                return true;
            }
        }
        
        return false;
    }
    
    // 更安全的元素处理
    function processElements() {
        const elements = document.querySelectorAll(CONFIG.selectors.badge + ':not([data-judgeme-safe-processed])');
        console.log(`🔍 发现 ${elements.length} 个未处理元素`);
        
        let processed = 0;
        elements.forEach(element => {
            if (safeTextReplace(element)) {
                processed++;
            }
        });
        
        if (processed > 0) {
            console.log(`✅ 安全处理了 ${processed} 个元素，总计: ${modificationCount}`);
        }
        
        return processed;
    }
    
    // 轻量级观察器 - 减少干扰
    function createSafeObserver() {
        const observer = new MutationObserver((mutations) => {
            let hasNewJudgeme = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 只关注Judge.me相关的新节点
                        if (node.className && node.className.includes('jdgm') ||
                            node.querySelector && node.querySelector('[class*="jdgm"]')) {
                            hasNewJudgeme = true;
                        }
                    }
                });
            });
            
            if (hasNewJudgeme) {
                console.log('🔄 检测到新的Judge.me内容');
                setTimeout(processElements, 100);
            }
        });
        
        observer.observe(document.body, CONFIG.observerConfig);
        return observer;
    }
      // 恢复功能 - 如果出现问题可以撤销
    function restoreOriginal() {
        const processedElements = document.querySelectorAll('[data-judgeme-safe-processed]');
        processedElements.forEach(element => {
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                // 移除覆盖层
                const overlay = element.querySelector('.judgeme-text-overlay');
                if (overlay) {
                    overlay.remove();
                }
                
                // 恢复原始状态
                element.textContent = originalText;
                element.style.cssText = '';
                element.removeAttribute('data-judgeme-safe-processed');
                element.removeAttribute('data-original-text');
            }
        });
        console.log('🔄 已恢复所有原始内容');
    }
    
    // 初始化
    function initialize() {
        console.log('🚀 初始化非破坏性修复器');
        
        // 延迟执行以确保Judge.me完全加载
        setTimeout(() => {
            const count = processElements();
            if (count > 0) {
                console.log(`✅ 初始处理完成: ${count} 个元素`);
            }
        }, 300);
        
        // 启动观察器
        createSafeObserver();
        
        // 定期检查（低频率，减少性能影响）
        setInterval(() => {
            const newCount = processElements();
            if (newCount > 0) {
                console.log(`🔄 定期检查处理了 ${newCount} 个新元素`);
            }
        }, 3000);
        
        console.log('✅ 非破坏性修复器初始化完成');
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }
    
    // 导出调试功能
    window.judgemeNonDestructive = {
        process: processElements,
        restore: restoreOriginal,
        count: () => modificationCount,
        processed: () => processedElements.size
    };
    
})();
