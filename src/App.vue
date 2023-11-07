<template>
  <!-- Si el usuario existe, se muestra el router-view -->
  <template v-if="user">
    <router-view />
  </template>
  <!-- Si el usuario no existe y no es undefined, se muestra el login y el registro -->
  <Auth v-if="!user && user !== undefined"/>
</template>
<script>
/*
 * Importaciones:
 */
//Importación de los componentes
import Auth from "./views/Auth.vue";

// Computed para que se actualice el usuario(sea reactivo)
import { computed, onMounted } from "vue";
//Para usar el store
import { useStore } from "vuex";
import { auth } from "./utils/firebase";

export default {
  name: "App",
  components: {
    Auth,
  },
  setup() {
    //Declaramos el store
    const store = useStore();
    const user = computed(() => store.state.user);
    //Accedemos a los datos del usuario guardados en el store
    // const user = store.state.user;

    onMounted(() => {
      auth.onAuthStateChanged((user) => {
        store.commit("setUser", user);
        if (user) {
          console.log("Usuario logueado");
        } else {
          console.log("Usuario no logueado");
        }
      });
    });

    return {
      user,
    };
  },
};
</script>
