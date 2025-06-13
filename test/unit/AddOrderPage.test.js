/*
  Testovi za komponentu AddOrderPage:

  1. Testira se ispravno renderiranje forme i input polja.
     - Provjerava se da input elementi postoje.
     - Simulira se unos vrijednosti u polja i provjerava njihova ažuriranja.

  2. Testira se ponašanje prilikom submit događaja forme.
     - Simulira se unos podataka u formu.
     - Simulira se submit forme.
     - Provjerava se je li  forma nakon submit-a resetira na početne prazne vrijednosti,
       što implicira je funkcija addOrder pozvana i izvršena.
*/

import { mount } from "@vue/test-utils";
import AddOrderPage from "@/pages/AddOrderPage.vue";

// Mock Quasar komponente
const QuasarComponents = {
  "q-page": { template: "<div><slot /></div>" },
  "q-card": { template: "<div><slot /></div>" },
  "q-card-section": { template: "<div><slot /></div>" },
  "q-form": { template: "<form><slot /></form>" },
  "q-input": {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: `<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`,
  },
  "q-btn": { template: "<button><slot /></button>" },
};

// Mock Quasar plugin za Vue.use
const mockQuasar = {
  install: () => {},
};

describe("AddOrderPage", () => {
  it("renderira form i unosi podatke", async () => {
    const wrapper = mount(AddOrderPage, {
      global: {
        components: QuasarComponents,
        plugins: [mockQuasar],
      },
    });

    const inputs = wrapper.findAll("input");
    expect(inputs.length).toBeGreaterThan(0);

    const firstInput = inputs[0];
    await firstInput.setValue("123");

    expect(firstInput.element.value).toBe("123");
  });

  it("poziva addOrder na submit forme i resetira formu", async () => {
    const wrapper = mount(AddOrderPage, {
      global: {
        components: QuasarComponents,
        plugins: [mockQuasar],
      },
    });

    // Postavi vrijednosti u input polje
    await wrapper.findAll("input")[0].setValue("123");
    expect(wrapper.vm.form.orderCode).toBe("123");

    // Simuliraj submit forme
    await wrapper.find("form").trigger("submit.prevent");

    // Provjeri je li forma resetirana (što implicira da je addOrder pozvan)
    expect(wrapper.vm.form.orderCode).toBe("");
    expect(wrapper.vm.form.sellerCode).toBe("");
    expect(wrapper.vm.form.customerCode).toBe("");
    expect(wrapper.vm.form.orderDate).toBe("");
    expect(wrapper.vm.form.name).toBe("");
  });
});
