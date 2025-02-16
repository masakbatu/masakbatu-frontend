// Fungsi untuk mengecek apakah pengguna sudah login
const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
};

// Fungsi untuk menampilkan modal
const showModal = (message) => {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modalMessage");
  modalMessage.textContent = message;
  modal.style.display = "block";

  // Tutup modal saat tombol close diklik
  document.getElementById("closeModal").onclick = () => {
    modal.style.display = "none";
  };

  // Tutup modal saat klik di luar modal
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
};

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    showModal(data.message || data.error);
  }
});

// Register
document
  .getElementById("registerForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      showModal("Registration successful! Please login.");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000); // Redirect ke halaman login setelah 2 detik
    } else {
      showModal(data.message || data.error);
    }
  });

// Logout
document.getElementById("logoutButton")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// Cek auth saat membuka dashboard
if (window.location.pathname.includes("dashboard.html")) {
  checkAuth();
}

// Fungsi untuk mengambil data profil pengguna
const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      document.getElementById("username").textContent = data.user.username;
      document.getElementById("email").textContent = data.user.email;
      document.getElementById("joined").textContent = new Date(
        data.user.created_at
      ).toLocaleDateString();
    } else {
      showModal(data.message || "Failed to fetch profile data.");
    }
  } catch (error) {
    showModal("An error occurred. Please try again.");
  }
};

// Jalankan fungsi fetchUserProfile saat halaman profil dimuat
if (window.location.pathname.includes("profile.html")) {
  fetchUserProfile();
}

// Fungsi untuk menampilkan modal sukses untuk tombol add quotes
const showSuccessModal = (message) => {
  const modal = document.getElementById("successModal");
  const successMessage = document.getElementById("successMessage");
  successMessage.textContent = message;
  modal.style.display = "block";

  // Tutup modal saat tombol close diklik
  document.getElementById("closeSuccessModal").onclick = () => {
    modal.style.display = "none";
  };

  // Tutup modal saat klik di luar modal
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
};

// Fungsi untuk menambahkan quotes
document
  .getElementById("addQuoteForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const quoteInput = document.getElementById("quote");
    const quote = quoteInput.value;
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/auth/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quote }),
    });
    const data = await response.json();
    if (response.ok) {
      showSuccessModal("Quote added successfully!");
      quoteInput.value = ""; // Kosongkan inputan
    } else {
      showModal(data.message || "Failed to add quote.");
    }
  });

// Fungsi untuk mengambil dan menampilkan quotes (hanya di halaman quotes.html)
const fetchQuotes = async () => {
  const token = localStorage.getItem("token");
  const quotesList = document.getElementById("quotesList");
  quotesList.innerHTML = ""; // Kosongkan daftar quotes

  try {
    const response = await fetch("http://localhost:3000/api/auth/quotes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      data.quotes.forEach((quote) => {
        const quoteElement = document.createElement("div");
        quoteElement.className = "quote";
        quoteElement.innerHTML = `
            <p><strong>${quote.username}</strong> - <em>${new Date(
          quote.created_at
        ).toLocaleString()}</em></p>
            <p>${quote.quote}</p>
          `;
        quotesList.appendChild(quoteElement);
      });
    } else {
      showModal(data.message || "Failed to fetch quotes.");
    }
  } catch (error) {
    showModal("An error occurred. Please try again.");
  }
};

// Jalankan fetchQuotes hanya di halaman quotes.html
if (window.location.pathname.includes("quotes.html")) {
  fetchQuotes();
}
