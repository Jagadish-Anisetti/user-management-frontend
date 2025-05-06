const apiUrl = 'https://user-management-backend-thr2.onrender.com';

if (location.pathname.includes('view.html')) {
  let currentPage = 1;
  let currentStatus = '';
  let currentSearch = '';
  let totalPages = 1;

  const fetchUsers = async () => {
    const res = await fetch(`${apiUrl}?page=${currentPage}&search=${currentSearch}&status=${currentStatus}`);
    const { users, totalPages: total } = await res.json();
    totalPages = total;

    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = users.map((u, i) => `
      <tr>
        <td>${(currentPage - 1) * 10 + i + 1}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.phone}</td>
        <td>${u.city}</td>
        <td>${u.status}</td>
      </tr>
    `).join('');

    renderPagination();
  };

  function renderPagination() {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    pageNumbersContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = (i === currentPage) ? 'active' : '';
      btn.onclick = () => {
        currentPage = i;
        fetchUsers();
      };
      pageNumbersContainer.appendChild(btn);
    }

    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
  }

  document.getElementById('prevBtn').onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      fetchUsers();
    }
  };

  document.getElementById('nextBtn').onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchUsers();
    }
  };

  document.getElementById('searchInput').oninput = (e) => {
    currentSearch = e.target.value;
    currentPage = 1;
    fetchUsers();
  };

  document.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.onchange = (e) => {
      currentStatus = e.target.value;
      currentPage = 1;
      fetchUsers();
    };
  });

  fetchUsers();
}
