document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sourceText = document.getElementById('sourceText');
    const translatedText = document.getElementById('translatedText');
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const translateBtn = document.getElementById('translateBtn');
    const clearText = document.getElementById('clearText');
    const copyText = document.getElementById('copyText');
    const downloadText = document.getElementById('downloadText');
    const detectLang = document.getElementById('detectLang');
    const charCount = document.getElementById('charCount');
    const translationHistory = document.getElementById('translationHistory');
    const historyTableBody = document.getElementById('historyTableBody');

    // Character count update
    sourceText.addEventListener('input', function() {
        charCount.textContent = sourceText.value.length;
    });

    // Clear text
    clearText.addEventListener('click', function() {
        sourceText.value = '';
        translatedText.value = '';
        charCount.textContent = '0';
    });

    // Copy translated text
    copyText.addEventListener('click', function() {
        if (translatedText.value) {
            translatedText.select();
            document.execCommand('copy');
            
            // Show temporary feedback
            const originalText = copyText.innerHTML;
            copyText.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
            setTimeout(() => {
                copyText.innerHTML = originalText;
            }, 2000);
        }
    });

    // Download translated text
    downloadText.addEventListener('click', function() {
        if (translatedText.value) {
            const blob = new Blob([translatedText.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `translation_${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    // Language detection (mock implementation)
    detectLang.addEventListener('click', function() {
        if (sourceText.value.trim() === '') {
            alert('Please enter text to detect language');
            return;
        }
        
        // In a real implementation, you would call a language detection API
        // This is a mock implementation for demonstration
        sourceLang.value = 'en'; // Defaulting to English for demo
        alert('Detected language: English (for demonstration purposes)');
    });

    // Translation function
    translateBtn.addEventListener('click', function() {
        const text = sourceText.value.trim();
        const fromLang = sourceLang.value;
        const toLang = targetLang.value;
        
        if (text === '') {
            alert('Please enter text to translate');
            return;
        }
        
        if (fromLang === toLang) {
            alert('Source and target languages are the same');
            return;
        }
        
        // Show loading state
        translateBtn.disabled = true;
        translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Translating...';
        
        // Call PHP backend for translation
        fetch('translate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `text=${encodeURIComponent(text)}&source=${fromLang}&target=${toLang}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            translatedText.value = data.translatedText;
            
            // Add to history
            addToHistory(text, data.translatedText, fromLang, toLang);
            translationHistory.classList.remove('hidden');
            
            // Reset button
            translateBtn.disabled = false;
            translateBtn.innerHTML = '<i class="fas fa-language mr-1"></i> Translate';
        })
        .catch(error => {
            console.error('Translation error:', error);
            alert('Translation failed: ' + error.message);
            translateBtn.disabled = false;
            translateBtn.innerHTML = '<i class="fas fa-language mr-1"></i> Translate';
        });
    });

    // Add translation to history
    function addToHistory(sourceText, translatedText, sourceLang, targetLang) {
        const now = new Date();
        const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${dateStr}</td>
            <td class="px-4 py-2 text-sm text-gray-500">${sourceLang}</td>
            <td class="px-4 py-2 text-sm text-gray-500">${targetLang}</td>
            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                <button class="text-blue-600 hover:text-blue-800 view-history" data-source="${encodeURIComponent(sourceText)}" data-translated="${encodeURIComponent(translatedText)}">View</button>
            </td>
        `;
        
        historyTableBody.prepend(row);
        
        // Add event listener to the new view button
        row.querySelector('.view-history').addEventListener('click', function() {
            const source = decodeURIComponent(this.getAttribute('data-source'));
            const translated = decodeURIComponent(this.getAttribute('data-translated'));
            
            // Fill the translation fields
            document.getElementById('sourceText').value = source;
            document.getElementById('translatedText').value = translated;
            document.getElementById('charCount').textContent = source.length;
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});