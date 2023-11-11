<template>
  <div class="login">
    <h1>Iniciar sesión</h1>
    <form class="ui form" @submit.prevent="onLogin">
      <div class="field">
        <input
          type="text"
          placeholder="Correo electrónico"
          v-model="formData.email"
          :class="{ error: formError.email }"
        />
      </div>
      <div class="field">
        <input
          type="password"
          placeholder="Contraseña"
          v-model="formData.password"
          :class="{ error: formError.password }"
        />
      </div>
      <button type="submit" class="ui button positive" :class="{ loading }">
        Entrar
      </button>
    </form>
    <p @click="changeForm">Crear nueva cuenta</p>
  </div>
</template>

<script>
import { ref } from "vue";
import * as Yup from "yup";
import { auth, signInWithEmailAndPassword } from "../../utils/firebase";
export default {
  name: "Login",
  //Recibimos la función changeForm declarada en Auth  como prop
  props: {
    changeForm: {
      type: Function,
    },
  },
  setup() {
    let formData = {};
    let formError = ref({});
    let loading = ref(false);

    const schemaForm = Yup.object().shape({
      email: Yup.string()
        .email("El correo electrónico no es válido")
        .required("El correo electrónico es obligatorio"),
      password: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es obligatoria"),
    });

    const onLogin = async () => {
      loading.value = true;
      formError.value = {};
      try {
        await schemaForm.validate(formData, { abortEarly: false });

        try {
          const { email, password } = formData;
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          error.code === "auth/invalid-login-credentials"
          ? console.log("Credenciales inválidas") : console.log("Error desconocido");

        }
      } catch (err) {
        err.inner.forEach((error) => {
          formError.value[error.path] = error.message;
        });
      }
      loading.value = false;
    };

    return {
      formData,
      onLogin,
      formError,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: #0f0c29;
  background: -webkit-linear-gradient(to top, #24243e, #302b63, #0f0c29);
  background: linear-gradient(to top, #24243e, #302b63, #0f0c29);

  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
  color: #fff;

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  form {
    input.error {
      border-color: rgb(255, 124, 124);
      background-color: rgba(255, 0, 0, 0.1);
    }

    button {
      width: 100%;
    }
  }

  p {
    text-align: center;
    margin-top: 20px;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
}
</style>
