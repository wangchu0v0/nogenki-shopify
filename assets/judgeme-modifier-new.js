// Judge.me Review Text Modifier
// 修改评价文本显示：移除 "のレビュー"，只保留数字和"件"

(function() {
  console.log('Judge.me修改器开始执行');
  
  function modifyJudgemeText() {
    console.log('开始查找Judge.me元素');
    
    // 显示所有隐藏的徽章
    const allBadges = document.querySelectorAll('.jdgm-prev-badge, .jdgm-widget');
    console.log('找到徽章数量:', allBadges.length);
    
    allBadges.forEach(function(badge) {
      if (badge.style.display === 'none' || getComputedStyle(badge).display === 'none') {
        badge.style.display = 'flex !important';
        badge.style.alignItems = 'center';
        badge.style.gap = '8px';
        badge.style.visibility = 'visible';
        console.log('显示了一个徽章');
      }
    });
    
    // 修改评价文本
    const reviewTexts = document.querySelectorAll('.jdgm-prev-badge__text');
    console.log('找到评价文本数量:', reviewTexts.length);
    
    reviewTexts.forEach(function(textElement, index) {
      console.log('处理第', index + 1, '个文本元素:', textElement);
      
      if (textElement && !textElement.classList.contains('text-modified')) {
        const originalText = textElement.textContent || textElement.innerText;
        console.log('原始文本:', originalText);
          // 提取数字部分
        const numberMatch = originalText.match(/(\d+)/);
        if (numberMatch) {
          const reviewCount = numberMatch[1];
          const newText = reviewCount + '件';
          
          // 强制修改文本
          textElement.textContent = newText;
          textElement.innerText = newText;
          textElement.innerHTML = newText;
          
          textElement.classList.add('text-modified');
          
          // 调整样式：与星星高度对齐
          textElement.style.fontSize = '16px';  // 与星星大小匹配
          textElement.style.color = '#666';
          textElement.style.display = 'inline-block';
          textElement.style.lineHeight = '1';   // 与星星行高一致
          textElement.style.verticalAlign = 'baseline';  // 基线对齐
          textElement.style.marginLeft = '4px'; // 与星星保持适当间距
          
          console.log('文本已修改为:', newText);
        } else {
          console.log('未找到数字匹配:', originalText);
        }
      }
    });
  }

  function forceStarColor() {
    const stars = document.querySelectorAll('.jdgm-star');
    console.log('找到星星数量:', stars.length);
    
    stars.forEach(function(star) {
      star.style.setProperty('color', '#A889A8', 'important');
      if (star.classList.contains('jdgm--off')) {
        star.style.setProperty('color', '#e0e0e0', 'important');
      }
    });
  }

  // 立即执行一次
  modifyJudgemeText();
  forceStarColor();

  // DOM加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(modifyJudgemeText, 100);
      setTimeout(forceStarColor, 100);
    });
  }

  // 多次延迟执行，确保捕获动态加载的内容
  setTimeout(function() {
    modifyJudgemeText();
    forceStarColor();
  }, 500);

  setTimeout(function() {
    modifyJudgemeText();
    forceStarColor();
  }, 1000);

  setTimeout(function() {
    modifyJudgemeText();
    forceStarColor();
  }, 2000);

  setTimeout(function() {
    modifyJudgemeText();
    forceStarColor();
  }, 3000);

  setTimeout(function() {
    modifyJudgemeText();
    forceStarColor();
  }, 5000);

  // 监听DOM变化
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      let shouldProcess = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && (
                node.classList.contains('jdgm-widget') ||
                node.classList.contains('jdgm-prev-badge') ||
                node.querySelector('.jdgm-prev-badge__text') ||
                node.querySelector('.jdgm-star')
            )) {
              shouldProcess = true;
            }
          });
        }
      });
      
      if (shouldProcess) {
        setTimeout(function() {
          modifyJudgemeText();
          forceStarColor();
        }, 100);
      }
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // 定期检查（最后的备用方案）
  setInterval(function() {
    modifyJudgemeText();
    forceStarColor();
  }, 5000);

})();
