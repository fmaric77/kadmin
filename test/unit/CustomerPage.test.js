/*
  Testovi za CustomersPage komponentu:

  1. Dohvaćanje podataka:
     - Provjerava da se axios.get poziva s ispravnim URL-om.
     - Provjerava da se dohvaćeni kupci pohranjuju u stanje komponente.

  2. Filtriranje kupaca:
     - Postavlja se vrijednost searchTerm.
     - Provjerava se da filteredCustomers vraća ispravan filtrirani rezultat.

  3. Dijalog za dodavanje kupca:
     - Poziva se metoda za otvaranje dijaloga.
     - Provjerava se da se dijalog prikaže i da se postavi flag isEditing na false.
     - Poziva se metoda za zatvaranje dijaloga i provjerava da se dijalog sakrije.
*/

import { mount } from "@vue/test-utils";
import { vi } from "vitest";
import axios from "axios";
import CustomersPage from "@/pages/CustomersPage.vue";

// Mock axios
vi.mock("axios");

// Kreiraj primjerke kupaca
const mockCustomers = [
  {
    Sifra_kupca: 1,
    Ime_kupca: "Ivan",
    Prezime_kupca: "Ivić",
    Adresa_kupca: "Ulica 1",
    E_mail: "ivan@example.com",
    isEditingName: false,
    isEditingSurname: false,
    isEditingAddress: false,
    isEditingEmail: false,
  },
  {
    Sifra_kupca: 2,
    Ime_kupca: "Ana",
    Prezime_kupca: "Anić",
    Adresa_kupca: "Ulica 2",
    E_mail: "ana@example.com",
    isEditingName: false,
    isEditingSurname: false,
    isEditingAddress: false,
    isEditingEmail: false,
  },
];

describe("CustomersPage", () => {
  beforeEach(() => {
    // Mockiraj da axios.get vraća mock podatke
    axios.get.mockResolvedValue({ data: mockCustomers });
  });

  it("dohvata kupce i postavlja ih u stanje", async () => {
    const wrapper = mount(CustomersPage, {
      global: {
        stubs: [
          "q-td",
          "q-tr",
          "q-table",
          "q-dialog",
          "q-input",
          "q-btn",
          "q-card",
          "q-card-section",
          "q-page",
          "q-form",
        ],
      },
    });

    // Čekaj da se onMounted izvrši i da se učitaju podaci
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick(); // možda treba dvaput zbog reactive sustava

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/customers")
    );
    expect(wrapper.vm.customers.length).toBe(mockCustomers.length);
  });

  it("filtrira kupce prema searchTerm", async () => {
    const wrapper = mount(CustomersPage, {
      global: {
        stubs: [
          "q-td",
          "q-tr",
          "q-table",
          "q-dialog",
          "q-input",
          "q-btn",
          "q-card",
          "q-card-section",
          "q-page",
          "q-form",
        ],
      },
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Postavi searchTerm i provjeri filtriranu listu
    wrapper.vm.searchTerm = "ivan";
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredCustomers.length).toBe(1);
    expect(wrapper.vm.filteredCustomers[0].Ime_kupca).toBe("Ivan");
  });

  it("otvara i zatvara dijalog za dodavanje kupca", async () => {
    const wrapper = mount(CustomersPage, {
      global: {
        stubs: [
          "q-td",
          "q-tr",
          "q-table",
          "q-dialog",
          "q-input",
          "q-btn",
          "q-card",
          "q-card-section",
          "q-page",
          "q-form",
        ],
      },
    });

    // Pozovi metode za otvaranje i zatvaranje dijaloga
    wrapper.vm.showAddCustomerDialog();
    expect(wrapper.vm.isDialogOpen).toBe(true);
    expect(wrapper.vm.isEditing).toBe(false);

    wrapper.vm.closeDialog();
    expect(wrapper.vm.isDialogOpen).toBe(false);
  });
});
