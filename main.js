const languageList = document.getElementById("languageList");
const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const successState = document.getElementById("successState");
const refreshBtn = document.getElementById("refreshBtn");

async function loadLanguages() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json");
        const languageData = await response.json();
        populateDropdownList(languageData);
    } catch (error) {
        console.log(error);
    }
}

function populateDropdownList(languageData) {
    languageData.forEach(language => {
        const option = document.createElement("option");
        option.value = language.value;
        option.textContent = language.title;
        languageList.appendChild(option);
    });
}

async function fetchRandomRepo() {
    const selectedLanguage = languageList.value;
    if (!selectedLanguage) {
        alert("Please select a language first.");
        return
    }
    showLoadingState();
    clearStates();
    
    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=language:${selectedLanguage}&sort=stars`);
        const data = await response.json();
    
        if (data.items && data.items.length > 0) {
            const randomRepo = data.items[Math.floor(Math.random() * data.items.length)];
            displayRepo(randomRepo);
        } else {
            showErrorState('Failed to fetch repository');
        }
    } catch (error) {
        hideEmptyState();
        showErrorState('Failed to fetch repository');
        console.log(error);
    } finally {
        hideLoadingState();
    }
}

function displayRepo(repo) {
    successState.style.display = "block";
    successState.innerHTML = `
        <h2>${repo.name}</h2>
        <p>${repo.description}</p>
        <div class="repoDetails">
            <p>${repo.language}</p>
            <p><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</p>
            <p><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</p>
            <p><i class="fa-solid fa-exclamation"></i> ${repo.open_issues_count}</p>
        </div>
    `;
    successState.style.backgroundColor = "white";
    refreshBtn.style.display = "block";
}

function hideSuccessState() {
    successState.style.display = "none";
}

function showLoadingState() {
    hideSuccessState();
    loadingState.style.display = "block";
}

function hideLoadingState() {
    loadingState.style.display = "none";
}

function hideEmptyState() {
    emptyState.style.display = "none";
}

function showErrorState(errorMsg) {
    errorState.textContent = errorMsg;
    errorState.style.display = "block";
}

function clearStates() {
    errorState.style.display = "none";
    emptyState.style.display = "none";
    successState.innerHTML = '';
}

languageList.addEventListener("change", fetchRandomRepo);
refreshBtn.addEventListener("click", fetchRandomRepo);

loadLanguages();