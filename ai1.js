document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const skills = document.getElementById('skills').value;
    const interests = document.getElementById('interests').value;
    const education = document.getElementById('education').value;

    // Simulate AI API call (replace with actual API call)
    const recommendations = getCareerRecommendations(skills, interests, education);
    displayRecommendations(recommendations);

    const skillGap = getSkillGap(recommendations, skills);
    displaySkillGap(skillGap);

    const resources = getLearningResources(recommendations);
    displayLearningResources(resources);
});

// Simulated AI API function (replace with actual API call)
function getCareerRecommendations(skills, interests, education) {
    // Replace with actual API call to your AI model
    return [
        { title: 'Software Engineer', description: 'Develop software applications.', requiredSkills: ['Python', 'JavaScript'] },
        { title: 'Data Analyst', description: 'Analyze and interpret data.', requiredSkills: ['SQL', 'Data Visualization'] },
        { title: 'Project Manager', description: 'Lead and manage projects.', requiredSkills: ['Project Management', 'Communication'] }
    ];
}

function getSkillGap(recommendations, userSkills){
    //simulated skill gap function.
    const userSkillsArray = userSkills.split(',').map(skill => skill.trim());
    const skillGaps = [];

    recommendations.forEach(recommendation => {
        recommendation.requiredSkills.forEach(requiredSkill => {
            if(!userSkillsArray.includes(requiredSkill)){
                skillGaps.push({career: recommendation.title, missingSkill: requiredSkill});
            }
        });
    });
    return skillGaps;
}

function getLearningResources(recommendations){
    //simulated learning resources.
    return [
        {title: "Python Course", link: "https://example.com/python"},
        {title: "SQL Tutorial", link: "https://example.com/sql"}
    ];
}

function displayRecommendations(recommendations) {
    const recommendationList = document.getElementById('recommendation-list');
    recommendationList.innerHTML = ''; // Clear previous recommendations

    recommendations.forEach(recommendation => {
        const recommendationItem = document.createElement('div');
        recommendationItem.className = 'mb-2 border p-3 rounded';
        recommendationItem.innerHTML = `
            <h3 class="font-semibold">${recommendation.title}</h3>
            <p>${recommendation.description}</p>
        `;
        recommendationList.appendChild(recommendationItem);
    });
}

function displaySkillGap(skillGaps){
    const skillGapList = document.getElementById('skill-gap-list');
    skillGapList.innerHTML = '';

    skillGaps.forEach(gap => {
        const gapItem = document.createElement('div');
        gapItem.className = 'mb-2 border p-3 rounded';
        gapItem.innerHTML = `<p>For ${gap.career}, you are missing ${gap.missingSkill}</p>`;
        skillGapList.appendChild(gapItem);

    });
}

function displayLearningResources(resources){
    const resourceList = document.getElementById("resource-list");
    resourceList.innerHTML = "";

    resources.forEach(resource => {
        const resourceItem = document.createElement("div");
        resourceItem.className = "mb-2 border p-3 rounded";
        resourceItem.innerHTML = `<a href="${resource.link}" target="_blank">${resource.title}</a>`;
        resourceList.appendChild(resourceItem);
    });
}