# Backend E-COMERCE:
 _Consiste En un backend de ecomerce , donde se podra gozar del uso de ROLES: administrador , vendedor y usuario; Crear productos, categorizar los productoS , comprar y vender productos(En el caso del vendedor), dejar comentarios a los productos(Usuarios)   _

## Comenzando :
_Descarga este repositorio._  
  

 

### Pre-requisitos para Pruebas :
_Nodejs instalado , si no prueba descargar en https://nodejs.org/es/._
_Postman instalado, descargas en https://www.postman.com/_
_Mongodb instalado ,descargas en https://www.mongodb.com/es_

  _IMPORTANTE CREA UN ACRHIVO .env dentro de la carpeta ecomerce , copia esto --> MONGODB_URI = mongodb://localhost:27017/proyectoecomerce 
  secret= algosecreto_  

  
  _IMPORTANTE CREA UN ACRHIVO password.js dentro de la carpeta config modifica el email y la password PARA QUE FUNCIONE, copia esto --> const config = {
    SECRET: "untextolargosecretoyconcaracteresraros¡+$?_&",
    GMAIL: {
        email: 'correo@gmail.com',
        password: 'clavecorreo'
    }
   
};
module.exports = config;_    


#### Ejemplo:
```
- DESCARGA ARCHIVOS: Download ZIP o git clone del repositorio  
- Luego Abre la carpeta , si descargaste recuerda descomprimir o extraer  
- Ahora abre la carpeta extraida en tu editor de codigo(Visual Studio Code) , en el terminal entra a la carpeta ecomerce con : $ cd ecomerce  
- Genial , ya estas en la carpeta ; Debes escribir en la terminal $ npm install(así se instalara node modules y las dependencias del proyecto)  
- Por ultimo asegurate de tener escuchando tu base de datos (mongodb) "Si esta apagada" usa en la terminal 
$ mongod   
- en tu terminal corre el comando $ npm run dev
-LISTO , tienes el repo lo puedes empezar a probar   
```





#### Construido
 - Durante la formación online en GeeksHubs Academy por Alexandra Jiménez.  
 - USANDO Visual Studio Code  


##### Licencia 
 - mira el archivo LICENSE.md para detalles

