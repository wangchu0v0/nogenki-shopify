// 超级强制版 Judge.me 修改器
// 使用最直接的方法确保修改生效

(function() {
  'use strict';
  
  console.log('🚀 超级强制版Judge.me修改器启动');
  
  function forceModifyAllText() {
    let modifiedCount = 0;
    
    // 方法1: 查找所有包含"のレビュー"的元素
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      if (element.textContent && element.textContent.includes('のレビュー') && element.children.length === 0) {
        const originalText = element.textContent.trim();
        const numberMatch = originalText.match(/(\d+)/);
        
        if (numberMatch) {
          const newText = '(' + numberMatch[1] + ')';
          
          // 强制修改文本
          element.textContent = newText;
          element.innerText = newText;
          element.innerHTML = newText;
          
          // 超级强制样式
          element.style.setProperty('font-size', '12px', 'important');
          element.style.setProperty('color', '#666', 'important');
          element.style.setProperty('line-height', '1', 'important');
          element.style.setProperty('vertical-align', 'baseline', 'important');
          element.style.setProperty('display', 'inline-block', 'important');
          
          // 添加标记避免重复处理
          element.setAttribute('data-modified', 'true');
          
          modifiedCount++;
          console.log('✅ 强制修改:', originalText, '→', newText);
          console.log('📐 应用样式: font-size=12px, color=#666');
          
          // 验证修改结果
          setTimeout(() => {
            const computedStyle = getComputedStyle(element);
            console.log('🔍 验证结果 - 字体大小:', computedStyle.fontSize, '颜色:', computedStyle.color);
          }, 50);
        }
      }
    });
    
    // 方法2: 专门处理Judge.me元素
    const judgemeSelectors = [
      '.jdgm-prev-badge__text',
      '.jdgm-widget .jdgm-prev-badge__text',
      '[class*="jdgm"] span',
      '.jdgm-prev-badge span'
    ];
    
    judgemeSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.textContent && element.textContent.includes('のレビュー') && !element.hasAttribute('data-modified')) {
          const originalText = element.textContent.trim();
          const numberMatch = originalText.match(/(\d+)/);
          
          if (numberMatch) {
            const newText = '(' + numberMatch[1] + ')';
            
            // 强制修改
            element.textContent = newText;
            element.style.setProperty('font-size', '12px', 'important');
            element.style.setProperty('color', '#666', 'important');
            element.style.setProperty('line-height', '1', 'important');
            element.setAttribute('data-modified', 'true');
            
            modifiedCount++;
            console.log('✅ Judge.me修改:', originalText, '→', newText);
          }
        }
      });
    });
    
    if (modifiedCount > 0) {
      console.log('🎉 总共强制修改了', modifiedCount, '处文本');
    } else {
      console.log('🔍 未找到需要修改的文本');
    }
    
    return modifiedCount;
  }
  
  // 强制修改星星颜色
  function forceStarColors() {
    const stars = document.querySelectorAll('.jdgm-star, [class*="star"]');
    stars.forEach(star => {
      if (!star.classList.contains('jdgm--off')) {
        star.style.setProperty('color', '#A889A8', 'important');
      } else {
        star.style.setProperty('color', '#e0e0e0', 'important');
      }
    });
    
    if (stars.length > 0) {
      console.log('⭐ 修改了', stars.length, '个星星颜色');
    }
  }
  
  // 执行修改
  function executeForceModification() {
    console.log('💪 开始强制执行修改...');
    const textChanges = forceModifyAllText();
    forceStarColors();
    return textChanges;
  }
  
  // 立即执行
  executeForceModification();
  
  // 延迟执行多次
  [100, 500, 1000, 2000, 3000, 5000].forEach(delay => {
    setTimeout(() => {
      console.log(`⏰ ${delay}ms后重新执行...`);
      executeForceModification();
    }, delay);
  });
  
  // DOM监听
  const observer = new MutationObserver(function(mutations) {
    let shouldProcess = false;
    
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && (
              (node.textContent && node.textContent.includes('のレビュー')) ||
              node.classList.contains('jdgm-widget') ||
              node.classList.contains('jdgm-prev-badge') ||
              node.querySelector && node.querySelector('[class*="jdgm"]')
            )) {
            shouldProcess = true;
          }
        });
      }
    });
    
    if (shouldProcess) {
      console.log('🔄 检测到内容变化，重新执行强制修改...');
      setTimeout(executeForceModification, 100);
    }
  });
  
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 定期强制检查
  setInterval(() => {
    console.log('🔄 定期强制检查...');
    executeForceModification();
  }, 8000);
  
  console.log('🎯 超级强制版修改器初始化完成');
})();
