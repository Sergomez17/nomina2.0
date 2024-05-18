const readlineSync = require('readline-sync');

class Empleado {
    constructor(id, sueldo, genero, estrato, extranjero, hijosPrimaria, hijosSecundaria, hijosUniversidad, zonaRural) {
        this.id = id;
        this.sueldo = sueldo;
        this.genero = genero.toLowerCase();
        this.estrato = estrato;
        this.extranjero = extranjero.toLowerCase() === 'si';
        this.hijosPrimaria = hijosPrimaria;
        this.hijosSecundaria = hijosSecundaria;
        this.hijosUniversidad = hijosUniversidad;
        this.zonaRural = zonaRural.toLowerCase() === 'si';
        this.sueldoTotal = 0;
        this.subsidioHijos = 0;
        this.beneficioPorEstrato = 0;
        this.beneficioSectorRural = 0;
        this.subsidioVuelo = 0;
    }

    calcularBeneficios(subsidioPrimaria, subsidioSecundaria, subsidioUniversidad, valorVuelos) {
        if (this.estrato === 1) {
            this.beneficioPorEstrato = this.sueldo * 0.15;
        } else if (this.estrato === 2) {
            this.beneficioPorEstrato = this.sueldo * 0.10;
        } else if (this.estrato === 3) {
            this.beneficioPorEstrato = this.sueldo * 0.05;
        }

        if (this.extranjero) {
            this.subsidioVuelo = valorVuelos * 2;
        }

        this.subsidioHijos = (subsidioPrimaria * this.hijosPrimaria) + (subsidioSecundaria * this.hijosSecundaria) + (subsidioUniversidad * this.hijosUniversidad);

        if (this.zonaRural) {
            this.beneficioSectorRural = 35000;
        }

        this.sueldoTotal = this.sueldo + this.beneficioPorEstrato + this.beneficioSectorRural + this.subsidioHijos + this.subsidioVuelo;
    }
}

class NodoEmpleado {
    constructor(empleado) {
        this.valor = empleado;
        this.siguiente = null;
    }
}

class ListaEmpleados {
    constructor() {
        this.cabeza = null;
    }

    agregarEmpleado(empleado) {
        const nuevoNodo = new NodoEmpleado(empleado);
        if (this.cabeza == null) {
            this.cabeza = nuevoNodo;
        } else {
            let actual = this.cabeza;
            while (actual.siguiente != null) {
                actual = actual.siguiente;
            }
            actual.siguiente = nuevoNodo;
        }
    }

    mostrarTodosLosEmpleados() {
        if (this.cabeza == null) {
            console.log('No hay empleados para mostrar.');
        } else {
            let actual = this.cabeza;
            while (actual != null) {
                console.log(actual.valor);
                actual = actual.siguiente;
            }
        }
    }

    calcularNominaTotal() {
        let nominaTotal = 0;
        let actual = this.cabeza;
        while (actual != null) {
            nominaTotal += actual.valor.sueldoTotal;
            actual = actual.siguiente;
        }
        return nominaTotal;
    }

    calcularNominaPorGenero() {
        let nominaMujeres = 0;
        let nominaHombres = 0;
        let actual = this.cabeza;
        while (actual != null) {
            if (actual.valor.genero === 'f') {
                nominaMujeres += actual.valor.sueldoTotal;
            } else {
                nominaHombres += actual.valor.sueldoTotal;
            }
            actual = actual.siguiente;
        }
        return { nominaMujeres, nominaHombres };
    }

    empleadoConSueldoMasAlto() {
        if (this.cabeza == null) return null;
        let actual = this.cabeza;
        let empleadoMasCaro = actual.valor;
        while (actual != null) {
            if (actual.valor.sueldoTotal > empleadoMasCaro.sueldoTotal) {
                empleadoMasCaro = actual.valor;
            }
            actual = actual.siguiente;
        }
        return empleadoMasCaro;
    }

    calcularGastosSubsidios(subsidioSecundaria) {
        let gastoHijosSecundaria = 0;
        let gastoViajesEmpleadosExtranjeros = 0;
        let actual = this.cabeza;
        while (actual != null) {
            gastoHijosSecundaria += actual.valor.hijosSecundaria * subsidioSecundaria;
            gastoViajesEmpleadosExtranjeros += actual.valor.subsidioVuelo;
            actual = actual.siguiente;
        }
        return { gastoHijosSecundaria, gastoViajesEmpleadosExtranjeros };
    }
}

