const firebaseConfig = {
  apiKey: "AIzaSyAj4hbemsnaFT6kaX3uffXiTf93ZdQQeWs",
  authDomain: "reviews-7bc09.firebaseapp.com",
  projectId: "reviews-7bc09",
  storageBucket: "reviews-7bc09.firebasestorage.app",
  messagingSenderId: "1087527214005",
  appId: "1:1087527214005:web:b08ba8e386994a1e3017fc",
  measurementId: "G-9503YFZX7X"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const reviewsPerPage = 5;
let currentSort = 'date-desc';

const form = document.getElementById('reviewForm');
const messageDiv = document.getElementById('formMessage');
const sortSelect = document.getElementById('sortSelect');
const reviewsContainer = document.getElementById('reviewsContainer');

const paginationContainer = document.createElement('div');
paginationContainer.id = 'paginationControls';
paginationContainer.style.marginTop = '1em';
document.querySelector('.reviews-section').appendChild(paginationContainer);

let lastVisible = null;
let firstVisible = null;
let pageStack = [];

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  pageStack = [];
  loadReviews('first');
});

form.addEventListener('submit', async e => {
  e.preventDefault();

  const name = form.name.value.trim();
  const rating = form.rating.value;
  const comment = form.comment.value.trim();

  if (!name || !rating || !comment) {
    messageDiv.textContent = 'Please fill in all fields.';
    messageDiv.style.color = 'red';
    return;
  }

  const newReview = {
    name,
    rating: parseInt(rating),
    comment,
    date: new Date().toISOString().split('T')[0],
    verified: false
  };

  try {
    await db.collection('reviews').add(newReview);
    messageDiv.textContent = 'Thank you for your review!';
    messageDiv.style.color = 'green';
    form.reset();
    pageStack = [];
    loadReviews('first');
  } catch (error) {
    messageDiv.textContent = 'Error submitting review.';
    messageDiv.style.color = 'red';
  }
});

function getOrderParams(sortVal) {
  switch(sortVal) {
    case 'date-asc': return ['date', 'asc'];
    case 'date-desc': return ['date', 'desc'];
    case 'rating-asc': return ['rating', 'asc'];
    case 'rating-desc': return ['rating', 'desc'];
    default: return ['date', 'desc'];
  }
}

async function loadReviews(direction = 'first') {
  const [orderField, orderDirection] = getOrderParams(currentSort);
  let query = db.collection('reviews').orderBy(orderField, orderDirection).limit(reviewsPerPage);

  if (direction === 'next' && lastVisible) {
    query = query.startAfter(lastVisible);
  } else if (direction === 'prev' && firstVisible && pageStack.length > 1) {
    pageStack.pop();
    const prevCursor = pageStack[pageStack.length - 1];
    query = db.collection('reviews').orderBy(orderField, orderDirection).startAt(prevCursor).limit(reviewsPerPage);
  } else if (direction === 'first') {
    pageStack = [];
  }

  try {
    const snapshot = await query.get();

    if (snapshot.empty) {
      reviewsContainer.innerHTML = '<p>No reviews found.</p>';
      updatePaginationButtons(false, false);
      return;
    }

    reviewsContainer.innerHTML = '';
    snapshot.docs.forEach(doc => {
      const review = doc.data();
      const div = document.createElement('div');
      div.className = 'review';
      div.innerHTML = `
        <h3>${escapeHtml(review.name)} <small>(${review.date})</small></h3>
        <p>Rating: ${'⭐'.repeat(review.rating)} (${review.rating}/5)</p>
        <p>${escapeHtml(review.comment)}</p>
      `;
      reviewsContainer.appendChild(div);
    });

    firstVisible = snapshot.docs[0];
    lastVisible = snapshot.docs[snapshot.docs.length - 1];

    if (direction === 'next') pageStack.push(firstVisible);
    if (direction === 'first') pageStack.push(firstVisible);

    updatePaginationButtons(pageStack.length > 1, snapshot.docs.length === reviewsPerPage);

  } catch (error) {
    console.error('Error loading reviews:', error);
  }
}

function updatePaginationButtons(canGoBack, canGoForward) {
  paginationContainer.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.disabled = !canGoBack;
  prevBtn.onclick = () => {
    if (canGoBack) loadReviews('prev');
  };
  paginationContainer.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.disabled = !canGoForward;
  nextBtn.onclick = () => {
    if (canGoForward) loadReviews('next');
  };
  paginationContainer.appendChild(nextBtn);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

loadReviews('first');
