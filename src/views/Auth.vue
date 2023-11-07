<template>
  <div class="auth">
    <!-- Mostramos el componente que queramos dependiendo de showLogin, en este caso Login ya que es true.
    Además a cada componente se le añade :changeForm-->
    <Login v-if="showLogin" :changeForm="changeForm" />
    <!-- Si showLogin es false, se muestra Register -->
    <Register v-if="!showLogin" :changeForm="changeForm" />
  </div>
</template>

<script>
//Importación de los componentes para Auth
import Login from "../components/Auth/Login.vue";
import Register from "../components/Auth/Register.vue";

//Importación de ref para mostrar el componente que queramos (Login o Register)
import { ref } from "vue";

export default {
  name: "Auth",
  components: {
    Login,
    Register,
  },
  setup() {
    //Definimos showLogin con ref para que sea reactivo
    let showLogin = ref(true);

    //Definimos una función para cambiar entre Login y Register
    //Si showLogin es true, se muestra Login, si es false, se muestra Register
    const changeForm = () => {
      showLogin.value = !showLogin.value;
    };

    return {
      //Devolvemos variables y funciones para que sea accesible desde el template
      showLogin,
      changeForm,
    };
  },
};
</script>

<style lang="scss" scoped>
.auth {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #c33764;
  background: -webkit-linear-gradient(to left, #c33764, #1d2671);
  background: linear-gradient(to left, #c33764, #1d2671);
}
</style>
