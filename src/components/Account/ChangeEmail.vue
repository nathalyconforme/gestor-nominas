<template>
  <form class="ui form change-email" @submit.prevent="onChangeEmail">
    <div class="two fields">
      <input
        class="field"
        v-model="formData.email"
        type="text"
        placeholder="Correo electrónico"
        :class="{ error: formError.email }"
      />
      <input
        class="field"
        v-model="formData.password"
        type="password"
        placeholder="Contraseña actual"
        :class="{ error: formError.password }"
      />
    </div>
    <p v-if="messageError">{{ messageError }}</p>
    <button type="submit" class="ui button primary" :class="loading">
      Actualizar
    </button>
  </form>
</template>

<script>
//Importación de ref de vue
import { ref } from "vue";
//Importación de Yup
import * as Yup from "yup";
//Importación de la reautenticación de firebase
import { reauthenticate } from "../../utils/firebaseFunctions";
//Importación de auth de firebase
import { auth, updateEmail } from "../../utils/firebase";

export default {
  name: "ChangeEmail",
  setup() {
    //Definimos variables reactivas
    let formData = {};
    let formError = ref({});
    let messageError = ref("");
    let loading = ref(false);

    //Esquema de validación
    const schemaForm = Yup.object().shape({
      email: Yup.string().email().required(true),
      password: Yup.string().min(6, true).required(true),
    });

    //Función para cambiar el email
    const onChangeEmail = async () => {
      loading.value = true;
      //Cada vez que se ejecute la función, reseteamos el formError
      //Para que solo se muestren los errores cuando el usuario envíe el formulario
      formError.value = {};

      try {
        await schemaForm.validate(formData, { abortEarly: false });
        try {
          const { email, password } = formData;
          await reauthenticate(password);
          await updateEmail(auth.currentUser, email);
          console.log(auth.currentUser);
        } catch (error) {
          messageError.value = error.message;
          // error.code === "auth/invalid-login-credentials"
          //   ? messageError.value = "Credenciales inválidas"
          //   : ("Error desconocido");
        }
      } catch (err) {
        err.inner.forEach((error) => {
          formError.value[error.path] = error.message;
        });
        loading.value = false;
        // email.value = "";
      }
    };

    return {
      formData,
      formError,
      messageError,
      loading,
      onChangeEmail,
    };
  },
};
</script>

<style lang="scss" scoped>
.ui.form.change-email {
  text-align: center;

  .two.fields {
    display: flex;
    justify-content: space-between;

    .field {
      margin: 0 5px;
    }

    .field:first-child {
      border-left: 1px solid #ccc;
    }
  }

  input.error {
    border-color: #faaa;
    background-color: #ffeded;
  }
  .ui.button {
    margin-top: 20px;
  }
}
</style>
