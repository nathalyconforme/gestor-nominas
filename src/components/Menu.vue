<template>
  <div class="ui secondary menu">
    <div class="ui container">
      <div class="menu left">
        <router-link class="item" to="/">Nóminas</router-link>
      </div>
      <div class="menu center">
        <router-link class="item" to="/">
          <img src="../assets/nomina.png" alt="" class="ui small image" />
        </router-link>
      </div>
      <div class="menu right">
        <router-link class="item" to="/account">Hola, {{ user.displayName || user.email }}</router-link>
        <span class="ui item logout" @click="logout">
          <i class="sign-out icon"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
//Importación de Computed de vue
import { computed } from "vue";
// Importación de auth
import { auth } from "../utils/firebase";
//Importación de useStore de vuex
import { useStore } from "vuex";
export default {
  name: "Menu",
  setup() {
    //Importación de store
    const store = useStore();
    //Variable para obtener el usuario
    const user = computed(() => store.state.user);
    //Función para cerrar sesión
    const logout = () => {
      auth.signOut();
      store.dispatch("setUser", null);
    };
    return {
      logout,
      user,
    };
  },
};
</script>

<style lang="scss" scoped>
.ui.menu.secondary {
  background-color: #292438;

  .item {
    color: #fff;

    &:hover {
      color: rgb(170, 255, 217);
    }
  }

  .menu.left {
    width: 50%;
  }
  .menu.right {
    width: 50%;
    justify-content: flex-end;

    .logout:hover {
      cursor: pointer;
      color: rgb(205, 75, 75);
    }
  }
  .menu.center {
    background-color: #292438;
    border-radius: 50%;
    position: relative;
    top: 15px;
    padding: 15px;
    margin: -15px;

    &:hover {
      cursor: pointer;
      box-shadow: 0px 10px 10px -3px rgba(0, 0, 0, 0.25);
      -webkit-box-shadow: 0px 10px 10px -3px rgba(0, 0, 0, 0.25);
      -moz-box-shadow: 0px 10px 10px -3px rgba(0, 0, 0, 0.25);
    }

    .ui.image {
      width: 40px;
    }
  }
}
</style>
