let page = 1;
const itemsPerPage = 10;
let azkarDataCache = null;
let isLoading = false; 
let currentAzkarType = null; 

function fetchAzkarData() {
  if (azkarDataCache) {
    initializeAzkarUI(azkarDataCache);
    return;
  }

  fetch("../data/azkar.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      azkarDataCache = data;
      initializeAzkarUI(data);
    })
    .catch((error) => console.error("Error fetching Azkar data:", error));
}

function initializeAzkarUI(data) {
  const AzkarList = document.getElementById("AzkarList");
  const quranContent = document.getElementById("quranContent");
  const morningAzkar = data.morningAzkar;
  const eveningAzkar = data.eveningAzkar;

  function createAzkarItems(azkar, container, page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const azkarPage = azkar.slice(start, end);

    if (azkarPage.length === 0) {
      window.removeEventListener("scroll", handleScroll);
      return;
    }

    const fragment = document.createDocumentFragment();

    azkarPage.forEach((azkarItem) => {
      const azkarItemElement = document.createElement("div");
      azkarItemElement.classList.add("azkar-item");

      const azkarText = document.createElement("p");
      azkarText.textContent = azkarItem.azkar;

      const counterButton = document.createElement("button");
      counterButton.classList.add("counter");
      counterButton.textContent = azkarItem.count;
        counterButton.addEventListener("click", () => {
        if (azkarItem.count > 0) {
            azkarItem.count--;
            counterButton.textContent = azkarItem.count;

            if (azkarItem.count === 0) {
            counterButton.disabled = true; 
            counterButton.style.backgroundColor = "#d35400"; 
            counterButton.style.cursor = "not-allowed"; 
            }
        }
        });


      azkarItemElement.appendChild(azkarText);
      azkarItemElement.appendChild(counterButton);

      fragment.appendChild(azkarItemElement);
    });

    container.appendChild(fragment);
    isLoading = false; 
  }

  function toggleAzkar(azkarType) {
    if (currentAzkarType === azkarType) return;

    AzkarList.innerHTML = "";
    quranContent.style.display = "none";
    AzkarList.style.display = "grid";
    page = 1;
    currentAzkarType = azkarType;
    window.addEventListener("scroll", handleScroll);

    if (azkarType === "morning") {
      createAzkarItems(morningAzkar, AzkarList, page);
      document.getElementById("azkarTitle").innerText = "أذكار الصباح";
    } else if (azkarType === "evening") {
      createAzkarItems(eveningAzkar, AzkarList, page);
      document.getElementById("azkarTitle").innerText = "أذكار المساء";
    }
  }

  function showQuranContent() {
    AzkarList.style.display = "none";
    quranContent.style.display = "block";
    document.getElementById("azkarTitle").innerText = "تنزيل القرآن الكريم:";
    window.removeEventListener("scroll", handleScroll);
  }

  function handleScroll() {
    if (
      isLoading ||
      window.innerHeight + window.scrollY < document.body.scrollHeight - 100
    )
      return;

    isLoading = true;
    page++;

    if (currentAzkarType === "morning") {
      createAzkarItems(morningAzkar, AzkarList, page);
    } else if (currentAzkarType === "evening") {
      createAzkarItems(eveningAzkar, AzkarList, page);
    }
  }

  document
    .getElementById("morningAzkarLink")
    .addEventListener("click", (event) => {
      event.preventDefault();
      toggleAzkar("morning");
    });

  document
    .getElementById("eveningAzkarLink")
    .addEventListener("click", (event) => {
      event.preventDefault();
      toggleAzkar("evening");
    });

  document.getElementById("quranLink").addEventListener("click", (event) => {
    event.preventDefault();
    showQuranContent();
  });

  toggleAzkar("morning");
}

window.onload = fetchAzkarData;
