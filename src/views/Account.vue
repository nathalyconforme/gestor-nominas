<template>
  <div class="account">
    <BasicLayout />
    <h1>Bienvenido a los ajustes</h1>
    <div class="account__section">
      <p class="title">
        Cambiar nombre
        <span v-if="user.displayName">({{ user.displayName }})</span>
      </p>
      <ChangeName />
    </div>
  </div>
</template>

<script>
//Importación de computed de vue
import { computed } from "vue";
//Importación de useStore de vuex
import { useStore } from "vuex";

//Importación de BasicLayout
import BasicLayout from "@/layouts/BasicLayout.vue";
//Importación de changeName
import ChangeName from "@/components/Account/ChangeName.vue";
export default {
  name: "Account",
  components: {
    BasicLayout,
    ChangeName,
  },
  setup() {
    //Importación de store
    const store = useStore();
    //Importación de user
    const user = computed(() => store.state.user);
    return {
      user,
    };
  },
};
</script>

<style lang="scss" scoped>
.account {
  h1 {
    margin: 50px 0;
    text-align: center;
  }

  &__section {
    //centrar el contenido
    width: 90%;
    margin: 0 auto;
    //estilos
    position: relative;
    padding: 10px;
    border: 1px solid #ccc;
    padding-top: 25px;
    margin-top: 40px;
    border-radius: 5px;

    .title {
      position: absolute;
      top: -15px;
      background-color: #292438;
      color: #fff;
      padding: 2px 10px;
      border-radius: 5px;
    }
  }
}
</style>
