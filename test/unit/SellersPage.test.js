// Dohvaća sve prodavače sa servera i priprema ih za prikaz u tablici.
// Filtrira listu prodavača na osnovu unesenog pojma za pretraživanje.

// Otvara dijalog za dodavanje novog prodavača i resetira formu.

// Dodaje novog prodavača slanjem podataka backendu, zatim osvježava listu.

// Ažurira postojeće podatke prodavača i osvježava prikaz.

// Briše prodavača nakon korisničke potvrde, uz obradu potencijalnih grešaka.

// Omogućuje inline uređivanje određenog polja kod dvostrukog klika.

// Sprema izmjene unesene direktno u ćeliju i šalje ih na server.js

// Reaguje na promjenu kategorije iz dropdown komponente.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import axios from "axios";
import SellersPage from "@/pages/SellersPage.vue";

vi.mock("axios");

describe("SellersPage.vue", () => {
  const sampleSellers = [
    {
      Sifra_prodavaca: 1,
      Ime_prodavaca: "Marko Markić",
      Adresa_prodavaca: "Zagreb",
      E_mail_prodavaca: "marko@example.com",
    },
    {
      Sifra_prodavaca: 2,
      Ime_prodavaca: "Ana Anić",
      Adresa_prodavaca: "Split",
      E_mail_prodavaca: "ana@example.com",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: sampleSellers });
  });

  it("fetches and displays sellers on mount", async () => {
    const wrapper = mount(SellersPage);
    await flushPromises();

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/sellers"));
    expect(wrapper.vm.sellers.length).toBe(2);
  });

  it("adds a new seller", async () => {
    axios.post.mockResolvedValue({});
    const wrapper = mount(SellersPage);
    await flushPromises();

    wrapper.vm.showAddSellerDialog();
    wrapper.vm.form = {
      Ime_prodavaca: "Test Ime",
      Adresa_prodavaca: "Test Adresa",
      E_mail_prodavaca: "test@example.com",
    };

    await wrapper.vm.addSeller();

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/sellers"),
      wrapper.vm.form
    );
    expect(axios.get).toHaveBeenCalled(); // refresh list
  });

  it("updates a seller inline", async () => {
    axios.put.mockResolvedValue({});
    const wrapper = mount(SellersPage);
    await flushPromises();

    const seller = wrapper.vm.sellers[0];
    seller.Ime_prodavaca = "Novo Ime";

    await wrapper.vm.saveChanges(seller, "name");

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/sellers/${seller.Sifra_prodavaca}`),
      seller
    );
  });

  it("deletes a seller", async () => {
    axios.delete.mockResolvedValue({});
    global.confirm = vi.fn(() => true); // simulate OK

    const wrapper = mount(SellersPage);
    await flushPromises();

    await wrapper.vm.deleteSeller(2);

    expect(global.confirm).toHaveBeenCalled();
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining("/sellers/2")
    );
    expect(axios.get).toHaveBeenCalled(); // refresh
  });
});
