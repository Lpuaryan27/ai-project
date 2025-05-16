document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const checkResearchButton = document.getElementById('checkResearch');
    const checkPatentButton = document.getElementById('checkPatent');
    const researchOutput = document.getElementById('researchOutput');
    const patentOutput = document.getElementById('patentOutput');

    
    const mockResearchPapers = [
        "Novel methods for drug delivery using nanoparticles.",
        "The impact of AI on medical diagnostics.",
        "Advancements in renewable energy sources."
    ];
    const mockPatents = [
        "Patent for a new type of solar panel.",
        "Patent for a medical device for heart monitoring.",
        "Patent for an AI-powered image recognition system."
    ];

    function checkText(text, data) {
        let results = [];
        data.forEach(item => {
            if (item.toLowerCase().includes(text.toLowerCase())) {
                results.push(`<p>${item}</p>`);
            }
        });
        return results.join('');
    }

    checkResearchButton.addEventListener('click', () => {
        const text = inputText.value;
        const results = checkText(text, mockResearchPapers);
        researchOutput.innerHTML = results || '<p>No matching research papers found.</p>';
    });

    checkPatentButton.addEventListener('click', () => {
        const text = inputText.value;
        const results = checkText(text, mockPatents);
        patentOutput.innerHTML = results || '<p>No matching patents found.</p>';
    });
});