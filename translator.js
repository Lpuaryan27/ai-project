document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        sourceText: document.getElementById('sourceText'),
        translatedText: document.getElementById('translatedText'),
        sourceLang: document.getElementById('sourceLang'),
        targetLang: document.getElementById('targetLang'),
        translateBtn: document.getElementById('translateBtn'),
        clearSourceBtn: document.getElementById('clearSourceBtn'),
        copyTranslatedBtn: document.getElementById('copyTranslatedBtn'),
        downloadTranslatedBtn: document.getElementById('downloadTranslatedBtn'),
        detectLangBtn: document.getElementById('detectLangBtn'),
        swapLanguagesBtn: document.getElementById('swapLanguagesBtn'),
        charCount: document.getElementById('charCount'),
        historyTableBody: document.getElementById('historyTableBody'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        historyEmptyState: document.getElementById('historyEmptyState'),
        historyContent: document.getElementById('historyContent'),
        historyPrevBtn: document.getElementById('historyPrevBtn'),
        historyNextBtn: document.getElementById('historyNextBtn'),
        historyStart: document.getElementById('historyStart'),
        historyEnd: document.getElementById('historyEnd'),
        historyTotal: document.getElementById('historyTotal'),
        newSessionBtn: document.getElementById('newSessionBtn'),
        sessionId: document.getElementById('sessionId'),
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toastMessage'),
        toastIcon: document.getElementById('toastIcon'),
        toastCloseBtn: document.getElementById('toastCloseBtn'),
        speakTranslatedBtn: document.getElementById('speakTranslatedBtn')
    };

    // State management
    const state = {
        translationHistory: JSON.parse(localStorage.getItem('translationHistory')) || [],
        currentPage: 1,
        itemsPerPage: 5,
        currentSessionId: generateSessionId()
    };

    // Initialize the app
    function init() {
        elements.sessionId.textContent = state.currentSessionId;
        updateCharacterCount();
        renderHistory();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Text input events
        elements.sourceText.addEventListener('input', updateCharacterCount);
        
        // Button events
        elements.translateBtn.addEventListener('click', handleTranslation);
        elements.clearSourceBtn.addEventListener('click', clearSourceText);
        elements.copyTranslatedBtn.addEventListener('click', copyTranslatedText);
        elements.downloadTranslatedBtn.addEventListener('click', downloadTranslatedText);
        elements.detectLangBtn.addEventListener('click', detectLanguage);
        elements.swapLanguagesBtn.addEventListener('click', swapLanguages);
        elements.clearHistoryBtn.addEventListener('click', clearHistory);
        elements.historyPrevBtn.addEventListener('click', goToPrevPage);
        elements.historyNextBtn.addEventListener('click', goToNextPage);
        elements.newSessionBtn.addEventListener('click', startNewSession);
        elements.toastCloseBtn.addEventListener('click', hideToast);
        elements.speakTranslatedBtn.addEventListener('click', speakTranslatedText);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                handleTranslation();
            }
        });
    }

    // Translation handler
    async function handleTranslation() {
        const text = elements.sourceText.value.trim();
        const sourceLang = elements.sourceLang.value;
        const targetLang = elements.targetLang.value;
        
        if (!text) {
            showToast('Please enter text to translate', 'error');
            return;
        }
        
        if (text.length > 5000) {
            showToast('Text exceeds maximum length of 5000 characters', 'error');
            return;
        }
        
        if (sourceLang === targetLang && sourceLang !== 'auto') {
            showToast('Source and target languages are the same', 'error');
            return;
        }
        
        // Set loading state
        setButtonLoading(elements.translateBtn, true);
        
        try {
            // In a real implementation, you would call your translation API here
            // This is a mock implementation for demonstration
            const translatedText = await mockTranslate(text, sourceLang, targetLang);
            
            elements.translatedText.value = translatedText;
            
            // Add to history
            addToHistory({
                sourceText: text,
                translatedText: translatedText,
                sourceLang: sourceLang === 'auto' ? 'auto' : sourceLang,
                targetLang: targetLang,
                timestamp: new Date().toISOString()
            });
            
            showToast('Translation completed successfully', 'success');
        } catch (error) {
            console.error('Translation error:', error);
            showToast('Translation failed: ' + error.message, 'error');
        } finally {
            setButtonLoading(elements.translateBtn, false);
        }
    }

    // Mock translation function
    async function mockTranslate(text, sourceLang, targetLang) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // Mock translations for demonstration
        const mockTranslations = {
            'en': {
                'es': `(Translated to Spanish) ${text}`,
                'fr': `(Translated to French) ${text}`,
                'de': `(Translated to German) ${text}`
            },
            'es': {
                'en': `(Translated to English) ${text}`
            },
            'fr': {
                'en': `(Translated to English) ${text}`
            },
            'auto': {
                'en': `(Detected as ${sourceLang === 'auto' ? 'unknown' : sourceLang}, translated to English) ${text}`
            }
        };
        
        if (mockTranslations[sourceLang] && mockTranslations[sourceLang][targetLang]) {
            return mockTranslations[sourceLang][targetLang];
        }
        
        return `[Mock translation from ${sourceLang} to ${targetLang}] ${text}`;
    }

    // History management
    function addToHistory(translation) {
        state.translationHistory.unshift(translation);
        if (state.translationHistory.length > 50) {
            state.translationHistory.pop();
        }
        localStorage.setItem('translationHistory', JSON.stringify(state.translationHistory));
        renderHistory();
    }

    function renderHistory() {
        if (state.translationHistory.length === 0) {
            elements.historyEmptyState.classList.remove('hidden');
            elements.historyContent.classList.add('hidden');
            return;
        }
        
        elements.historyEmptyState.classList.add('hidden');
        elements.historyContent.classList.remove('hidden');
        
        // Calculate pagination
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = Math.min(startIndex + state.itemsPerPage, state.translationHistory.length);
        const paginatedItems = state.translationHistory.slice(startIndex, endIndex);
        
        // Render history items
        elements.historyTableBody.innerHTML = paginatedItems.map((item, index) => `
            <tr class="history-item hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(item.timestamp).toLocaleString()}
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                    ${getLanguageName(item.sourceLang)} → ${getLanguageName(item.targetLang)}
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 max-w-xs truncate" title="${item.sourceText}">
                    ${truncateText(item.sourceText, 50)}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-govblue-600 hover:text-govblue-800 mr-2 view-history" data-index="${startIndex + index}">
                        <i class="fas fa-eye mr-1"></i> View
                    </button>
                    <button class="text-red-600 hover:text-red-800 delete-history" data-index="${startIndex + index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Update pagination info
        elements.historyStart.textContent = startIndex + 1;
        elements.historyEnd.textContent = endIndex;
        elements.historyTotal.textContent = state.translationHistory.length;
        
        // Update pagination buttons
        elements.historyPrevBtn.disabled = state.currentPage === 1;
        elements.historyNextBtn.disabled = endIndex >= state.translationHistory.length;
        
        // Add event listeners to new buttons
        document.querySelectorAll('.view-history').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                loadHistoryItem(index);
            });
        });
        
        document.querySelectorAll('.delete-history').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteHistoryItem(index);
            });
        });
    }

    function loadHistoryItem(index) {
        const item = state.translationHistory[index];
        elements.sourceText.value = item.sourceText;
        elements.translatedText.value = item.translatedText;
        elements.sourceLang.value = item.sourceLang;
        elements.targetLang.value = item.targetLang;
        updateCharacterCount();
        showToast('History item loaded', 'info');
    }

    function deleteHistoryItem(index) {
        state.translationHistory.splice(index, 1);
        localStorage.setItem('translationHistory', JSON.stringify(state.translationHistory));
        renderHistory();
        showToast('History item deleted', 'info');
    }

    function clearHistory() {
        if (state.translationHistory.length === 0) return;
        
        if (confirm('Are you sure you want to clear all translation history?')) {
            state.translationHistory = [];
            localStorage.removeItem('translationHistory');
            state.currentPage = 1;
            renderHistory();
            showToast('History cleared', 'info');
        }
    }

    // Pagination functions
    function goToPrevPage() {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderHistory();
        }
    }

    function goToNextPage() {
        const totalPages = Math.ceil(state.translationHistory.length / state.itemsPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderHistory();
        }
    }

    // Utility functions
    function updateCharacterCount() {
        const count = elements.sourceText.value.length;
        elements.charCount.textContent = count;
        
        if (count > 4500) {
            elements.charCount.classList.add('text-red-600');
        } else {
            elements.charCount.classList.remove('text-red-600');
        }
    }

    function clearSourceText() {
        elements.sourceText.value = '';
        updateCharacterCount();
    }

    function copyTranslatedText() {
        if (!elements.translatedText.value) return;
        
        navigator.clipboard.writeText(elements.translatedText.value)
            .then(() => showToast('Translation copied to clipboard', 'success'))
            .catch(err => showToast('Failed to copy text: ' + err, 'error'));
    }

    function downloadTranslatedText() {
        if (!elements.translatedText.value) return;
        
        const blob = new Blob([elements.translatedText.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `translation_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Translation downloaded', 'success');
    }

    function detectLanguage() {
        const text = elements.sourceText.value.trim();
        
        if (!text) {
            showToast('Please enter text to detect language', 'error');
            return;
        }
        
        // In a real implementation, you would call a language detection API
        // This is a mock implementation
        showToast('Language detection would be implemented with an API call', 'info');
    }

    function swapLanguages() {
        const sourceLang = elements.sourceLang.value;
        const targetLang = elements.targetLang.value;
        
        if (sourceLang === 'auto') {
            showToast('Cannot swap when auto-detect is selected', 'error');
            return;
        }
        
        elements.sourceLang.value = targetLang;
        elements.targetLang.value = sourceLang;
        
        // Also swap texts if both are present
        if (elements.sourceText.value && elements.translatedText.value) {
            const temp = elements.sourceText.value;
            elements.sourceText.value = elements.translatedText.value;
            elements.translatedText.value = temp;
            updateCharacterCount();
        }
        
        showToast('Languages swapped', 'info');
    }

    function startNewSession() {
        state.currentSessionId = generateSessionId();
        elements.sessionId.textContent = state.currentSessionId;
        showToast('New session started', 'info');
    }

    function speakTranslatedText() {
        if (!elements.translatedText.value) return;
        
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(elements.translatedText.value);
            utterance.lang = getLanguageCode(elements.targetLang.value);
            speechSynthesis.speak(utterance);
        } else {
            showToast('Text-to-speech not supported in your browser', 'error');
        }
    }

    function setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner loading-spinner mr-2"></i> Translating...';
        } else {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-language mr-2"></i> Translate';
        }
    }

    function showToast(message, type = 'info') {
        const typeIcons = {
            'info': 'fa-info-circle',
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle'
        };
        
        const typeColors = {
            'info': 'text-blue-400',
            'success': 'text-green-400',
            'error': 'text-red-400',
            'warning': 'text-yellow-400'
        };
        
        // Remove previous color classes
        elements.toastIcon.className = elements.toastIcon.className.replace(/\btext-\w+-\d+\b/g, '');
        
        // Set new icon and color
        elements.toastIcon.className = `fas ${typeIcons[type]} mt-1 mr-3 ${typeColors[type]}`;
        elements.toastMessage.textContent = message;
        elements.toast.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(hideToast, 5000);
    }

    function hideToast() {
        elements.toast.classList.add('hidden');
    }

    function generateSessionId() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    function getLanguageName(code) {
        const languages = {
            'auto': 'Auto',
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'zh': 'Chinese',
            'ar': 'Arabic',
            'ru': 'Russian',
            'hi': 'Hindi',
            'pt': 'Portuguese',
            'ja': 'Japanese'
        };
        return languages[code] || code;
    }

    function getLanguageCode(langName) {
        const codes = {
            'English': 'en-US',
            'Spanish': 'es-ES',
            'French': 'fr-FR',
            'German': 'de-DE',
            'Chinese': 'zh-CN',
            'Arabic': 'ar-SA',
            'Russian': 'ru-RU',
            'Hindi': 'hi-IN',
            'Portuguese': 'pt-PT',
            'Japanese': 'ja-JP'
        };
        return codes[langName] || 'en-US';
    }

    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Initialize the application
    init();
});