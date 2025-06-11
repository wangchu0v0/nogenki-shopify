// Judge.me Review Text Modifier - Multi-Language Support
// 支持多语言的Judge.me评价修改器

(function() {
    'use strict';
    
    console.log('🌍 Judge.me多语言修改器启动');
    
    const MODIFIED_ATTR = 'data-judgeme-modified';
    let modificationCount = 0;
    
    // 注入全局样式
    function injectGlobalStyles() {
        const styleId = 'judgeme-multilang-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* 评价文字样式 - 括号格式 */
                .jdgm-prev-badge__text {
                    font-size: 12px !important;
                    color: #666 !important;
                    line-height: 1 !important;
                    vertical-align: middle !important;
                    margin-left: 4px !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
                    font-weight: 400 !important;
                    display: inline-flex !important;
                    align-items: center !important;
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
                
                .jdgm-prev-badge {
                    display: flex !important;
                    align-items: center !important;
                    gap: 6px !important;
                }
                
                /* 响应式调整 */
                @media screen and (max-width: 768px) {
                    .jdgm-prev-badge__text {
                        font-size: 12px !important;
                    }
                    .jdgm-star {
                        font-size: 14px !important;
                    }
                }
                
                @media screen and (max-width: 480px) {
                    .jdgm-prev-badge__text {
                        font-size: 12px !important;
                    }
                    .jdgm-star {
                        font-size: 13px !important;
                    }
                }
            `;
            document.head.appendChild(style);
            console.log('✅ 注入多语言样式');
        }
    }

    // 多语言文本修改函数
    function modifyReviewText() {
        injectGlobalStyles();
        
        let count = 0;
        
        // 多语言支持的文本模式
        const reviewPatterns = [
            // 日语
            { pattern: /(\d+)件のレビュー/, lang: 'ja' },
            { pattern: /(\d+)のレビュー/, lang: 'ja' },
            
            // 英语
            { pattern: /(\d+)\s*reviews?$/i, lang: 'en' },
            { pattern: /(\d+)\s*review\(s\)$/i, lang: 'en' },
            { pattern: /(\d+)\s*customer\s*reviews?$/i, lang: 'en' },
            { pattern: /Based on (\d+) reviews?$/i, lang: 'en' },
            { pattern: /(\d+)\s*verified reviews?$/i, lang: 'en' },
            
            // 法语
            { pattern: /(\d+)\s*avis$/i, lang: 'fr' },
            
            // 意大利语
            { pattern: /(\d+)\s*recensioni$/i, lang: 'it' },
            
            // 德语
            { pattern: /(\d+)\s*bewertungen$/i, lang: 'de' },
            
            // 西班牙语
            { pattern: /(\d+)\s*reseñas$/i, lang: 'es' },
            
            // 通用数字模式（作为后备）
            { pattern: /(\d+)/, lang: 'generic' }
        ];
        
        // 查找所有可能的Judge.me元素选择器
        const selectors = [
            '.jdgm-prev-badge__text',
            '.jdgm-preview-badge .jdgm-prev-badge__text',
            '.jdgm-widget .jdgm-prev-badge__text',
            '[class*="jdgm"][class*="text"]',
            '[class*="review"][class*="count"]',
            '[class*="review"][class*="text"]'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector + ':not([' + MODIFIED_ATTR + '])');
            
            elements.forEach(element => {
                const originalText = element.textContent.trim();
                
                if (!originalText || originalText.length === 0) return;
                
                let matched = false;
                
                // 尝试匹配各种语言模式
                for (const { pattern, lang } of reviewPatterns) {
                    const match = originalText.match(pattern);
                    if (match && match[1]) {
                        const reviewCount = match[1];
                        const newText = `(${reviewCount})`;
                        
                        // 跳过已经是括号格式的
                        if (originalText === newText) {
                            element.setAttribute(MODIFIED_ATTR, 'true');
                            matched = true;
                            break;
                        }
                        
                        element.textContent = newText;
                        element.setAttribute(MODIFIED_ATTR, 'true');
                        element.style.cssText = `
                            font-size: 12px !important;
                            color: #666 !important;
                            line-height: 1 !important;
                            vertical-align: middle !important;
                            margin-left: 4px !important;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
                            font-weight: 400 !important;
                            display: inline-flex !important;
                            align-items: center !important;
                        `;
                        
                        count++;
                        console.log(`✅ [${lang}] 修改: "${originalText}" → "${newText}"`);
                        matched = true;
                        break;
                    }
                }
                
                // 如果元素包含数字但没有匹配到特定模式，且看起来像评价文本
                if (!matched && /\d+/.test(originalText) && originalText.length < 50) {
                    const numberMatch = originalText.match(/(\d+)/);
                    if (numberMatch) {
                        const newText = `(${numberMatch[1]})`;
                        
                        // 跳过已经是括号格式的
                        if (originalText !== newText) {
                            element.textContent = newText;
                            element.setAttribute(MODIFIED_ATTR, 'true');
                            element.style.cssText = `
                                font-size: 12px !important;
                                color: #666 !important;
                                line-height: 1 !important;
                                vertical-align: middle !important;
                                margin-left: 4px !important;
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
                                font-weight: 400 !important;
                                display: inline-flex !important;
                                align-items: center !important;
                            `;
                            count++;
                            console.log(`✅ [通用] 修改: "${originalText}" → "${newText}"`);
                        }
                    }
                }
            });
        });
        
        // 深度搜索 - 查找动态加载的内容
        if (count === 0) {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        const text = node.textContent.trim();
                        if (!text || text.length === 0 || text.length > 100) return NodeFilter.FILTER_REJECT;
                        
                        // 检查是否包含评价相关的文本
                        const hasReviewKeywords = /reviews?|avis|recensioni|bewertungen|reseñas|のレビュー/i.test(text);
                        const hasNumbers = /\d+/.test(text);
                        const isJudgemeElement = node.parentElement && (
                            node.parentElement.className.includes('jdgm') ||
                            node.parentElement.closest('[class*="jdgm"]')
                        );
                        
                        return (hasReviewKeywords || isJudgemeElement) && hasNumbers && 
                               !node.parentElement.hasAttribute(MODIFIED_ATTR) ? 
                               NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
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
                
                for (const { pattern, lang } of reviewPatterns) {
                    const match = originalText.match(pattern);
                    if (match && match[1]) {
                        const reviewCount = match[1];
                        const newText = `(${reviewCount})`;
                        
                        if (originalText !== newText) {
                            const span = document.createElement('span');
                            span.textContent = newText;
                            span.setAttribute(MODIFIED_ATTR, 'true');
                            span.style.cssText = `
                                font-size: 12px !important;
                                color: #666 !important;
                                line-height: 1 !important;
                                vertical-align: middle !important;
                                margin-left: 4px !important;
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
                                font-weight: 400 !important;
                                display: inline-flex !important;
                                align-items: center !important;
                            `;
                            
                            textNode.parentElement.replaceChild(span, textNode);
                            count++;
                            console.log(`✅ [深度-${lang}] 修改: "${originalText}" → "${newText}"`);
                            break;
                        }
                    }
                }
            });
        }
        
        if (count > 0) {
            modificationCount += count;
            console.log(`🎉 本次修改了 ${count} 个评价文本，总计: ${modificationCount}`);
        }
        
        return count;
    }

    // 初始化修改器
    function initModifier() {
        console.log('🚀 启动多语言Judge.me修改器...');
        
        // 立即执行
        modifyReviewText();
        
        // 分阶段延迟执行
        setTimeout(modifyReviewText, 500);
        setTimeout(modifyReviewText, 1500);
        setTimeout(modifyReviewText, 3000);
        
        let lastModification = Date.now();
        
        // DOM变化监听
        const observer = new MutationObserver(function(mutations) {
            // 避免频繁触发
            if (Date.now() - lastModification < 800) return;
            
            let shouldModify = false;
            
            mutations.forEach(mutation => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const text = node.textContent || '';
                            if (text.includes('review') || text.includes('avis') || 
                                text.includes('のレビュー') || node.querySelector && 
                                node.querySelector('[class*="jdgm"]')) {
                                shouldModify = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldModify) {
                lastModification = Date.now();
                setTimeout(modifyReviewText, 300);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 定期检查未修改的元素
        setInterval(function() {
            const selectors = [
                '.jdgm-prev-badge__text:not([' + MODIFIED_ATTR + '])',
                '[class*="jdgm"][class*="text"]:not([' + MODIFIED_ATTR + '])'
            ];
            
            let hasUnmodified = false;
            selectors.forEach(selector => {
                if (document.querySelectorAll(selector).length > 0) {
                    hasUnmodified = true;
                }
            });
            
            if (hasUnmodified) {
                console.log('🔄 发现未修改元素，执行修复...');
                modifyReviewText();
            }
        }, 8000);
        
        // 页面焦点恢复时检查
        window.addEventListener('focus', function() {
            setTimeout(modifyReviewText, 500);
        });
        
        // Judge.me特定事件监听
        const judgemeEvents = ['judgeme_loaded', 'judgeme_rendered', 'judgeme_widget_loaded'];
        judgemeEvents.forEach(event => {
            window.addEventListener(event, function() {
                console.log(`🎯 检测到Judge.me事件: ${event}`);
                setTimeout(modifyReviewText, 300);
            });
        });
        
        console.log('✅ 多语言修改器初始化完成');
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModifier);
    } else {
        initModifier();
    }
    
    // 导出到全局以便调试
    window.judgemeMultilangModifier = {
        modify: modifyReviewText,
        count: () => modificationCount
    };
    
})();
