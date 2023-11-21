import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelectElement = document.getElementById('breed-select');
  const loader = document.querySelector('.loader');
  const catInfo = document.querySelector('.cat-info');
  const bubleText = document.querySelector('.bubble');

  fetchBreeds()
    .then(breeds => {
      const breedOptions = breeds.map(breed => ({
        text: breed.name,
        value: breed.id,
      }));

      breedOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        breedSelectElement.appendChild(optionElement);
      });

      new SlimSelect({
        select: '#breed-select',
        settings: {
          alwaysOpen: false,
          placeholderText: 'Select here',
          openPosition: 'up', // 'auto', 'up' or 'down'
        },
      });

      loader.style.display = 'none';

      breedSelectElement.addEventListener('change', event => {
        const selectedBreedId = event.target.value;
        bubleText.textContent = 'Select another cat';

        if (selectedBreedId) {
          loader.style.display = 'inline-block';
          catInfo.style.display = 'none';

          fetchCatByBreed(selectedBreedId)
            .then(cat => {
              displayCatInfo(cat);
            })
            .catch(error => {
              console.error('Error fetching cat information:', error);
              loader.style.display = 'none';
            });
        }
      });
    })
    .catch(error => {
      console.error('Error fetching breeds:', error);
      loader.style.display = 'none';
    });

  function displayCatInfo(cat) {
    const catImage = document.createElement('img');
    catImage.src = cat[0].url;
    catImage.alt = 'Cat Image';

    catImage.onload = () => {
      catInfo.innerHTML = '';
      catInfo.appendChild(catImage);

      const catDetails = document.createElement('div');
      catDetails.innerHTML = `
        <p><strong>${cat[0].breeds[0].name}</strong></p>
        <p>${cat[0].breeds[0].description}</p>
        <p><strong>Temperament:</strong> ${cat[0].breeds[0].temperament}</p>
      `;
      catInfo.appendChild(catDetails);

      catInfo.style.display = 'block';
      loader.style.display = 'none';
    };
  }
});
