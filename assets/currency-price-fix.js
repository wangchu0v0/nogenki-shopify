/**
 * Currency and Price Format Fix
 * Fixes currency display and price formatting issues in multilingual markets
 * Version: 1.0.0
 */

(function() {
  'use strict';

  class CurrencyPriceFix {
    constructor() {
      this.currentLang = document.documentElement.lang || 'ja';
      this.detectedMarket = this.detectCurrentMarket();
      this.currencyConfig = this.getCurrencyConfig();
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupCurrencyFix());
      } else {
        this.setupCurrencyFix();
      }
    }

    setupCurrencyFix() {
      this.fixPriceFormats();
      this.fixCurrencySymbols();
      this.fixLocalizationForms();
      this.monitorPriceChanges();
    }

    detectCurrentMarket() {
      // Try multiple methods to detect the current market
      const url = window.location.href;
      const pathname = window.location.pathname;
      
      // Check URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const marketParam = urlParams.get('market') || urlParams.get('country');
      if (marketParam) return marketParam.toLowerCase();

      // Check URL path
      if (pathname.includes('/en-us/') || url.includes('us.')) return 'us';
      if (pathname.includes('/en-gb/') || url.includes('uk.')) return 'gb';
      if (pathname.includes('/en-au/') || url.includes('au.')) return 'au';
      if (pathname.includes('/en-ca/') || url.includes('ca.')) return 'ca';
      if (pathname.includes('/en-ae/') || url.includes('ae.')) return 'ae';
      if (pathname.includes('/en-in/') || url.includes('in.')) return 'in';

      // Check Shopify locale
      if (window.Shopify && window.Shopify.locale) {
        const locale = window.Shopify.locale.toLowerCase();
        if (locale.includes('us')) return 'us';
        if (locale.includes('gb')) return 'gb';
        if (locale.includes('au')) return 'au';
        if (locale.includes('ca')) return 'ca';
        if (locale.includes('ae')) return 'ae';
        if (locale.includes('in')) return 'in';
      }

      // Check meta tags
      const currencyMeta = document.querySelector('meta[name="currency"]');
      if (currencyMeta) {
        const currency = currencyMeta.content.toUpperCase();
        const currencyToMarket = {
          'USD': 'us',
          'GBP': 'gb',
          'AUD': 'au',
          'CAD': 'ca',
          'AED': 'ae',
          'INR': 'in',
          'EUR': 'eu'
        };
        if (currencyToMarket[currency]) return currencyToMarket[currency];
      }

      // Default based on language
      if (this.currentLang.startsWith('en')) return 'us';
      return 'jp'; // Default to Japan
    }

    getCurrencyConfig() {
      const configs = {
        'us': {
          currency: 'USD',
          symbol: '$',
          position: 'before',
          format: '${amount}',
          decimal: '.',
          thousands: ',',
          decimals: 2
        },
        'gb': {
          currency: 'GBP',
          symbol: '£',
          position: 'before',
          format: '£{amount}',
          decimal: '.',
          thousands: ',',
          decimals: 2
        },
        'au': {
          currency: 'AUD',
          symbol: 'A$',
          position: 'before',
          format: 'A${amount}',
          decimal: '.',
          thousands: ',',
          decimals: 2
        },
        'ca': {
          currency: 'CAD',
          symbol: 'C$',
          position: 'before',
          format: 'C${amount}',
          decimal: '.',
          thousands: ',',
          decimals: 2
        },
        'ae': {
          currency: 'AED',
          symbol: 'د.إ',
          position: 'after',
          format: '{amount} AED',
          decimal: '.',
          thousands: ',',
          decimals: 2
        },
        'in': {
          currency: 'INR',
          symbol: '₹',
          position: 'before',
          format: '₹{amount}',
          decimal: '.',
          thousands: ',',
          decimals: 2
        },
        'eu': {
          currency: 'EUR',
          symbol: '€',
          position: 'after',
          format: '{amount}€',
          decimal: ',',
          thousands: '.',
          decimals: 2
        },
        'jp': {
          currency: 'JPY',
          symbol: '¥',
          position: 'before',
          format: '¥{amount}',
          decimal: '',
          thousands: ',',
          decimals: 0
        }
      };

      return configs[this.detectedMarket] || configs['us'];
    }

    fixPriceFormats() {
      const priceSelectors = [
        '.price',
        '.money',
        '.price-item',
        '.product-price',
        '[class*="price"]',
        '.cart-item__price',
        '.price--on-sale',
        '.price--regular',
        '.price--compare'
      ];

      priceSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => this.fixSinglePrice(element));
      });
    }

    fixSinglePrice(element) {
      const originalText = element.textContent.trim();
      
      // Skip if already processed
      if (element.classList.contains('currency-fixed')) return;
      
      // Check for malformed currency patterns
      if (this.needsCurrencyFix(originalText)) {
        const fixedPrice = this.reformatPrice(originalText);
        if (fixedPrice && fixedPrice !== originalText) {
          // Store original for reference
          element.setAttribute('data-original-price', originalText);
          element.textContent = fixedPrice;
          element.classList.add('currency-fixed');
        }
      }
    }

    needsCurrencyFix(text) {
      // Check for various problematic patterns
      const problematicPatterns = [
        /Dhs[\d.,]+\s*AED\s*-\s*Dhs\s*[\d.,]+\s*AED/i,  // "Dhs68.02 AED -Dhs 116.24 AED"
        /[\¥￥][\d.,]+.*USD/i,                              // Yen symbol with USD
        /JPY.*[\$£€]/i,                                    // JPY with other currency symbols
        /AED.*AED/i,                                       // Duplicate AED
        /\$.*¥/i,                                          // Mixed symbols
        /[A-Z]{3}\s*[\d.,]+.*[A-Z]{3}/i                   // Multiple currency codes
      ];

      return problematicPatterns.some(pattern => pattern.test(text));
    }

    reformatPrice(text) {
      const config = this.currencyConfig;
      
      // Extract numeric values
      const numbers = text.match(/[\d.,]+/g);
      if (!numbers) return null;

      // Handle different malformed patterns
      let formattedPrice = text;

      // Fix "Dhs68.02 AED -Dhs 116.24 AED" pattern
      if (text.includes('Dhs') && text.includes('AED')) {
        const priceMatch = text.match(/Dhs([\d.,]+)\s*AED\s*-\s*Dhs\s*([\d.,]+)\s*AED/i);
        if (priceMatch) {
          const [, price1, price2] = priceMatch;
          if (config.currency === 'AED') {
            formattedPrice = `${config.format.replace('{amount}', price2)} - ${config.format.replace('{amount}', price1)}`;
          } else {
            // Convert to target currency (simplified conversion)
            const convertedPrice1 = this.convertCurrency(parseFloat(price1.replace(/,/g, '')), 'AED', config.currency);
            const convertedPrice2 = this.convertCurrency(parseFloat(price2.replace(/,/g, '')), 'AED', config.currency);
            formattedPrice = `${config.format.replace('{amount}', this.formatNumber(convertedPrice2, config))} - ${config.format.replace('{amount}', this.formatNumber(convertedPrice1, config))}`;
          }
        }
      }

      // Fix Yen to target currency
      else if ((text.includes('¥') || text.includes('￥')) && config.currency !== 'JPY') {
        const yenMatch = text.match(/[¥￥]([\d,]+)/);
        if (yenMatch) {
          const yenAmount = parseFloat(yenMatch[1].replace(/,/g, ''));
          const convertedAmount = this.convertCurrency(yenAmount, 'JPY', config.currency);
          formattedPrice = config.format.replace('{amount}', this.formatNumber(convertedAmount, config));
        }
      }

      // Fix duplicate currency codes
      else if (text.match(/([A-Z]{3}).*\1/)) {
        const currencyMatch = text.match(/([A-Z]{3})\s*([\d.,]+)/);
        if (currencyMatch) {
          const [, currency, amount] = currencyMatch;
          if (currency === config.currency) {
            formattedPrice = config.format.replace('{amount}', amount);
          } else {
            const convertedAmount = this.convertCurrency(parseFloat(amount.replace(/,/g, '')), currency, config.currency);
            formattedPrice = config.format.replace('{amount}', this.formatNumber(convertedAmount, config));
          }
        }
      }

      return formattedPrice;
    }

    convertCurrency(amount, fromCurrency, toCurrency) {
      // Simplified currency conversion - in production, use real exchange rates
      const rates = {
        'JPY': { 'USD': 0.0067, 'GBP': 0.0054, 'AUD': 0.0099, 'CAD': 0.0090, 'AED': 0.0245, 'INR': 0.56, 'EUR': 0.0062 },
        'USD': { 'JPY': 150, 'GBP': 0.80, 'AUD': 1.48, 'CAD': 1.35, 'AED': 3.67, 'INR': 83, 'EUR': 0.92 },
        'AED': { 'USD': 0.27, 'JPY': 41, 'GBP': 0.22, 'AUD': 0.40, 'CAD': 0.37, 'INR': 23, 'EUR': 0.25 }
      };

      if (fromCurrency === toCurrency) return amount;
      
      const rate = rates[fromCurrency] && rates[fromCurrency][toCurrency];
      return rate ? (amount * rate) : amount;
    }

    formatNumber(number, config) {
      const rounded = config.decimals > 0 ? number.toFixed(config.decimals) : Math.round(number).toString();
      
      // Add thousands separators
      if (config.thousands) {
        const parts = rounded.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousands);
        return parts.join(config.decimal);
      }
      
      return rounded.replace('.', config.decimal);
    }

    fixCurrencySymbols() {
      // Fix currency symbols in localization forms and displays
      const currencyElements = document.querySelectorAll(
        '.localization-form__currency, [data-currency], .currency-display'
      );

      currencyElements.forEach(element => {
        const text = element.textContent;
        if (this.shouldUpdateCurrency(text)) {
          element.textContent = `${this.currencyConfig.currency} ${this.currencyConfig.symbol}`;
          element.classList.add('currency-fixed');
        }
      });
    }

    shouldUpdateCurrency(text) {
      return (
        (text.includes('JPY') && this.currencyConfig.currency !== 'JPY') ||
        (text.includes('¥') && this.currencyConfig.currency !== 'JPY') ||
        (!text.includes(this.currencyConfig.currency) && this.currentLang.startsWith('en'))
      );
    }

    fixLocalizationForms() {
      // Update country/currency selectors to show correct currency
      const countryOptions = document.querySelectorAll('.localization-form option, .country-selector a');
      
      countryOptions.forEach(option => {
        const currencySpan = option.querySelector('.localization-form__currency');
        if (currencySpan && this.shouldUpdateCurrency(currencySpan.textContent)) {
          currencySpan.textContent = `${this.currencyConfig.currency} ${this.currencyConfig.symbol}`;
        }
      });
    }

    monitorPriceChanges() {
      // Monitor for dynamic price updates (AJAX, cart updates, etc.)
      const observer = new MutationObserver((mutations) => {
        let priceChanged = false;

        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const target = mutation.target;
            const element = target.nodeType === Node.ELEMENT_NODE ? target : target.parentElement;
            
            if (element && (
              element.matches('.price, .money, [class*="price"]') ||
              element.querySelector('.price, .money, [class*="price"]')
            )) {
              priceChanged = true;
            }
          }
        });

        if (priceChanged) {
          clearTimeout(this.priceFixTimeout);
          this.priceFixTimeout = setTimeout(() => {
            this.fixPriceFormats();
            this.fixCurrencySymbols();
          }, 200);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  // Initialize the currency price fix
  new CurrencyPriceFix();

  // Expose for manual use
  window.CurrencyPriceFix = CurrencyPriceFix;

})();
