// Testna datoteka koristi Vitest za testiranje Vue komponente "OrdersPage"
// - Mockira se axios kako bi se kontrolirale vanjske HTTP pozive tijekom testiranja
// - Testovi su grupirani pomoću `describe` bloka

// Test 1: Provjerava inicijalno dohvaćanje podataka prilikom montiranja komponente
// - Simulira tri GET zahtjeva za narudžbe, kupce i prodavače
// - Očekuje se da komponenta pohrani odgovore ispravno u svoja reaktivna polja

// Test 2: Testira funkcionalnost pretrage narudžbi
// - Postavlja se početni skup narudžbi, kupaca i prodavača
// - Pretraga se provodi po imenu kupca i načinu plaćanja
// - Očekuje se da se `filteredOrders` pravilno filtrira prema unesenom pojmu

// Test 3: Provjerava validaciju forme za dodavanje narudžbi
// - Testira se scenarij s praznim i potpuno ispunjenim podacima u formi
// - Očekuje se da `validateForm()` vraća false za neispravne podatke i true za ispravne

// Svi testovi koriste `flushPromises()` za obradu asinhronih operacija prije provjere stanja
// Testovi potvrđuju osnovnu funkcionalnost vezanu za učitavanje podataka, filtriranje i validaciju forme
// test/unit/OrdersPage.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import OrdersPage from "@/pages/OrdersPage.vue";
import axios from "axios";

vi.mock("axios");

describe("OrdersPage.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches orders, customers and sellers on mount", async () => {
    const ordersData = [
      {
        Sifra_narudzbe: 1,
        SIFRA_KUPCA: 10,
        SIFRA_PRODAVACA: 20,
        Datum_narudzbe: "2025-01-01",
        Nacin_placanja: "Gotovina",
        Cijena_narudzbe: 100,
      },
    ];
    const customersData = [
      { Sifra_kupca: 10, Ime_kupca: "Ivan", Prezime_kupca: "Horvat" },
    ];
    const sellersData = [{ Sifra_prodavaca: 20, Ime_prodavaca: "Marko" }];

    axios.get.mockImplementation((url) => {
      if (url.endsWith("/orders")) return Promise.resolve({ data: ordersData });
      if (url.endsWith("/customers"))
        return Promise.resolve({ data: customersData });
      if (url.endsWith("/sellers"))
        return Promise.resolve({ data: sellersData });
      return Promise.reject(new Error("Unknown URL"));
    });

    const wrapper = mount(OrdersPage);

    await flushPromises();

    expect(axios.get).toHaveBeenCalledTimes(3);
    expect(wrapper.vm.orders).toEqual(ordersData);
    expect(wrapper.vm.customers).toEqual([{ label: "Ivan Horvat", value: 10 }]);
    expect(wrapper.vm.sellers).toEqual([{ label: "Marko", value: 20 }]);
  });

  it("filters orders by search term", async () => {
    const ordersData = [
      {
        Sifra_narudzbe: 1,
        SIFRA_KUPCA: 10,
        SIFRA_PRODAVACA: 20,
        Datum_narudzbe: "2025-01-01",
        Nacin_placanja: "Gotovina",
        Cijena_narudzbe: 100,
      },
      {
        Sifra_narudzbe: 2,
        SIFRA_KUPCA: 11,
        SIFRA_PRODAVACA: 21,
        Datum_narudzbe: "2025-02-02",
        Nacin_placanja: "Kreditna kartica",
        Cijena_narudzbe: 200,
      },
    ];
    const customersData = [
      { Sifra_kupca: 10, Ime_kupca: "Ivan", Prezime_kupca: "Horvat" },
      { Sifra_kupca: 11, Ime_kupca: "Ana", Prezime_kupca: "Kovač" },
    ];
    const sellersData = [
      { Sifra_prodavaca: 20, Ime_prodavaca: "Marko" },
      { Sifra_prodavaca: 21, Ime_prodavaca: "Luka" },
    ];

    axios.get.mockImplementation((url) => {
      if (url.endsWith("/orders")) return Promise.resolve({ data: ordersData });
      if (url.endsWith("/customers"))
        return Promise.resolve({ data: customersData });
      if (url.endsWith("/sellers"))
        return Promise.resolve({ data: sellersData });
      return Promise.reject(new Error("Unknown URL"));
    });

    const wrapper = mount(OrdersPage);
    await flushPromises();

    wrapper.vm.searchTerm = "ivan";
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredOrders.length).toBe(1);
    expect(wrapper.vm.filteredOrders[0].Sifra_narudzbe).toBe(1);

    wrapper.vm.searchTerm = "kreditna";
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredOrders.length).toBe(1);
    expect(wrapper.vm.filteredOrders[0].Sifra_narudzbe).toBe(2);
  });

  it("validates form before adding order", async () => {
    const wrapper = mount(OrdersPage);

    wrapper.vm.form = {
      SIFRA_KUPCA: null,
      SIFRA_PRODAVACA: null,
      Datum_narudzbe: "",
      Nacin_placanja: "",
      Cijena_narudzbe: null,
    };

    const valid = wrapper.vm.validateForm();
    expect(valid).toBe(false);

    wrapper.vm.form = {
      SIFRA_KUPCA: 10,
      SIFRA_PRODAVACA: 20,
      Datum_narudzbe: "2025-01-01",
      Nacin_placanja: "Gotovina",
      Cijena_narudzbe: 100,
    };

    expect(wrapper.vm.validateForm()).toBe(true);
  });
});
