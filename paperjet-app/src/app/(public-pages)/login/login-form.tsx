"use client";

import { login } from "@/actions/users/login";

export default function LoginForm() {

  const onSubmit = async (formData: FormData) => {
    const res = await login(formData);
    if (res?.errors) {
      alert(Object.values(res.errors).join(", "));
    }
  };

  return (
    <form action={onSubmit}>
      <p>Enter your email:</p>
      <input
        name="email"
        placeholder="Email"
      />
      <p>Enter your password:</p>
      <input
        name="password"
        placeholder="Password"
        type="password"
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
}
