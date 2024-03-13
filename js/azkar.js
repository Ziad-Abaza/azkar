window.onload = async () => {
    try {
        const response = await fetch('./data/azkar.json');
        const data = await response.json();

        const AzkarList = document.getElementById('AzkarList');
        const morningAzkar = data.morningAzkar;
        const eveningAzkar = data.eveningAzkar;

        const morningAzkarLink = document.getElementById('morningAzkarLink');
        const eveningAzkarLink = document.getElementById('eveningAzkarLink');
        const quranLink = document.getElementById('quranLink');
        const quranContent = document.getElementById('quranContent');

        function createAzkarItems(azkar, container) {
            container.innerHTML = ''; 

            azkar.forEach(azkarItem => {
                const azkarItemElement = document.createElement('div');
                azkarItemElement.classList.add('azkar-item');

                const azkarText = document.createElement('p');
                azkarText.textContent = azkarItem.azkar;

                const counterButton = document.createElement('button');
                counterButton.classList.add('counter');
                counterButton.textContent = azkarItem.count;
                counterButton.addEventListener('click', () => {
                    if (azkarItem.count > 0) {
                        azkarItem.count--;
                        counterButton.textContent = azkarItem.count;
                    }
                });

                azkarItemElement.appendChild(azkarText);
                azkarItemElement.appendChild(counterButton);

                container.appendChild(azkarItemElement);
            });
        }

        createAzkarItems(morningAzkar, AzkarList);

        function toggleAzkar(azkarType) {
            if (azkarType === 'morning') {
                createAzkarItems(morningAzkar, AzkarList);
                document.getElementById('azkarTitle').innerText = 'أذكار الصباح';
            } else if (azkarType === 'evening') {
                createAzkarItems(eveningAzkar, AzkarList);
                document.getElementById('azkarTitle').innerText = 'أذكار المساء';
            } else if (azkarType === 'quran') {
                createAzkarItems(eveningAzkar, AzkarList);
                document.getElementById('azkarTitle').innerText = 'تنزيل القرآن الكريم:';
            }
        }

        function showQuranContent() {
            AzkarList.style.display = 'none';
            quranContent.style.display = 'block';
            toggleAzkar('quran');
        }

        morningAzkarLink.addEventListener('click', function(event) {
            event.preventDefault();
            toggleAzkar('morning');
            AzkarList.style.display = 'grid';
            quranContent.style.display = 'none';
        });

        eveningAzkarLink.addEventListener('click', function(event) {
            event.preventDefault();
            toggleAzkar('evening');
            AzkarList.style.display = 'grid';
            quranContent.style.display = 'none';
        });

        quranLink.addEventListener('click', function(event) {
            event.preventDefault();
            showQuranContent();
        });
    } catch (error) {
        console.error('Error fetching Azkar:', error);
    }
};
