// Judge.me调试器 - 找出英语界面问题的根源
// 这个脚本会记录所有相关信息，帮助我们找到真正的问题

(function() {
    'use strict';
    
    console.log('🔍 Judge.me调试器启动 - 分析英语界面问题');
    
    let debugInfo = {
        foundElements: [],
        processedElements: [],
        missedElements: [],
        timingInfo: []
    };
    
    // 记录时间戳
    function logTiming(event) {
        debugInfo.timingInfo.push({
            time: Date.now(),
            event: event,
            timestamp: new Date().toLocaleTimeString()
        });
        console.log(`⏰ ${event} - ${new Date().toLocaleTimeString()}`);
    }
    
    // 深度扫描所有可能的Judge.me元素
    function scanAllJudgemeElements() {
        logTiming('开始扫描所有Judge.me元素');
        
        // 扩展选择器列表
        const selectors = [
            '.jdgm-prev-badge__text',
            '.jdgm-preview-badge .jdgm-prev-badge__text',
            '.jdgm-widget .jdgm-prev-badge__text',
            '[class*="jdgm"][class*="text"]',
            '[class*="review"][class*="count"]',
            '[class*="review"][class*="text"]',
            '.judgeme-review-count',
            '.review-count',
            '.product-review-count',
            '*[class*="badge"]',
            '*[class*="review"]'
        ];
        
        let allFound = [];
        
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                console.log(`🎯 选择器 "${selector}" 找到 ${elements.length} 个元素`);
                
                elements.forEach((element, index) => {
                    const text = element.textContent.trim();
                    if (text && /\d+/.test(text)) {
                        const info = {
                            selector: selector,
                            index: index,
                            text: text,
                            className: element.className,
                            tagName: element.tagName,
                            id: element.id,
                            parentClass: element.parentElement ? element.parentElement.className : '',
                            computedStyle: {
                                display: getComputedStyle(element).display,
                                visibility: getComputedStyle(element).visibility,
                                opacity: getComputedStyle(element).opacity
                            }
                        };
                        
                        allFound.push(info);
                        console.log(`📍 发现元素: "${text}" (类名: ${element.className})`);
                    }
                });
            } catch (e) {
                console.log(`❌ 选择器 "${selector}" 出错:`, e.message);
            }
        });
        
        debugInfo.foundElements = allFound;
        return allFound;
    }
    
    // 分析文本模式
    function analyzeTextPatterns() {
        logTiming('分析文本模式');
        
        const patterns = [
            { name: '日语模式', regex: /(\d+)件のレビュー/i },
            { name: '英语reviews', regex: /(\d+)\s*reviews?$/i },
            { name: '英语customer', regex: /(\d+)\s*customer\s*reviews?/i },
            { name: '英语review(s)', regex: /(\d+)\s*review\(s\)/i },
            { name: '英语based on', regex: /based\s*on\s*(\d+)\s*reviews?/i },
            { name: '通用数字', regex: /(\d+)/ }
        ];
        
        debugInfo.foundElements.forEach(element => {
            const text = element.text;
            let matched = false;
            
            patterns.forEach(pattern => {
                const match = text.match(pattern.regex);
                if (match) {
                    console.log(`✅ "${text}" 匹配 ${pattern.name} - 提取数字: ${match[1]}`);
                    element.matchedPattern = pattern.name;
                    element.extractedNumber = match[1];
                    matched = true;
                }
            });
            
            if (!matched) {
                console.log(`❌ "${text}" 没有匹配任何模式`);
                debugInfo.missedElements.push(element);
            }
        });
    }
    
    // 检查元素可见性
    function checkVisibility() {
        logTiming('检查元素可见性');
        
        debugInfo.foundElements.forEach(element => {
            const el = document.querySelector(`.${element.className.split(' ')[0]}`);
            if (el) {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0 && 
                                el.offsetParent !== null &&
                                getComputedStyle(el).visibility !== 'hidden' &&
                                getComputedStyle(el).display !== 'none';
                
                element.isVisible = isVisible;
                element.boundingRect = rect;
                
                console.log(`👁️ 元素 "${element.text}" 可见性: ${isVisible ? '✅' : '❌'}`);
            }
        });
    }
    
    // 模拟处理过程
    function simulateProcessing() {
        logTiming('模拟处理过程');
        
        debugInfo.foundElements.forEach(element => {
            if (element.extractedNumber) {
                const newText = `(${element.extractedNumber})`;
                console.log(`🔄 模拟处理: "${element.text}" → "${newText}"`);
                element.proposedChange = newText;
            }
        });
    }
    
    // 生成报告
    function generateReport() {
        logTiming('生成调试报告');
        
        console.log('\n📊 ===== Judge.me调试报告 =====');
        console.log(`🔍 总共发现 ${debugInfo.foundElements.length} 个相关元素`);
        console.log(`✅ 成功匹配 ${debugInfo.foundElements.filter(e => e.matchedPattern).length} 个`);
        console.log(`❌ 未匹配 ${debugInfo.missedElements.length} 个`);
        
        console.log('\n📝 详细信息:');
        debugInfo.foundElements.forEach((element, index) => {
            console.log(`\n${index + 1}. 文本: "${element.text}"`);
            console.log(`   选择器: ${element.selector}`);
            console.log(`   类名: ${element.className}`);
            console.log(`   匹配模式: ${element.matchedPattern || '无'}`);
            console.log(`   提取数字: ${element.extractedNumber || '无'}`);
            console.log(`   建议修改: ${element.proposedChange || '无'}`);
            console.log(`   可见性: ${element.isVisible ? '✅' : '❌'}`);
        });
        
        if (debugInfo.missedElements.length > 0) {
            console.log('\n❌ 未处理的元素:');
            debugInfo.missedElements.forEach(element => {
                console.log(`   "${element.text}" (${element.className})`);
            });
        }
        
        console.log('\n⏰ 时间线:');
        debugInfo.timingInfo.forEach(info => {
            console.log(`   ${info.timestamp}: ${info.event}`);
        });
        
        // 导出到全局变量便于检查
        window.judgemeDebugInfo = debugInfo;
        console.log('\n💾 调试信息已保存到 window.judgemeDebugInfo');
    }
    
    // 主执行函数
    function runDebugger() {
        logTiming('Judge.me调试器开始执行');
        
        // 立即执行一次
        scanAllJudgemeElements();
        analyzeTextPatterns();
        checkVisibility();
        simulateProcessing();
        
        // 延迟执行以捕获动态内容
        setTimeout(() => {
            console.log('\n🔄 延迟扫描 (1秒后)');
            scanAllJudgemeElements();
            analyzeTextPatterns();
            checkVisibility();
            simulateProcessing();
        }, 1000);
        
        setTimeout(() => {
            console.log('\n🔄 延迟扫描 (3秒后)');
            scanAllJudgemeElements();
            analyzeTextPatterns();
            checkVisibility();
            simulateProcessing();
            generateReport();
        }, 3000);
    }
    
    // 启动调试器
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runDebugger);
    } else {
        runDebugger();
    }
    
    // 监听页面变化
    const observer = new MutationObserver(() => {
        console.log('🔄 检测到DOM变化，重新扫描...');
        setTimeout(() => {
            scanAllJudgemeElements();
            analyzeTextPatterns();
        }, 100);
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
