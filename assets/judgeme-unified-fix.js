// Judge.me Unified Fix - 统一修复英语和日语界面问题
// 解决英语界面reviews不显示的问题，同时保持日语界面正常

(function() {
    'use strict';
    
    console.log('🔧 Judge.me统一修复器启动');
    
    const CONFIG = {
        maxRetries: 15,
        retryInterval: 100,
        observerConfig: { childList: true, subtree: true },
        debug: true // 开启调试模式
    };
    
    let modificationCount = 0;
    let retryCount = 0;
    let processedElements = new Set();
    
    // 语言检测
    function detectLanguage() {
        const html = document.documentElement;
        const lang = html.lang || html.getAttribute('lang') || 'ja';
        const bodyText = document.body.textContent.toLowerCase();
        
        // 检查页面内容中的语言特征
        const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(bodyText);
        const hasEnglish = /\b(reviews?|customer|product|add to cart|buy now)\b/i.test(bodyText);
        
        let detected = 'en'; // 默认英语
        if (lang.includes('ja') || hasJapanese) {
            detected = 'ja';
        }
        
        console.log(`🌍 检测到语言: ${detected}, HTML lang: ${lang}, 日语内容: ${hasJapanese}, 英语内容: ${hasEnglish}`);
        return detected;
    }
    
    // 统一文本处理函数
    function processReviewText(element) {
        if (!element || processedElements.has(element)) return false;
        
        const originalText = element.textContent.trim();
        if (!originalText) return false;
        
        console.log(`🔍 处理文本: "${originalText}"`);
        
        // 多语言正则模式 - 更全面的匹配
        const patterns = [
            // 日语模式
            /(\d+)\s*件のレビュー/i,
            /(\d+)\s*のレビュー/i,
            /(\d+)\s*件の評価/i,
            
            // 英语模式 - 更宽松的匹配
            /(\d+)\s*reviews?/i,
            /(\d+)\s*customer\s*reviews?/i,
            /(\d+)\s*review\(s\)/i,
            /based\s*on\s*(\d+)\s*reviews?/i,
            /(\d+)\s*verified\s*reviews?/i,
            /(\d+)\s*ratings?/i,
            
            // 其他语言
            /(\d+)\s*avis/i,          // 法语
            /(\d+)\s*recensioni/i,    // 意大利语
            /(\d+)\s*bewertungen/i,   // 德语
            /(\d+)\s*reseñas/i,       // 西班牙语
            
            // 通用数字模式（作为后备）
            /^(\d+)$/
        ];
        
        // 尝试匹配
        for (let pattern of patterns) {
            const match = originalText.match(pattern);
            if (match && match[1]) {
                const count = match[1];
                const newText = `(${count})`;
                
                // 如果已经是目标格式，跳过
                if (originalText === newText) {
                    processedElements.add(element);
                    element.setAttribute('data-judgeme-unified', 'true');
                    return true;
                }
                
                // 应用新文本和样式
                element.textContent = newText;
                element.setAttribute('data-judgeme-unified', 'true');
                element.style.cssText = `
                    font-size: 10px !important;
                    font-family: "Libre Baskerville", serif !important;
                    color: #666 !important;
                    line-height: 1 !important;
                    vertical-align: middle !important;
                    transform: translateY(-1px) !important;
                    display: inline !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                `;
                
                processedElements.add(element);
                modificationCount++;
                
                console.log(`✅ 成功转换: "${originalText}" → "${newText}"`);
                return true;
            }
        }
        
        console.log(`❌ 未匹配: "${originalText}"`);
        return false;
    }
    
    // 查找并处理所有相关元素
    function processAllElements() {
        const language = detectLanguage();
        console.log(`🔄 开始处理所有元素 (语言: ${language})`);
        
        // 扩展选择器以包含更多可能的Judge.me元素
        const selectors = [
            '.jdgm-prev-badge__text',
            '.jdgm-preview-badge .jdgm-prev-badge__text',
            '.jdgm-widget .jdgm-prev-badge__text',
            '[class*="jdgm"][class*="text"]',
            '[class*="review"][class*="count"]',
            '[class*="review"][class*="text"]',
            '.judgeme-review-count',
            '.review-count',
            '.product-review-count'
        ];
        
        let processed = 0;
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector + ':not([data-judgeme-unified])');
            console.log(`📍 选择器 "${selector}" 找到 ${elements.length} 个元素`);
            
            elements.forEach(element => {
                if (processReviewText(element)) {
                    processed++;
                }
            });
        });
        
        // 深度搜索 - 查找包含数字和review关键词的文本节点
        if (processed === 0) {
            console.log('🔍 执行深度搜索...');
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        const text = node.textContent.trim();
                        const parent = node.parentElement;
                        
                        // 检查文本内容
                        if (!text || text.length > 100) return NodeFilter.FILTER_REJECT;
                        
                        // 包含数字和相关关键词
                        const hasNumber = /\d+/.test(text);
                        const hasKeywords = /(review|avis|recensioni|bewertungen|reseñas|のレビュー|評価)/i.test(text);
                        const isJudgemeContext = parent && (
                            parent.className.includes('jdgm') ||
                            parent.closest('[class*="jdgm"]') ||
                            parent.closest('[class*="review"]')
                        );
                        
                        return (hasNumber && (hasKeywords || isJudgemeContext)) ? 
                               NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    }
                }
            );
            
            let node;
            while (node = walker.nextNode()) {
                const parent = node.parentElement;
                if (parent && !processedElements.has(parent)) {
                    if (processReviewText(parent)) {
                        processed++;
                    }
                }
            }
        }
        
        console.log(`📊 本次处理了 ${processed} 个元素，总计: ${modificationCount}`);
        return processed;
    }
    
    // DOM变化观察器
    function createObserver() {
        const observer = new MutationObserver((mutations) => {
            let hasNewContent = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const text = node.textContent || '';
                        // 检查是否包含评价相关内容
                        if (/\d+.*(?:review|のレビュー|avis|recensioni)/i.test(text) || 
                            node.querySelector && node.querySelector('[class*="jdgm"]')) {
                            hasNewContent = true;
                        }
                    }
                });
            });
            
            if (hasNewContent) {
                console.log('🔄 检测到新内容，重新处理...');
                setTimeout(processAllElements, 200);
            }
        });
        
        observer.observe(document.body, CONFIG.observerConfig);
        return observer;
    }
    
    // 初始化函数
    function initialize() {
        console.log('🚀 Judge.me统一修复器初始化');
        
        // 立即处理
        const immediateCount = processAllElements();
        
        // 如果没有找到元素，进行重试
        if (immediateCount === 0 && retryCount < CONFIG.maxRetries) {
            retryCount++;
            console.log(`🔄 重试 ${retryCount}/${CONFIG.maxRetries}`);
            setTimeout(initialize, CONFIG.retryInterval);
            return;
        }
        
        // 启动观察器
        createObserver();
        
        // 分阶段重新检查（确保所有动态内容都被处理）
        const recheckIntervals = [500, 1000, 2000, 5000];
        recheckIntervals.forEach(delay => {
            setTimeout(() => {
                const recheckCount = processAllElements();
                if (recheckCount > 0) {
                    console.log(`🔧 延迟检查处理了 ${recheckCount} 个新元素`);
                }
            }, delay);
        });
        
        console.log('✅ Judge.me统一修复器初始化完成');
    }
    
    // 启动时机优化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM已就绪，稍微延迟执行以确保其他脚本加载完成
        setTimeout(initialize, 50);
    }
    
    // 页面显示时重新检查（处理浏览器后退等情况）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(processAllElements, 300);
        }
    });
    
    // 导出到全局便于调试
    window.judgemeUnifiedFix = {
        process: processAllElements,
        count: () => modificationCount,
        processed: () => processedElements.size,
        language: detectLanguage
    };
    
})();
