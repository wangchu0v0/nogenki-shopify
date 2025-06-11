/**
 * Multilingual Market Fix for Nogenki Theme
 * Fixes issues with English/International markets:
 * - White background color inheritance
 * - Japanese product names on English pages
 * - Garbled price formats
 * Version: 1.0.0
 */

(function() {
  'use strict';

  class MultilingualFix {
    constructor() {
      this.currentLang = document.documentElement.lang || 'ja';
      this.isEnglishMarket = this.currentLang.startsWith('en');
      this.init();
    }

    init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.applyFixes());
      } else {
        this.applyFixes();
      }
    }

    applyFixes() {
      this.fixColorScheme();
      this.fixProductNames();
      this.fixPriceFormats();
      this.fixCurrencyDisplay();
      
      // Monitor for dynamic content changes
      this.observeChanges();
    }

    fixColorScheme() {
      const body = document.body;
      
      // Ensure proper color scheme is applied
      if (!body.classList.contains('gradient')) {
        body.classList.add('gradient');
      }
      
      // Check if body has any color scheme class
      const hasColorScheme = Array.from(body.classList).some(cls => cls.startsWith('color-'));
      
      if (!hasColorScheme) {
        // Apply default color scheme
        body.classList.add('color-scheme-1');
      }

      // Fix sections that might have lost their color schemes
      const sections = document.querySelectorAll('section, .section');
      sections.forEach(section => {
        if (!section.classList.contains('gradient') && !section.classList.contains('color-')) {
          section.classList.add('gradient');
        }
      });
    }

    fixProductNames() {
      if (!this.isEnglishMarket) return;

      // Find product titles that might be in Japanese
      const productTitles = document.querySelectorAll('.product__title, .card__heading, h1, h2, h3');
      
      productTitles.forEach(title => {
        const text = title.textContent;
        
        // Check if text contains Japanese characters
        if (this.containsJapanese(text)) {
          // Try to find English alternative in data attributes or meta tags
          const englishTitle = this.findEnglishAlternative(title);
          if (englishTitle) {
            title.textContent = englishTitle;
          }
        }
      });
    }

    fixPriceFormats() {
      if (!this.isEnglishMarket) return;

      // Find price elements with malformed currency
      const priceElements = document.querySelectorAll('.price, .money, [class*="price"]');
      
      priceElements.forEach(element => {
        const text = element.textContent;
        
        // Fix malformed currency patterns like "Dhs68.02 AED -Dhs 116.24 AED"
        if (text.includes('Dhs') && text.includes('AED')) {
          const cleanedPrice = this.cleanCurrencyFormat(text);
          if (cleanedPrice !== text) {
            element.textContent = cleanedPrice;
          }
        }

        // Fix Japanese yen symbols appearing on English pages
        if (text.includes('¥') || text.includes('￥')) {
          const convertedPrice = this.convertYenToLocalCurrency(text);
          if (convertedPrice !== text) {
            element.textContent = convertedPrice;
          }
        }
      });
    }

    fixCurrencyDisplay() {
      // Ensure proper currency code is displayed
      const currencyElements = document.querySelectorAll('.localization-form__currency, [data-currency]');
      
      currencyElements.forEach(element => {
        if (this.isEnglishMarket && element.textContent.includes('JPY')) {
          // Replace with appropriate currency for the market
          const marketCurrency = this.detectMarketCurrency();
          if (marketCurrency) {
            element.textContent = element.textContent.replace('JPY', marketCurrency);
          }
        }
      });
    }

    containsJapanese(text) {
      // Check for Hiragana, Katakana, and Kanji characters
      return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    }

    findEnglishAlternative(element) {
      // Check data attributes for English content
      const englishTitle = element.getAttribute('data-english-title') ||
                          element.getAttribute('data-en') ||
                          element.getAttribute('title');
      
      if (englishTitle) return englishTitle;

      // Check meta tags for English product info
      const metaTitle = document.querySelector('meta[property="og:title"]');
      if (metaTitle && !this.containsJapanese(metaTitle.content)) {
        return metaTitle.content;
      }

      // Try to find English variant in JSON-LD data
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (let script of jsonLdScripts) {
        try {
          const data = JSON.parse(script.textContent);
          if (data.name && !this.containsJapanese(data.name)) {
            return data.name;
          }
        } catch (e) {
          // Continue searching
        }
      }

      return null;
    }

    cleanCurrencyFormat(text) {
      // Fix patterns like "Dhs68.02 AED -Dhs 116.24 AED"
      let cleaned = text;
      
      // Remove duplicate currency codes
      cleaned = cleaned.replace(/Dhs(\d+\.?\d*)\s*AED\s*-\s*Dhs\s*(\d+\.?\d*)\s*AED/g, 'AED $1 - AED $2');
      
      // Standardize currency format
      cleaned = cleaned.replace(/Dhs(\d+\.?\d*)/g, 'AED $1');
      
      // Remove extra spaces
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      
      return cleaned;
    }

    convertYenToLocalCurrency(text) {
      // This is a simplified conversion - in a real implementation,
      // you'd want to use actual exchange rates
      const yenAmount = text.match(/[¥￥](\d+(?:,\d{3})*(?:\.\d{2})?)/);
      if (yenAmount) {
        const amount = parseFloat(yenAmount[1].replace(/,/g, ''));
        const marketCurrency = this.detectMarketCurrency();
        
        if (marketCurrency === 'USD') {
          const usdAmount = (amount * 0.0067).toFixed(2); // Approximate conversion
          return text.replace(yenAmount[0], `$${usdAmount}`);
        } else if (marketCurrency === 'EUR') {
          const eurAmount = (amount * 0.0062).toFixed(2); // Approximate conversion
          return text.replace(yenAmount[0], `€${eurAmount}`);
        }
      }
      
      return text;
    }

    detectMarketCurrency() {
      // Try to detect the current market's currency
      const currencyMeta = document.querySelector('meta[name="currency"]');
      if (currencyMeta) return currencyMeta.content;

      // Check URL for market indicators
      const url = window.location.href;
      if (url.includes('/en-us/') || url.includes('?market=us')) return 'USD';
      if (url.includes('/en-gb/') || url.includes('?market=gb')) return 'GBP';
      if (url.includes('/en-eu/') || url.includes('?market=eu')) return 'EUR';
      if (url.includes('/en-ae/') || url.includes('?market=ae')) return 'AED';

      // Check shopify market data
      if (window.Shopify && window.Shopify.locale) {
        const locale = window.Shopify.locale.toLowerCase();
        if (locale.includes('us')) return 'USD';
        if (locale.includes('gb')) return 'GBP';
        if (locale.includes('eu')) return 'EUR';
        if (locale.includes('ae')) return 'AED';
      }

      // Default fallback
      return 'USD';
    }

    observeChanges() {
      // Create observer to monitor for dynamic content changes
      const observer = new MutationObserver((mutations) => {
        let shouldReapplyFixes = false;
        
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if new content contains prices or product names
                if (node.querySelector && (
                  node.querySelector('.price, .money, .product__title') ||
                  node.classList.contains('price') ||
                  node.classList.contains('product__title')
                )) {
                  shouldReapplyFixes = true;
                }
              }
            });
          }
        });
        
        if (shouldReapplyFixes) {
          // Debounce the fix application
          clearTimeout(this.fixTimeout);
          this.fixTimeout = setTimeout(() => {
            this.fixProductNames();
            this.fixPriceFormats();
            this.fixCurrencyDisplay();
          }, 500);
        }
      });

      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  // Initialize the fix when the script loads
  new MultilingualFix();

  // Also expose it globally for manual triggering if needed
  window.MultilingualFix = MultilingualFix;

})();
