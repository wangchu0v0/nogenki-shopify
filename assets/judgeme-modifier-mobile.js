// Judge.me Review Modifier - Mobile Optimized
// 移动端优化版本：强化移动端适配，提高处理速度和成功率

(function() {
    'use strict';
    
    // 配置参数
    const CONFIG = {
        maxRetries: 20,             // 增加重试次数
        retryInterval: 50,          // 减少重试间隔以提高速度
        observerConfig: { childList: true, subtree: true },
        selectors: {
            badge: '.jdgm-prev-badge__text',
            widget: '.jdgm-widget',
            productBadge: '.jdgm-prev-badge', // 产品评价徽章
            reviewCount: '[data-number-of-reviews]' // 使用属性选择器
        },
        skipMobile: false           // 不跳过移动设备
    };
    
    let modificationCount = 0;
    let retryCount = 0;
    let isMobileDevice = false;
    
    // 检测是否为移动设备
    function checkMobileDevice() {
        isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobileDevice) {
            console.log('📱 检测到移动设备');
        }
    }
    
    // 高性能文字替换函数 - 增强版
    function optimizedTextReplace(element) {
        if (element.hasAttribute('data-judgeme-modified')) return false;
        
        // 获取文本内容并修整
        const text = element.textContent.trim();
        
        // 支持多语言的正则匹配
        const reviewMatch = text.match(/(\d+)[\s\u00A0]*(?:件のレビュー|reviews?|个评价|則評價|review)/i);
        
        if (reviewMatch) {
            const count = reviewMatch[1];
            
            // 简化处理方式，直接设置内容
            element.textContent = `(${count})`;
            element.setAttribute('data-judgeme-modified', 'true');
            
            // 使用内联样式确保在移动端生效
            element.style.cssText = `
                font-size: 10px !important;
                font-family: "Libre Baskerville", serif !important;
                color: #666 !important;
                transform: translateY(-1px) !important;
                line-height: 1 !important;
                visibility: visible !important;
                display: inline !important;
                text-indent: 0 !important;
            `;
            
            return true;
        }
        
        // 尝试检查是否有数量属性
        const countAttr = element.getAttribute('data-number-of-reviews');
        if (countAttr) {
            element.textContent = `(${countAttr})`;
            element.setAttribute('data-judgeme-modified', 'true');
            element.style.cssText = `
                font-size: 10px !important;
                font-family: "Libre Baskerville", serif !important;
                color: #666 !important;
                transform: translateY(-1px) !important;
                line-height: 1 !important;
                visibility: visible !important;
                display: inline !important;
                text-indent: 0 !important;
            `;
            return true;
        }
        
        return false;
    }
    
    // 即时处理函数（增强型）
    function immediateProcess() {
        // 尝试多种选择器以提高成功率
        const allSelectors = [
            CONFIG.selectors.badge,
            '.jdgm-prev-badge [data-number-of-reviews]',
            '.jdgm-preview-badge__text',
            '.jdgm-rev-widg__reviews-count'
        ];
        
        let processed = 0;
        
        // 尝试每一个选择器
        allSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (optimizedTextReplace(element)) {
                    processed++;
                }
            });
        });
        
        // 特殊处理：如果没有找到元素，尝试处理整个徽章区域
        if (processed === 0) {
            const badges = document.querySelectorAll(CONFIG.selectors.productBadge);
            badges.forEach(badge => {
                // 检查是否有徽章但没有修改过的文本
                const badgeText = badge.querySelector('.jdgm-prev-badge__text');
                if (badgeText && !badgeText.hasAttribute('data-judgeme-modified')) {
                    // 查找评价数量
                    const countElement = badge.querySelector('[data-number-of-reviews]');
                    const countAttr = countElement ? countElement.getAttribute('data-number-of-reviews') : null;
                    
                    if (countAttr) {
                        badgeText.textContent = `(${countAttr})`;
                        badgeText.setAttribute('data-judgeme-modified', 'true');
                        badgeText.style.cssText = `
                            font-size: 10px !important;
                            font-family: "Libre Baskerville", serif !important;
                            color: #666 !important; 
                            transform: translateY(-1px) !important;
                            line-height: 1 !important;
                            visibility: visible !important;
                            display: inline !important;
                            text-indent: 0 !important;
                        `;
                        processed++;
                    }
                }
            });
        }
        
        if (processed > 0) {
            console.log(`✅ 即时处理了 ${processed} 个评价元素`);
            modificationCount += processed;
        }
        
        return processed;
    }
    
    // 增强型DOM变化观察器
    function createObserver() {
        const observer = new MutationObserver((mutations) => {
            let hasNewNodes = false;
            
            mutations.forEach(mutation => {
                // 检查新增节点
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // 直接检查
                        if (node.matches && node.matches(CONFIG.selectors.badge) && optimizedTextReplace(node)) {
                            hasNewNodes = true;
                            modificationCount++;
                            return;
                        }
                        
                        // 检查子节点
                        if (node.querySelectorAll) {
                            const elements = node.querySelectorAll(CONFIG.selectors.badge);
                            elements.forEach(element => {
                                if (optimizedTextReplace(element)) {
                                    hasNewNodes = true;
                                    modificationCount++;
                                }
                            });
                        }
                    }
                });
                
                // 检查修改的属性 - 处理动态加载的情况
                if (mutation.type === 'attributes') {
                    const element = mutation.target;
                    if (element.matches && element.matches(CONFIG.selectors.badge)) {
                        if (optimizedTextReplace(element)) {
                            hasNewNodes = true;
                            modificationCount++;
                        }
                    }
                }
            });
            
            if (hasNewNodes) {
                console.log(`🔄 动态处理了新的评价元素，总计: ${modificationCount}`);
            }
        });
        
        // 观察整个body，确保捕获所有变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'data-number-of-reviews', 'style']
        });
        
        return observer;
    }
    
    // 初始化函数 - 延迟多次尝试
    function initialize() {
        if (CONFIG.skipMobile && isMobileDevice) {
            console.log('📱 移动设备，跳过处理');
            return;
        }
        
        console.log('🚀 Judge.me移动端优化修改器启动');
        
        // 立即处理已存在的元素
        const immediateCount = immediateProcess();
        
        // 如果没有找到元素，进行重试
        if (immediateCount === 0 && retryCount < CONFIG.maxRetries) {
            retryCount++;
            console.log(`⏱️ 重试中... (${retryCount}/${CONFIG.maxRetries})`);
            setTimeout(initialize, CONFIG.retryInterval);
            return;
        }
        
        // 启动观察器监听新添加的元素
        createObserver();
        
        // 定时检查 - 确保处理完整
        for (let i = 1; i <= 5; i++) {
            setTimeout(() => {
                const finalCount = immediateProcess();
                if (finalCount > 0) {
                    console.log(`🔧 定时检查 #${i} 处理了 ${finalCount} 个元素`);
                }
            }, i * 500);
        }
        
        // 最终检查
        setTimeout(() => {
            const finalCount = immediateProcess();
            if (finalCount > 0) {
                console.log(`🔍 最终检查处理了 ${finalCount} 个元素`);
            }
            console.log(`📊 总计处理: ${modificationCount} 个评价元素`);
        }, 3000);
    }
    
    // 检测设备类型
    checkMobileDevice();
    
    // 优化启动时机，确保最早处理
    if (document.readyState === 'loading') {
        // DOM还在加载中
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initialize, 0);  // 微任务队列确保尽快执行
        });
    } else {
        // DOM已加载完成
        setTimeout(initialize, 0);
    }
    
    // 安全兜底：如果页面加载时间过长，确保执行
    window.addEventListener('load', () => {
        if (modificationCount === 0) {
            console.log('⚠️ 页面加载完成后未检测到修改，尝试再次处理');
            setTimeout(initialize, 100);
        }
    });
    
})();
