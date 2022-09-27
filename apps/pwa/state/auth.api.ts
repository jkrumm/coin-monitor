import { LoginInterface } from '@cm/types';

export async function login(loginDto: LoginInterface) {
  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: loginDto.email, password: loginDto.password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

export async function getUser() {
  await fetch('/api/auth/');
}
