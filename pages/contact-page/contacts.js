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

const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    formMessage.textContent = 'Please fill in all fields.';
    formMessage.style.color = '#D14343';
    return;
  }

  try {
    await db.collection('contacts').add({
      name,
      email,
      message,
      date: new Date().toISOString()
    });

    formMessage.textContent = 'Message sent successfully. Thank you!';
    formMessage.style.color = '#2E7D32';
    form.reset();
  } catch (error) {
    console.error('Error sending message:', error);
    formMessage.textContent = 'There was an error sending your message. Please try again.';
    formMessage.style.color = '#374151';
  }
});
