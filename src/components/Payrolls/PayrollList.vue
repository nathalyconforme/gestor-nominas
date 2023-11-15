<template>
  <div class="payroll-list">
    <p class="payroll-list__not-found" v-if="payrolls?.length === 0">
      No tienes ninguna nómina, sube tu primera nómina
    </p>
    <div class="payroll-list__payroll"
    v-for="payroll in payrolls" :key="payroll.id">
    <p>{{formatDate(payroll.dateCreated)}}</p>
    <div class="action">
      <a href="#" class="ui button positive">Descargar</a>
      <a class="ui button red">Eliminar</a>
    </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import "moment/locale/es";
export default {
  name: "PayrollList",
  props: {
    payrolls: {
      type: Array,
    },
  },
  setup(){
    const formatDate = (date) => {
      return moment(date).format("MMMM [del] YYYY");
    };
    return {
      formatDate,
    };
  }
};
</script>

<style lang="scss" scoped>
.payroll-list{
  &__not-found{
    text-align: center;
    font-size: 20px;
  }
  &__payroll{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;

    p{
      margin: 0;
      text-transform: uppercase;
      font-weight: bold;
    }
  }
}
</style>
