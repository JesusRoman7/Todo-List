document.addEventListener('DOMContentLoaded', ()=>{
    //Este lightMode nos servira ademas de seleccionar la imagen al darle click, tambien nos sirva para usarlo como referencia
    //para cuando querramos cambiar la imagen a moon o sun dependiendo
    const lightMode = document.querySelector('.top__title__img');
    const form = document.querySelector('form');
    const resultado = document.querySelector('.resultado');

    lightMode.addEventListener('click', light);
    form.addEventListener('submit', lista);
    let list = []
    let mode = false;
    
    //NOTA: PRIMERO VA EL MODE, SI NO SE CUATRAPEA, SI PONEMOS PRIMERO EL IMPRIMIRHTML POR EL LIST.LENGTH ENTONCES NUESTRO VALOR SIEMPRE
    //O AL PRECER SIEMPRE SERA FALSE, ES POR ESO QUE PRIMERO SETEAMOS EL MODE

    //El mode nos servira para tener true o false al darle click al modo Light, comenzando en false el valor
    mode = JSON.parse(localStorage.getItem('mode')) || false;
    if(mode){
        light();
    }
    
    list = JSON.parse(localStorage.getItem('lista')) || [];
    if(list.length){ //length en vez de [];
        imprimirHTML(list);
    }

    function lista(e){
        e.preventDefault();
        const result = document.querySelector('.top__input').value;
        console.log(result);
        const obj = {result, id: Date.now(), complete: false}; //agregamos un complete: false para que al darle click
        //se ponga en true y usar ese true en el div.Resultado.innerHTML asi si es TRUE entonces agregame la clase activeCheck
        //y tambien la de marked
        console.log(obj);
        list = [...list, obj];
        console.log(list);
        imprimirHTML(list);
    }

    //Nota: antes, esta funcion NO TENIA NINGUN PARAMETRO, pero debido a la funcionalidad de filtrar los que estan COMPLETE y luego
    //volver a ALL, necesitabamos una copia del array original, ahi usamos el MAP, para crear la constante nuevoArr2
    //en dado caso que no funcione algo de la app, regresar y BORRAR TODO PARAMETRO QUE TENGA EL imprimirHTML();
    function imprimirHTML(listaParameter){
        limpiarHTML();
        console.log('se esta ejecutando');
        listaParameter.forEach(element =>{
            const {result, complete, id} = element;
            const divResultado = document.createElement('div');
            //Si mode es TRUE, entonces tendra el modo light, de otra manera es el modo Dark
            divResultado.classList.add(mode ? "resultado__jsLight" : "resultado__js" ); 
            divResultado.innerHTML= `
            <div class="resultado__js__firstChild">
                <div class="resultado__contenedor ${element && complete ? "activeCheck" : " "} check">
                    <img src="/images/icon-check.svg" alt="">
                </div>
                <p class="${mode ? "resultado__contenedor__textoLight" : "resultado__contenedor__texto"} ptag ${element && complete ? "marked" : " "}">${result}</p>
            </div>
            <button class="resultado__contenedor__cross close">
                <img class="cross" src="/images/icon-cross.svg" alt="">
            </button>
            `

            let close = divResultado.querySelector('.close');
            close.addEventListener('click', () =>{
                // divResultado.remove();  //remueveme todo ese innerHTML creado
                filtrado(id);
                console.log(list);
                sincronizarStorage();
                imprimirHTML(list);
            })

            let check = divResultado.querySelector('.check');
            check.addEventListener('click', () => {
                check.classList.toggle('activeCheck'); //toggle nos sirve para activarlo y desactivarlo
                console.log(divResultado.children[0].children[1]); //este seria el parrafo seleccionado
                divResultado.children[0].children[1].classList.toggle('marked');
                //El codigo de abajo nos servira para cambiar la propiedad de complete de nuestro array en el objeto seleccionado
                //Entonces si se le da click, si estaba en falso, se hace true
                //Esta propiedad despues la podemos usar para el condicional ? :, cuando hacemos el forEach con el innerHTML
                //linea 46 y 49 aprox, donde tendremos una clase si COMPLETE ES TRUE, de otra manera
                //seria otra clase
                if(element.complete === false){
                    element.complete = true;
                    console.log(list);
                    sincronizarStorage();
                    return;
                }
                //De otra manera si era true se cambia a falso
                element.complete = false;
                console.log(list);
                sincronizarStorage();

            })
            resultado.appendChild(divResultado);
        })
        if(list.length){ //si hay algun elemento en la lista ejecutame este codigo, nos sirve para el filtrado, cuando
            //ya no queda ningun elemento mas, asi no se muestra esta parte en el HTML

            const divShortcuts = document.createElement('div');
            divShortcuts.classList.add(mode ? "divShortcutLight" : "divShortcut");
            console.log(mode);
            console.log('clase');
    
            divShortcuts.innerHTML = 
            `
            <div><p class="divShortcut__text">${list.length} Items Left</p></div>
    
            <div class="divShortcut__bottom">
                <p class="divShortcut__text all">All</p> 
                <p class="divShortcut__text active">Active</p> 
                <p class="divShortcut__text complete">Completed</p>
            </div>
    
            <div> <p class="divShortcut__text clear">Clear Completed</p> </div>
            
            `
            let all = divShortcuts.querySelector('.all');
            all.addEventListener('click', () => {
                console.log(list);
                list = list.filter(element => {
                    return element;
                })

                imprimirHTML(list);
            })

            let active = divShortcuts.querySelector('.active');
            active.addEventListener('click', () => {
                let activos = list.map(element => {
                    return element;
                })
                activos = activos.filter(element =>{
                    return element.complete === false;
                })

                imprimirHTML(activos);
            })
            let complete = divShortcuts.querySelector('.complete');
            complete.addEventListener('click', () => {
                let nuevoArr2 = list.map(element => {
                    return element;
                })

                nuevoArr2 = nuevoArr2.filter(element =>{
                    return element.complete === true;
                })

                console.log(nuevoArr2);
                console.log(list);
                
                imprimirHTML(nuevoArr2); //imprimiendo el nuevo array con el filter para no mutar los datos originales
                //por esta perra funcionalidad tuvimos QUE DARLE UN PARAMETRO A LA FUNCION imprimirHTML();
                //ANTES NO TENIA NADA, PERO PARA PODER DARLE CLICK A COMPLETE Y LUEGO A ALL FUE NECESARIO TENER 2 ARREGLOS
                //EL RREGLO ORIGINAL Y OTRO EL ARREGLO MAP PARA PODER COPIAR PROPIEDADES Y NO AFECTAR EL ARRAY ORIGINAL, 
                //QUE VENDRIA SIENDO LIST, LA COPIA MAP ES NUEVOARR2
                console.log(list);
            })
            let clear = divShortcuts.querySelector('.clear');
            clear.addEventListener('click', () =>{
                list = list.filter(element => {

                    //Iterame sobre cada elemento.complete y retorname todos los que sean diferentes de TRUE
                    //Osease si algun elemento tiene TRUE es que ya esta completa esa tarea
                    //Entonce limpiame las que ya estan completadas
                    //Y retorname las que aun no hemos hecho
                    return  element.complete !== true;
                })
                console.log(list);
                imprimirHTML(list);
            })
            resultado.appendChild(divShortcuts);
            sincronizarStorage();
            form.reset();
        }
    }

    function filtrado(id){
        console.log(id);
        list = list.filter(element =>{
            return element.id !== id;
        })
    }

    function light(e){
        // e.preventDefault();
        console.log('diste click');
        const top = document.querySelector('.top');
        const topInput = document.querySelector('.top__input');
        const bottomColor = document.querySelector('.bottom');
        const white = document.querySelector('.bottomLight');
        const resultado = document.querySelectorAll('.resultado__js');
        const resultado2 = document.querySelectorAll('.resultado__jsLight');
        const parrafo = document.querySelectorAll('.resultado__contenedor__texto');
        const parrafo2 = document.querySelectorAll('.resultado__contenedor__textoLight');
        const bottomBar = document.querySelectorAll('.divShortcut');
        const bottomBar2 = document.querySelectorAll('.divShortcutLight');
        if(!white){ //si no existe esta clase ejecutame este codigo
            const lighted = document.createElement('img');
            lighted.src = "images/icon-moon.svg";
            //Seleccionando el .src de la constante que declaramos hasta arriba, ahora cambiamos el src por el nuevo del Moon
            lightMode.src = lighted.src;
            bottomColor.classList.add('bottomLight');
            top.classList.add('topLight');
            topInput.classList.add('top__inputLight');
            resultado.forEach(element => element.classList.add('resultado__jsLight'));
            parrafo.forEach(element => element.classList.add('resultado__contenedor__textoLight'));
            bottomBar.forEach(element => element.classList.add('divShortcutLight'));
            mode = true;
            sincronizarStorageLight();
        }else{

            bottomColor.classList.add('bottom');
            bottomColor.classList.remove('bottomLight');
            lightMode.src = "images/icon-sun.svg";
            top.classList.remove('topLight');
            topInput.classList.remove('top__inputLight');
            //Creamos resultado2 y parrafo2 y bottomBar2 porque al cambiar el modo a Light, tendriamos solo resultado__jsLight y resultado__contenedor__textoLight, 
            //nos borraria
            //el resultado__js y resultado__contenedor__texto , entonces para poder manipularlo creamos esas 2 constantes
            //si no, no se aplicaria ningun cambio, entonces agregamos resultado__js y resultado__contenedor__texto para volver cuando el modo
            //es dark
            resultado2.forEach(element => element.classList.add('resultado__js'));
            resultado2.forEach(element => element.classList.remove('resultado__jsLight'));
            parrafo2.forEach(element => element.classList.add('resultado__contenedor__texto'));
            parrafo2.forEach(element => element.classList.remove('resultado__contenedor__textoLight'));
            bottomBar2.forEach(element => element.classList.add('divShortcut'));
            bottomBar2.forEach(element => element.classList.remove('divShortcutLight'));
            mode = false;
            sincronizarStorageLight();
        }
    }

    function sincronizarStorage(){
        localStorage.setItem('lista', JSON.stringify(list));
    }

    function sincronizarStorageLight(){
        localStorage.setItem('mode', JSON.stringify(mode));
    }

    function limpiarHTML(){
        while(resultado.firstChild){
            resultado.removeChild(resultado.firstChild);
        }
    }

});

