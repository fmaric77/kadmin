// Ovaj test fajl koristi Vitest za testiranje funkcije login direktno u test fajlu
//provjerava je li funkcija login ispravna i da li vraća očekivane rezultate

import { describe, it, expect } from "vitest";

// Funkcija login direktno u test fajlu
function login(username, password) {
  if (username === "admin" && password === "admin") {
    return true;
  }
  return false;
}

describe("Login Function", () => {
  it("should login successfully with admin/admin", () => {
    const result = login("admin", "admin");
    expect(result).toBe(true);
  });

  it("should fail login with wrong credentials", () => {
    const result = login("admin", "wrongpass");
    expect(result).toBe(false);
  });
});
