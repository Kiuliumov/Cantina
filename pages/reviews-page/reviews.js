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
    let currentPage = 1;
    let reviews = [];

    const form = document.getElementById('reviewForm');
    const messageDiv = document.getElementById('formMessage');

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
        loadReviews();
      } catch (error) {
        messageDiv.textContent = 'Error submitting review.';
        messageDiv.style.color = 'red';
      }
    });

    async function loadReviews() {
      try {
        const snapshot = await db.collection('reviews').orderBy('date', 'desc').get();
        reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        currentPage = 1;
        displayReviews();
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    }

    function displayReviews() {
      const reviewsContainer = document.getElementById('reviewsContainer');
      if (!reviewsContainer) return;

      reviewsContainer.innerHTML = '';

      if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
        removePaginationControls();
        return;
      }

      const totalPages = Math.ceil(reviews.length / reviewsPerPage);
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      const start = (currentPage - 1) * reviewsPerPage;
      const end = start + reviewsPerPage;
      const paginatedReviews = reviews.slice(start, end);

      paginatedReviews.forEach(review => {
        const reviewElem = document.createElement('div');
        reviewElem.className = 'review';

        reviewElem.innerHTML = `
          <h3>${escapeHtml(review.name)} <small>(${review.date})</small></h3>
          <p>Rating: ${'⭐'.repeat(review.rating)} (${review.rating}/5)</p>
          <p>${escapeHtml(review.comment)}</p>
        `;

        reviewsContainer.appendChild(reviewElem);
      });

      addPaginationControls(totalPages);
    }

    function addPaginationControls(totalPages) {
      let paginationContainer = document.getElementById('paginationControls');

      if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'paginationControls';
        paginationContainer.style.marginTop = '1em';
        const reviewsSection = document.querySelector('.reviews-section');
        reviewsSection.appendChild(paginationContainer);
      }

      paginationContainer.innerHTML = '';

      const prevBtn = document.createElement('button');
      prevBtn.textContent = 'Previous';
      prevBtn.disabled = currentPage === 1;
      prevBtn.onclick = () => {
        if (currentPage > 1) {
          currentPage--;
          displayReviews();
        }
      };
      paginationContainer.appendChild(prevBtn);

      const pageInfo = document.createElement('span');
      pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
      pageInfo.style.margin = '0 10px';
      paginationContainer.appendChild(pageInfo);

      const nextBtn = document.createElement('button');
      nextBtn.textContent = 'Next';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.onclick = () => {
        if (currentPage < totalPages) {
          currentPage++;
          displayReviews();
        }
      };
      paginationContainer.appendChild(nextBtn);
    }

    function removePaginationControls() {
      const paginationContainer = document.getElementById('paginationControls');
      if (paginationContainer) {
        paginationContainer.remove();
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    loadReviews();