import { findImages } from './pixabay-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  target: document.querySelector('.js-guard'),
};
let currentPage = 1;
let searchQuery = '';

let options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

var observer = new IntersectionObserver(onLoad, options);

refs.form.addEventListener('submit', onSubmitClick);

function onSubmitClick(evt) {
  evt.preventDefault();
  refs.gallery.innerHTML = '';
  currentPage = 1;
  observer.unobserve(refs.target);
  searchQuery = refs.form.elements.searchQuery.value.trim();

  if (searchQuery.length > 0) {
    getImages(searchQuery);
    refs.form.elements.searchQuery.value = '';
  } else {
    showError('Please, fill the search value.', 'center-center');
  }
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting && searchQuery.length > 0) {
      currentPage += 1;
      getImages(searchQuery);
    }
  });
}

async function getImages(search) {
  try {
    const data = await findImages(search, currentPage);
    if (!data.hits.length) {
      showError(
        'Sorry, there are no images matching your search query. Please try again.',
        'center-center'
      );
      return;
    }

    refs.gallery.insertAdjacentHTML('beforeend', await createMurkup(data.hits));
    if (currentPage === 1) {
      showSuccess(
        `Hooray! We found ${data.totalHits} images.`,
        'center-bottom'
      );
    }
    observer.observe(refs.target);
    if (data.totalHits <= currentPage * data.hits.length) {
      showInfo(
        "We're sorry, but you've reached the end of search results.",
        'center-bottom'
      );
      observer.unobserve(refs.target);
    }
  } catch (error) {
    showError(error.message, 'center-top');
  }
}

function createMurkup(arrImages) {
  return arrImages
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
            <b>Likes</b>
            ${likes}
        </p>
        <p class="info-item">
            <b>Views</b>
            ${views}
        </p>
        <p class="info-item">
            <b>Comments</b>
            ${comments}
        </p>
        <p class="info-item">
            <b>Downloads</b>
            ${downloads}
        </p>
        </div>
    </div>`
    )
    .join('');
}

function showElement(arrElement) {
  arrElement.forEach(element => element.classList.remove('visually-hidden'));
}

function hideElement(arrElement) {
  arrElement.forEach(element => element.classList.add('visually-hidden'));
}

function showError(message, position) {
  Notify.failure(message, {
    position: position,
    timeout: 2000,
    width: '400px',
    failure: {
      background: '#fff',
      textColor: '#ff5549',
      notiflixIconColor: '#ff5549',
    },
  });
}

function showInfo(message, position) {
  Notify.info(message, {
    position: position,
    timeout: 5000,
    width: '400px',
    info: {
      background: '#fff',
      textColor: '#26c0d3',
      notiflixIconColor: '#26c0d3',
    },
  });
}

function showSuccess(message, position) {
  Notify.success(message, {
    position: position,
    timeout: 5000,
    width: '400px',
    success: {
      background: '#fff',
      textColor: '#32c682',
      notiflixIconColor: '#32c682',
    },
  });
}
