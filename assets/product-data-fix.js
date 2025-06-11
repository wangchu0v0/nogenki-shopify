/**
 * Product Data Localization Fix
 * Fixes product names and descriptions showing in wrong language
 * Version: 1.0.0
 */

(function() {
  'use strict';

  class ProductDataFix {
    constructor() {
      this.currentLang = document.documentElement.lang || 'ja';
      this.isEnglishMarket = this.currentLang.startsWith('en');
      this.productDataCache = new Map();
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupProductDataFix());
      } else {
        this.setupProductDataFix();
      }
    }

    setupProductDataFix() {
      this.extractProductData();
      this.fixProductTitles();
      this.fixProductDescriptions();
      this.fixProductOptions();
      this.monitorProductChanges();
    }

    extractProductData() {
      // Extract product data from various sources
      this.extractFromMeta();
      this.extractFromJsonLd();
      this.extractFromShopifyObject();
      this.extractFromDataAttributes();
    }

    extractFromMeta() {
      const metaTags = document.querySelectorAll('meta[property^="og:"], meta[name^="product"]');
      metaTags.forEach(meta => {
        const property = meta.getAttribute('property') || meta.getAttribute('name');
        const content = meta.getAttribute('content');
        
        if (property && content) {
          this.productDataCache.set(property, content);
        }
      });
    }

    extractFromJsonLd() {
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      jsonLdScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          if (data['@type'] === 'Product') {
            this.productDataCache.set('jsonld-product', data);
          }
        } catch (e) {
          console.warn('Failed to parse JSON-LD:', e);
        }
      });
    }

    extractFromShopifyObject() {
      // Check if Shopify product data is available
      if (window.meta && window.meta.product) {
        this.productDataCache.set('shopify-product', window.meta.product);
      }

      // Check for product data in global variables
      if (window.product) {
        this.productDataCache.set('window-product', window.product);
      }
    }

    extractFromDataAttributes() {
      const productElements = document.querySelectorAll('[data-product-id], [data-product-title], [data-product-handle]');
      productElements.forEach(element => {
        const productId = element.getAttribute('data-product-id');
        const productTitle = element.getAttribute('data-product-title');
        const productHandle = element.getAttribute('data-product-handle');
        
        if (productId || productTitle || productHandle) {
          this.productDataCache.set('element-data', { productId, productTitle, productHandle });
        }
      });
    }

    fixProductTitles() {
      if (!this.isEnglishMarket) return;

      const titleSelectors = [
        '.product__title',
        '.product-title',
        'h1[class*="product"]',
        'h1[class*="title"]',
        '.card__heading a',
        '.product-item__title'
      ];

      titleSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => this.fixSingleTitle(element));
      });
    }

    fixSingleTitle(element) {
      const currentText = element.textContent.trim();
      
      if (this.containsJapanese(currentText)) {
        const englishTitle = this.findEnglishTitle(element);
        if (englishTitle && englishTitle !== currentText) {
          element.textContent = englishTitle;
          element.setAttribute('data-original-title', currentText);
          element.classList.add('localized-fixed');
        }
      }
    }

    findEnglishTitle(element) {
      // Try multiple sources for English title
      const sources = [
        () => element.getAttribute('data-english-title'),
        () => element.getAttribute('data-en-title'),
        () => element.getAttribute('title'),
        () => this.getFromMetaTags(),
        () => this.getFromJsonLd(),
        () => this.getFromProductHandle(element),
        () => this.translateTitle(element.textContent)
      ];

      for (let source of sources) {
        const title = source();
        if (title && !this.containsJapanese(title)) {
          return title;
        }
      }

      return null;
    }

    getFromMetaTags() {
      return this.productDataCache.get('og:title') || 
             this.productDataCache.get('product:name');
    }

    getFromJsonLd() {
      const jsonData = this.productDataCache.get('jsonld-product');
      return jsonData && jsonData.name ? jsonData.name : null;
    }

    getFromProductHandle(element) {
      // Try to construct English title from product handle
      const productLink = element.closest('a') || element.querySelector('a');
      if (productLink && productLink.href) {
        const url = new URL(productLink.href);
        const handle = url.pathname.split('/').pop();
        
        if (handle) {
          // Convert handle to readable title
          return handle
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        }
      }
      return null;
    }

    translateTitle(japaneseTitle) {
      // Basic translation mappings for common product terms
      const translations = {
        '浴衣': 'Yukata',
        'きもの': 'Kimono',
        '着物': 'Kimono',
        'セット': 'Set',
        'レディース': 'Women\'s',
        'メンズ': 'Men\'s',
        '夏': 'Summer',
        '春': 'Spring',
        '秋': 'Autumn',
        '冬': 'Winter',
        '綿': 'Cotton',
        'シルク': 'Silk',
        '花柄': 'Floral Pattern',
        '無地': 'Plain',
        'サイズ': 'Size',
        'カラー': 'Color',
        'ブラック': 'Black',
        'ホワイト': 'White',
        'レッド': 'Red',
        'ブルー': 'Blue',
        'ピンク': 'Pink'
      };

      let translated = japaneseTitle;
      
      Object.entries(translations).forEach(([japanese, english]) => {
        translated = translated.replace(new RegExp(japanese, 'g'), english);
      });

      // If translation made significant changes, return it
      if (translated !== japaneseTitle && !this.containsJapanese(translated)) {
        return translated;
      }

      return null;
    }

    fixProductDescriptions() {
      if (!this.isEnglishMarket) return;

      const descriptionSelectors = [
        '.product__description',
        '.product-description',
        '.rte',
        '[class*="description"]'
      ];

      descriptionSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (this.containsJapanese(element.textContent)) {
            const englishDescription = this.findEnglishDescription(element);
            if (englishDescription) {
              element.innerHTML = englishDescription;
              element.classList.add('localized-fixed');
            }
          }
        });
      });
    }

    findEnglishDescription(element) {
      // Try to find English description from various sources
      const jsonData = this.productDataCache.get('jsonld-product');
      if (jsonData && jsonData.description && !this.containsJapanese(jsonData.description)) {
        return jsonData.description;
      }

      const ogDescription = this.productDataCache.get('og:description');
      if (ogDescription && !this.containsJapanese(ogDescription)) {
        return ogDescription;
      }

      // If no English description found, hide the description for now
      return '<p><em>Product description will be available soon.</em></p>';
    }

    fixProductOptions() {
      if (!this.isEnglishMarket) return;

      // Fix variant option names (Size, Color, etc.)
      const optionElements = document.querySelectorAll(
        '.product-form__input label, .variant-picker label, [class*="option"] label'
      );

      optionElements.forEach(label => {
        const text = label.textContent.trim();
        if (this.containsJapanese(text)) {
          const englishOption = this.translateOptionName(text);
          if (englishOption) {
            label.textContent = englishOption;
            label.classList.add('localized-fixed');
          }
        }
      });

      // Fix variant option values
      const optionValues = document.querySelectorAll(
        '.product-form__input option, .variant-picker option, [class*="swatch"] [data-value]'
      );

      optionValues.forEach(option => {
        const text = option.textContent || option.getAttribute('data-value');
        if (text && this.containsJapanese(text)) {
          const englishValue = this.translateOptionValue(text);
          if (englishValue) {
            if (option.textContent) option.textContent = englishValue;
            if (option.getAttribute('data-value')) option.setAttribute('data-value', englishValue);
            option.classList.add('localized-fixed');
          }
        }
      });
    }

    translateOptionName(japaneseOption) {
      const optionTranslations = {
        'サイズ': 'Size',
        'カラー': 'Color',
        '色': 'Color',
        '柄': 'Pattern',
        '素材': 'Material',
        'スタイル': 'Style'
      };

      return optionTranslations[japaneseOption] || null;
    }

    translateOptionValue(japaneseValue) {
      const valueTranslations = {
        // Sizes
        'フリーサイズ': 'Free Size',
        'Sサイズ': 'Small',
        'Mサイズ': 'Medium', 
        'Lサイズ': 'Large',
        'XLサイズ': 'X-Large',
        
        // Colors
        'ブラック': 'Black',
        'ホワイト': 'White',
        'レッド': 'Red',
        'ブルー': 'Blue',
        'グリーン': 'Green',
        'イエロー': 'Yellow',
        'ピンク': 'Pink',
        'パープル': 'Purple',
        'グレー': 'Gray',
        'ベージュ': 'Beige',
        'ネイビー': 'Navy',
        
        // Patterns
        '花柄': 'Floral',
        '無地': 'Plain',
        'ストライプ': 'Stripe',
        'チェック': 'Check',
        '和柄': 'Traditional Pattern'
      };

      return valueTranslations[japaneseValue] || null;
    }

    containsJapanese(text) {
      return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    }

    monitorProductChanges() {
      // Monitor for AJAX product updates
      const observer = new MutationObserver((mutations) => {
        let productContentChanged = false;

        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches && (
                  node.matches('.product__title, .product__description, .product-form__input') ||
                  node.querySelector('.product__title, .product__description, .product-form__input')
                )) {
                  productContentChanged = true;
                }
              }
            });
          }
          
          if (mutation.type === 'characterData' || mutation.type === 'attributes') {
            const target = mutation.target;
            if (target.nodeType === Node.ELEMENT_NODE || target.parentElement) {
              const element = target.nodeType === Node.ELEMENT_NODE ? target : target.parentElement;
              if (element.matches && element.matches('.product__title, .product__description')) {
                productContentChanged = true;
              }
            }
          }
        });

        if (productContentChanged) {
          // Debounce the fixes
          clearTimeout(this.productFixTimeout);
          this.productFixTimeout = setTimeout(() => {
            this.fixProductTitles();
            this.fixProductDescriptions();
            this.fixProductOptions();
          }, 300);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['data-product-id', 'data-product-title']
      });
    }
  }

  // Initialize the product data fix
  new ProductDataFix();

  // Expose for manual use
  window.ProductDataFix = ProductDataFix;

})();
