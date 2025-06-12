// Judge.me 简化修复器 - 直接替换但保护功能
// 解决英语界面reviews显示问题

(function() {
    'use strict';
    
    console.log('🛡️ Judge.me简化修复器启动');
    
    const CONFIG = {
        selectors: {
            badge: '.jdgm-prev-badge__text'
        }
    };
    
    let modificationCount = 0;
    let processedElements = new Set();
    
    // 简化的文本替换 - 直接替换但保存原始内容
    function simpleTextReplace(element) {
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
            
            // 直接替换但保存原始数据用于恢复
            if (!element.hasAttribute('data-judgeme-processed')) {
                // 保存原始文本和事件处理器
                element.setAttribute('data-original-text', originalText);
                element.setAttribute('data-judgeme-processed', 'true');
                
                // 保存原始样式
                element.setAttribute('data-original-style', element.style.cssText);
                
                // 直接替换文本内容
                element.textContent = newText;
                
                // 应用目标样式
                element.style.cssText += `
                    font-size: 10px !important;
                    font-family: "Libre Baskerville", serif !important;
                    color: #666 !important;
                `;
                
                processedElements.add(element);
                modificationCount++;
                
                console.log(`✅ 替换完成: "${originalText}" → "${newText}"`);
                return true;
            }
        }
        
        return false;
    }
    
    // 处理元素
    function processElements() {
        const elements = document.querySelectorAll(CONFIG.selectors.badge + ':not([data-judgeme-processed])');
        console.log(`🔍 发现 ${elements.length} 个未处理元素`);
        
        let processed = 0;
        elements.forEach(element => {
            if (simpleTextReplace(element)) {
                processed++;
            }
        });
        
        if (processed > 0) {
            console.log(`✅ 处理了 ${processed} 个元素，总计: ${modificationCount}`);
        }
        
        return processed;
    }
    
    // 观察器
    function createObserver() {
        const observer = new MutationObserver((mutations) => {
            let hasNewJudgeme = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
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
        
        observer.observe(document.body, { childList: true, subtree: true });
        return observer;
    }
      // 恢复功能
    function restoreOriginal() {
        const processedElementsQuery = document.querySelectorAll('[data-judgeme-processed]');
        processedElementsQuery.forEach(element => {
            const originalText = element.getAttribute('data-original-text');
            const originalStyle = element.getAttribute('data-original-style');
            
            if (originalText) {
                element.textContent = originalText;
                element.style.cssText = originalStyle || '';
                element.removeAttribute('data-judgeme-processed');
                element.removeAttribute('data-original-text');
                element.removeAttribute('data-original-style');
            }
        });
        
        // 重要：清空处理记录，允许重新处理
        processedElements.clear();
        console.log('🔄 已恢复所有原始内容并清空处理记录');
    }
    
    // 初始化
    function initialize() {
        console.log('🚀 初始化简化修复器');
        
        // 延迟执行以确保Judge.me完全加载
        setTimeout(() => {
            const count = processElements();
            if (count > 0) {
                console.log(`✅ 初始处理完成: ${count} 个元素`);
            }
        }, 300);
        
        // 启动观察器
        createObserver();
        
        // 定期检查
        setInterval(() => {
            const newCount = processElements();
            if (newCount > 0) {
                console.log(`🔄 定期检查处理了 ${newCount} 个新元素`);
            }
        }, 3000);
        
        console.log('✅ 简化修复器初始化完成');
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }
    
    // 导出调试功能
    window.judgemeSimpleFix = {
        process: processElements,
        restore: restoreOriginal,
        count: () => modificationCount,
        processed: () => processedElements.size
    };
    
})();
