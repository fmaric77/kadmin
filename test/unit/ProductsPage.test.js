// Test provjerava dodavanje novog proizvoda putem forme i pozivanje odgovarajuće API rute.
// Test validira ažuriranje postojećeg proizvoda i pravilno slanje izmijenjenih podataka na backend.
// Test simulira brisanje proizvoda, uključujući korisničku potvrdu i pozivanje API-ja za brisanje.
// Mockiranje axios poziva omogućuje izolirano testiranje bez stvarnih mrežnih zahtjeva.
// flushPromises osigurava da se svi asinhroni zadaci završe prije provjere očekivanja.

// test/unit/ProductsPage.test.js

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import axios from "axios";
import ProductsPage from "@/pages/ProductsPage.vue";

vi.mock("axios");

describe("ProductsPage.vue", () => {
  const sampleProducts = [
    {
      Sifra_proizvoda: 1,
      Naziv: "Nivea man",
      Marka: "Nivea",
      Cijena_proizvoda: 2.0,
    },
    {
      Sifra_proizvoda: 2,
      Naziv: "Axe Deo",
      Marka: "Axe",
      Cijena_proizvoda: 80.0,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: sampleProducts });
  });

  it("adds a new product", async () => {
    axios.post.mockResolvedValue({}); // simulate success response

    const wrapper = mount(ProductsPage);
    await flushPromises();

    wrapper.vm.showAddProductDialog();
    wrapper.vm.form = {
      Naziv: "dex",
      Marka: "das",
      Cijena_proizvoda: 23.0,
    };

    await wrapper.vm.addProduct();
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/products"),
      {
        Naziv: "dex",
        Marka: "das",
        Cijena_proizvoda: 23.0,
      }
    );
    expect(axios.get).toHaveBeenCalled(); // fetchProducts called again
  });

  it("updates an existing product", async () => {
    axios.put.mockResolvedValue({});

    const wrapper = mount(ProductsPage);
    await flushPromises();

    const productToEdit = sampleProducts[0];
    wrapper.vm.editProduct(productToEdit);

    wrapper.vm.form.Naziv = "GIllete";
    wrapper.vm.form.Marka = "Gillete";
    wrapper.vm.form.Cijena_proizvoda = 25.0;

    await wrapper.vm.updateProduct();

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/products/${productToEdit.Sifra_proizvoda}`),
      {
        Sifra_proizvoda: 1,
        Naziv: "GIllete",
        Marka: "Gillete",
        Cijena_proizvoda: 25.0,
      }
    );
    expect(axios.get).toHaveBeenCalled(); // Refresh product list
  });

  it("deletes a product", async () => {
    axios.delete.mockResolvedValue({});
    global.confirm = vi.fn(() => true); // simulate user clicking "OK"

    const wrapper = mount(ProductsPage);
    await flushPromises();

    await wrapper.vm.deleteProduct(2);
    expect(global.confirm).toHaveBeenCalled();
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining("/products/2")
    );
    expect(axios.get).toHaveBeenCalled(); // fetchProducts
  });
});