let listaEmpleados = new ListaEmpleados();
let nominaTotal = 0;
let sueldoEmpleadoMasAlto = 0;
let empleadoMasCaro = null;

const numeroEmpleados = +readlineSync.question('\nIngrese el número de empleados que tiene la empresa: ');
if (isNaN(numeroEmpleados)) {
    console.error('El valor a ingresar debe ser un valor numerico. Inténtelo nuevamente.');
    process.exit(1);
} else if (numeroEmpleados <= 0) {
    console.error('El valor a ingresar debe ser un número positivo. Inténtelo nuevamente.');
    process.exit(1);
}

const subsidioPrimaria = +readlineSync.question('\nIngrese el valor de subsidio para los hijos en primaria: ');
const subsidioSecundaria = +readlineSync.question('Ingrese el valor de subsidio para los hijos en secundaria: ');
const subsidioUniversidad = +readlineSync.question('Ingrese el valor de subsidio para los hijos en universidad: ');
const valorVuelos = +readlineSync.question('Ingrese el valor estimado de los vuelos para los empleados extranjeros: ');

for (let i = 1; i <= numeroEmpleados; i++) {
    const sueldoEmpleado = +readlineSync.question(`\nIngrese el sueldo del empleado ${i}: `);
    const generoEmpleado = readlineSync.question(`Ingrese el género del empleado ${i} (f/m): `);
    const estratoEmpleado = +readlineSync.question(`Ingrese el estrato social del empleado ${i}: `);
    const empleadoExtranjero = readlineSync.question(`¿El empleado es extranjero? (si/no): `);
    const hijosEmpleado = readlineSync.question(`¿El empleado ${i} tiene hijos? (si/no): `);
    let hijosPrimaria = 0, hijosSecundaria = 0, hijosUniversidad = 0;

    if (hijosEmpleado.toLowerCase() === 'si') {
        hijosPrimaria = +readlineSync.question(`Ingrese cuántos hijos tiene el empleado ${i} en primaria: `);
        hijosSecundaria = +readlineSync.question(`Ingrese cuántos hijos tiene el empleado ${i} en secundaria: `);
        hijosUniversidad = +readlineSync.question(`Ingrese cuántos hijos tiene el empleado ${i} en universidad: `);
    }

    const empleadoZonaRural = readlineSync.question(`¿El empleado vive en zona rural? (si/no): `);

    const empleado = new Empleado(i, sueldoEmpleado, generoEmpleado, estratoEmpleado, empleadoExtranjero, hijosPrimaria, hijosSecundaria, hijosUniversidad, empleadoZonaRural);
    empleado.calcularBeneficios(subsidioPrimaria, subsidioSecundaria, subsidioUniversidad, valorVuelos);

    listaEmpleados.agregarEmpleado(empleado);

    console.log(`\nEl empleado ${i} tiene un bono adicional por extranjería de: ${empleado.subsidioVuelo} por los vuelos de ida y vuelta.`);
    console.log(`El sueldo del empleado ${i} (con todos los subsidios) es de: $${empleado.sueldoTotal}`);
}

nominaTotal = listaEmpleados.calcularNominaTotal();
const { nominaMujeres, nominaHombres } = listaEmpleados.calcularNominaPorGenero();
empleadoMasCaro = listaEmpleados.empleadoConSueldoMasAlto();
const { gastoHijosSecundaria, gastoViajesEmpleadosExtranjeros } = listaEmpleados.calcularGastosSubsidios(subsidioSecundaria);

console.info(`\nLa nómina total de la empresa es de: $${nominaTotal}`);
console.info(`La nómina de los empleados hombres es de: $${nominaHombres}`);
console.info(`La nómina de las empleadas mujeres es de: $${nominaMujeres}`);
console.info(`El empleado con el sueldo más alto es el empleado número ${empleadoMasCaro.id} con un sueldo total de: $${empleadoMasCaro.sueldoTotal}`);
console.info(`El gasto total en subsidios por hijos en secundaria es de: $${gastoHijosSecundaria}`);
console.info(`El gasto total en subsidios de vuelos para empleados extranjeros es de: $${gastoViajesEmpleadosExtranjeros}`);
