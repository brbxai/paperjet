"use client";

import { signup } from "../../../actions/users/signup";

export default function SignupForm() {

  const onSubmit = async (formData: FormData) => {
    const res = await signup(formData);
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
      <button type="submit">Sign up</button>
    </form>
  );
}
