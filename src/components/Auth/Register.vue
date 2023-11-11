<template>
  <div class="register">
    <h1>Crear cuenta</h1>
    <!-- Creación del formulario de registro -->
    <!-- Al hacer submit, se ejecuta la función onRegister y prevenimos que se
    recargue la página -->
    <form class="ui form" @submit.prevent="onRegister">
      <div class="field">
        <!-- En los inputs usamos v-model para guardar en el formData los
        valores introducidos -->
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
      <div class="field">
        <input
          type="password"
          placeholder="Repetir contraseña"
          v-model="formData.repeatPassword"
          :class="{ error: formError.repeatPassword }"
        />
      </div>
      <button type="submit" class="ui button positive" :class="{loading}">Regístrate</button>
    </form>
    <!-- Al hacer click, la función changeForm que hemos recibido como prop
    nos lleva al Login -->
    <p @click="changeForm">Iniciar sesión</p>
  </div>
</template>

<script>
//Importamos yup para validar el formulario
import * as Yup from "yup";
import { ref } from "vue";

// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth ,createUserWithEmailAndPassword } from "../../utils/firebase";

export default {
  name: "Register",
  props: {
    //Recibimos la función changeForm declarada en Auth  como prop
    changeForm: {
      type: Function,
    },
  },
  setup() {
    //Creamos variable formDataa
    let formData = {};

    //Creamos objeto formError con ref para que sea reactivo
    let formError = ref({});

    //Creación de un spinner para mostrar mientras se registra el usuario
    let loading = ref(false);

    //Creamos función de validación de formulario con Yup
    const schemaForm = Yup.object().shape({
      email: Yup.string()
        .email("Introduce un email válido")
        .required("El email es obligatorio"),
      password: Yup.string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
      repeatPassword: Yup.string()
        .required("La contraseña es obligatoria")
        .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir"),
    });

    //Creamos función que se ejecutará al hacer submit
    const onRegister = async () => {
      //Mostramos el spinner
      loading.value = true;
      formError.value = {};

      try {
        await schemaForm.validate(formData, { abortEarly: false });

        try {
          const { email, password } = formData;
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
          console.log(error);
        }
      } catch (err) {
        err.inner.forEach((error) => {
          formError.value[error.path] = error.message;
        });
      }
      //Ocultamos el spinner
      loading.value = false;
    };
    return {
      formData,
      onRegister,
      formError,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.register {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);

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
