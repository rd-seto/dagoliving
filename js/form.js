// Import Supabase Client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/+esm'

// Initialize Supabase client
const supabaseUrl = "https://ojdzrskomubfkblpjxcb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZHpyc2tvbXViZmtibHBqeGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3ODcyNjksImV4cCI6MjA0NjM2MzI2OX0.x1S_2D5c0DLI5th7rlEiXBhfzSHE7Z1LfwOFU4nKr6Q";
const supabase = createClient(supabaseUrl, supabaseKey);

// Utility functions
const showLoading = () => {
  document.querySelector('#formSpinner').classList.remove('d-none');
  document.querySelector('button[type="submit"]').disabled = true;
};

const hideLoading = () => {
  document.querySelector('#formSpinner').classList.add('d-none');
  document.querySelector('button[type="submit"]').disabled = false;
};

const showSuccess = (message) => {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  document.querySelector('#promoForm').appendChild(successDiv);
  successDiv.style.display = 'block';
  setTimeout(() => successDiv.remove(), 5000);
};

const showError = (element, message) => {
  element.classList.add('is-invalid');
  const feedback = document.createElement('div');
  feedback.className = 'invalid-feedback';
  feedback.textContent = message;
  element.parentNode.appendChild(feedback);
};

const clearErrors = () => {
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
};

// Form validation
const validateForm = (formData) => {
  let isValid = true;
  clearErrors();

  // Validate name
  if (formData.get('name').trim().length < 3) {
    showError(document.querySelector('input[name="name"]'), 
      'Nama harus minimal 3 karakter');
    isValid = false;
  }

  // Validate phone
  const phoneRegex = /^[0-9]{10,13}$/;
  if (!phoneRegex.test(formData.get('phone'))) {
    showError(document.querySelector('input[name="phone"]'), 
      'Nomor telepon harus 10-13 digit');
    isValid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.get('email'))) {
    showError(document.querySelector('input[name="email"]'), 
      'Email tidak valid');
    isValid = false;
  }

  return isValid;
};

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('promoForm');
  
  if (form) {
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const formData = new FormData(form);
      
      if (!validateForm(formData)) {
        return;
      }

      showLoading();

      try {
        const { data, error } = await supabase
          .from('promos')
          .insert([{
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;

        // Clear form
        form.reset();
        showSuccess('Terima kasih! Data Anda berhasil dikirim.');
        
      } catch (error) {
        console.error('Error:', error);
        alert(`Gagal mengirim data: ${error.message}`);
      } finally {
        hideLoading();
      }
    });

    // Real-time validation on input
    form.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', function() {
        this.classList.remove('is-invalid');
        const feedback = this.parentNode.querySelector('.invalid-feedback');
        if (feedback) feedback.remove();
      });
    });
  }
});