'use strict';

const ingresos = [];

const egresos = [];

let cargarApp = () => {
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
}

document.addEventListener('DOMContentLoaded', cargarApp);

let agregarDato = () => {
    let formulario = document.forms['formulario'];
    let tipo = formulario['tipo'];
    let descripcion = formulario['descripcion'];
    let valor = formulario['valor'];
    if(descripcion.value !== '' && valor.value !== ''){
        if(tipo.value === 'ingreso'){
            ingresos.push(new Ingreso(descripcion.value, parseFloat(valor.value)));
            cargarCabecero();
            cargarIngresos();
        }else if(tipo.value === 'egreso'){
            egresos.push(new Egreso(descripcion.value, parseFloat(valor.value)));
            cargarCabecero();
            cargarEgresos();
        }
        formulario['descripcion'].value = '';
        formulario['valor'].value = '';
    }else{
        alert('Todos los campos son obligatorios');
    }
}

document.getElementById('agregar_btn').addEventListener('click', agregarDato);

let calcularIngresos = () => {
    let total = 0;
    for(let ingreso of ingresos){
        total += ingreso.valor;
    }
    return total;
}

let calcularEgresos = () => {
    let total = 0;
    for(let egreso of egresos){
        total += egreso.valor;
    }
    return total;
}

let cargarCabecero = () => {
    let presupuesto = calcularIngresos() - calcularEgresos();
    let porcentaje = calcularEgresos() / calcularIngresos();
    document.getElementById('presupuesto').innerHTML = formatoMoneda(presupuesto);
    document.getElementById('porcentaje').innerHTML = formatoPorcentaje(porcentaje);
    document.getElementById('ingresos').innerHTML = formatoMoneda(calcularIngresos());
    document.getElementById('egresos').innerHTML = formatoMoneda(calcularEgresos());
}

const formatoMoneda = valor => {
    return valor.toLocaleString('en-US', {style:'currency', currency: 'USD', minimumFractionDigits: 0});
}

const formatoPorcentaje = valor => {
    return valor.toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 0});
}

const cargarIngresos = () => {
    let ingresosHTML = '';
    for(let ingreso of ingresos){
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista_ingresos').innerHTML = ingresosHTML;
}

const crearIngresoHTML = (ingreso) => {
    let ingresoHTML = `
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${ingreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">+ ${formatoMoneda(ingreso.valor)}</div>
            <div class="elemento_eliminar">
                <button class="elemento_eliminar--btn">
                    <ion-icon name="close-circle-outline" onclick="eliminarIngreso(${ingreso.idIngreso})"></ion-icon>
                </button>
            </div>
        </div>
    </div>`
    return ingresoHTML;
}

const eliminarIngreso = (id) => {
    let indice = ingresos.findIndex(ingreso => ingreso.idIngreso === id);
    ingresos.splice(indice, 1);
    cargarCabecero();
    cargarIngresos();
}

const cargarEgresos = () => {
    let egresosHTML = '';
    for(let egreso of egresos){
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista_egresos').innerHTML = egresosHTML;
}

const crearEgresoHTML = (egreso) => {
    let egresoHTML = `
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${egreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">- ${formatoMoneda(egreso.valor)}</div>
            <div class="elemento_porcentaje">${formatoPorcentaje(egreso.valor / calcularEgresos())}</div>
            <div class="elemento_eliminar">
                <button class="elemento_eliminar--btn">
                    <ion-icon name="close-circle-outline" onclick="eliminarEgreso(${egreso.idEgreso})"></ion-icon>
                </button>
            </div>
        </div>
    </div>`
    return egresoHTML;
}

const eliminarEgreso = (id) => {
    let indice = egresos.findIndex(egreso => egreso.idEgreso === id);
    egresos.splice(indice, 1);
    cargarCabecero();
    cargarEgresos();
}