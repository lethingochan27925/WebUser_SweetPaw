export const API_URL = 'https://sweetpaw-be.azurewebsites.net';

// export async function apiPostAuthNonContent(path, body) {
//   const token = localStorage.getItem('token');
//   const user_id = localStorage.getItem('user_id');

//   console.log('Token gửi lên:', token);

//   const res = await fetch(`${API_URL}${path}`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: body,
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(`API ${path} lỗi: ${res.status} – ${JSON.stringify(data)}`);

//   return data;
// }

// Hàm POST chung (login)
export async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return res.json();
}


export async function apiPostAuth(path, body) {
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');

  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi API');

  return data;
}

// Hàm GET có token (dành cho admin)
export async function apiGetAuth(path) {
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');
  console.log('Token lấy từ localStorage:', token);
  console.log('user_id:', user_id);

  const res = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`API ${path} lỗi: ${res.status}`);
  }

  return res.json();
}


// Hàm PUT
export async function apiPutAuth(path, body) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API ${path} lỗi: ${res.status} – ${msg}`);
  }

  return res.json();
}

//DELETE
// export async function apiDeleteAuth(path) {
//   const token = localStorage.getItem("adminToken");
//   console.log("Token gửi lên:", token);

//   const res = await fetch(`${API_URL}${path}`, {
//     method: "DELETE",
//     headers: {
//       "Authorization": `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) {
//     const msg = await res.text();
//     throw new Error(`API ${path} lỗi: ${res.status} – ${msg}`);
//   }

//   return res.json();
// }

export async function apiDeleteAuth(path) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Nếu lỗi trả về JSON có message
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || `Lỗi ${res.status}`;

    throw new Error(msg);
  }

  return res.json();
}

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
// delete có body
export async function apiDeleteAuthHasBody(path, body) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
<<<<<<< Updated upstream
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  
    // Nếu lỗi trả về JSON có message
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || `Lỗi ${res.status}`;

    throw new Error(msg);
  }

  return res.json();
}

=======
  }
  );
}
>>>>>>> Stashed changes

// Hàm PATCH
export async function apiPatchAuth(path, body) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}${path}`, {
    method: 'PATCH', // <-- Thay đổi duy nhất là METHOD
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  // Nếu lỗi trả về JSON có message
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || `Lỗi ${res.status}`;

    throw new Error(msg);
  }

  return res.json();

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API ${path} lỗi: ${res.status} – ${msg}`);
  }

  // Lưu ý: Cập nhật PATCH có thể trả về 200/204, 
  // nếu API của bạn trả về JSON (ví dụ: đối tượng người dùng đã cập nhật) thì giữ lại res.json()
  return res.json(); 

}

