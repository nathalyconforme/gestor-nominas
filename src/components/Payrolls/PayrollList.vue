<template>
  <div class="payroll-list">
    <p class="payroll-list__not-found" v-if="payrolls?.length === 0">
      No tienes ninguna nómina, sube tu primera nómina
    </p>
    <div
      class="payroll-list__payroll"
      v-for="payroll in payrolls"
      :key="payroll.id"
    >
      <p>{{ formatDate(payroll.dateCreated) }}</p>
      <div class="action">
        <a :href="payroll.payrollUrl" target="_blank" class="ui button positive"
          >Descargar</a
        >
        <a class="ui button red" @click="deletePayroll(payroll.id)">Eliminar</a>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db, doc, deleteDoc } from "../../utils/firebase";
import moment from "moment";
import "moment/locale/es";
export default {
  name: "PayrollList",
  props: {
    payrolls: {
      type: Array,
    },
    getPayrolls: {
      type: Function,
    },
  },
  setup(props) {
    /* Función para formatear la fecha */
    const formatDate = (date) => {
      return moment(date).format("MMMM [del] YYYY");
    };
    /* Función para eliminar una nómina */
    const deletePayroll = async (id) => {
      try {
        const userID = auth.currentUser.uid;
        await deleteDoc(doc(db, userID, id));
        console.log("Se ha eliminado la nómina " + id);
        props.getPayrolls();
      } catch (error) {
        console.log(error);
      }
    };
    return {
      formatDate,
      deletePayroll,
    };
  },
};
</script>

<style lang="scss" scoped>
.payroll-list {
  &__not-found {
    text-align: center;
    font-size: 20px;
  }
  &__payroll {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;

    p {
      margin: 0;
      text-transform: uppercase;
      font-weight: bold;
    }
  }
}
</style>
