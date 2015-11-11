define([],function(){
   var help = {
        ie:{
            titleWindow:'Problema detectado',
            header:'Para obtener una mejor experiencia realize los siguientes pasos',
            steps:[
                {
                    text:'Si en el navegador no aparece la barra de men&uacute; presione la tecla F10 para mostrar la barra, una vez habilitada la barra de men&uacute; de clic en el men&uacute; <strong>Herramientas</strong> y elija la opci&oacute;n <strong>Configuraci&oacute;n de Vista de compatibilidad</strong>, como lo muestra la figura:',
                    img:'step1.png'
                },
                {
                    text:'De la ventana siguiente se deshabilita la opci&oacute;n Mostrar sitios de la intranet en Vista de compatibilidad:',
                    img:'step2.png'
                },
                {
                    text:'Así se mostraría la ventana después de deshabilitar la opci&oacute;n; después se da clic en el bot&oacute;n Cerrar ',
                    img:'step3.png'
                },
                {
                    text:'También es necesario deshabilitar la opci&oacute;n Vista de compatibilidad del men&uacute; Herramientas dando un clic sobre la opci&oacute;n:',
                    img:'step4.png'
                },
                {
                    text:'Este sería el resultado de deshabilitar la opci&oacute;n Vista de compatibilidad. Para finalizar es necesario reiniciar el navegador.',
                    img:'step5.png'
                }
            ]
        }
    } 
   return help;
});