const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let prenda = {
   nombre: '',
   stock: '',
   codigoBarras: '',
   marca: ''
};
let respuesta = {
   error: false,
   codigo: 200,
   mensaje: ''
};

/*
* GET del punto de inicio
* endpoint: /


app.get('/', function (req, res) {
   respuesta = {
      error: true,
      codigo: 200,
      mensaje: 'Punto de inicio'
   };
   res.send(respuesta);
});
*/


/*
* POST que envía prenda y la crea en BD
* endpoint: /prenda
* body
*{
            "nombre": "",
            "stock": ,
            "codigoBarras": ,
            "marca": ""
        }
*/
app.route('/prenda').post(function (req, res) {
   respuesta = {
      error: false,
      codigo: 200,
      mensaje: ''
   };
   var mysql = require('mysql');
   var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'dbappscanner',
      port: 3306
   });
   connection.connect(function (error) {
      if (error) {
         throw error;
      } else {
         console.log('Conexion correcta.');
      }
   });
   var query = connection.query('INSERT INTO producto VALUES (?,?,?,?,?,'?',?,?,?)', req.body.nombre,  function (error, result) {
      if (error) {
         throw error;
      } else {
         var resultado = result;
         if (resultado.length > 0) {
            prenda.nombre = resultado[0].descripcion_producto;
            prenda.stock = resultado[0].stock;
            prenda.codigoBarras = resultado[0].codigoBarra;
            prenda.marca = resultado[0].descripcion;
            respuesta = {
               error: false,
               codigo: 200,
               mensaje: 'Prenda Encontrada',
               respuesta: prenda
            };
         } else {
            res.status(400);
            respuesta = {
               error: true,
               codigo: 400,
               mensaje: 'Prenda no encontrada'
            };
         }
      }
      res.send(respuesta);
   }
   );
   connection.end();
})
   /*
   * GET que recibe todas las prendas existentes en el inventario si no se envia parámetros
   * parámetros = codigoBarras : recibe el producto con el codigo de barras pasado por parametro 
   * endpoint: /prenda
   */
   .get(function (req, res, next) {
      respuesta = {
         error: false,
         codigo: 200,
         mensaje: ''
      };
      var mysql = require('mysql');
      var connection = mysql.createConnection({
         host: 'localhost',
         user: 'root',
         password: 'root',
         database: 'dbappscanner',
         port: 3306
      });
      connection.connect(function (error) {
         if (error) {
            throw error;
         } else {
            console.log('Conexion correcta.');
         }
      });
      if (req.query.codigoBarras == null) {
         var query = connection.query('SELECT * FROM producto JOIN marca ON marca.id_marca = producto.id_producto', function (error, result) {
            if (error) {
               throw error;
            } else {
               var resultado = result;
               if (resultado.length > 0) {
                  let aux = [];
                  for (var i = 0; i < resultado.length; i++) {
                     let prendaaux = {
                        nombre: '',
                        stock: '',
                        codigoBarras: '',
                        marca: ''
                     };
                     prendaaux.nombre = resultado[i].descripcion_producto;
                     prendaaux.stock = resultado[i].stock;
                     prendaaux.codigoBarras = resultado[i].codigoBarra;
                     prendaaux.marca = resultado[i].descripcion;
                     aux[i] = prendaaux
                  }
                  respuesta = {
                     error: false,
                     codigo: 200,
                     mensaje: 'Prendas Encontradas',
                     respuesta: aux
                  };
               } else {
                  res.status(400);
                  respuesta = {
                     error: true,
                     codigo: 400,
                     mensaje: 'Sin Pendas Cargadas en Inventario'
                  };
               }

            }
            res.send(respuesta);
         }
         );
      }
      else {
         var query = connection.query('SELECT * FROM producto JOIN marca ON marca.id_marca = producto.id_producto where codigoBarra = ?', req.query.codigoBarras, function (error, result) {
            if (error) {
               throw error;
            } else {
               var resultado = result;
               if (resultado.length > 0) {
                  let aux = [];
                  for (var i = 0; i < resultado.length; i++) {
                     let prendaaux = {
                        nombre: '',
                        stock: '',
                        codigoBarras: '',
                        marca: ''
                     };
                     prendaaux.nombre = resultado[i].descripcion_producto;
                     prendaaux.stock = resultado[i].stock;
                     prendaaux.codigoBarras = resultado[i].codigoBarra;
                     prendaaux.marca = resultado[i].descripcion;
                     aux[i] = prendaaux
                  }
                  respuesta = {
                     error: false,
                     codigo: 200,
                     mensaje: 'Prendas Encontradas',
                     respuesta: aux
                  };
               } else {
                  res.status(400);
                  respuesta = {
                     error: true,
                     codigo: 400,
                     mensaje: 'Sin Pendas Cargadas en Inventario'
                  };
               }

            }
            res.send(respuesta);
         }
         );
      }
      connection.end();
   })

   ///DES
   .post(function (req, res) {
      if (!req.body.nombre || !req.body.stock || !req.body.codigoBarras) {
         respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Los campos nombre, stock y codigoBarras son requeridos'
         };
      } else {
         if (prenda.nombre !== '' || prenda.stock !== '' || prenda.codigoBarras !== '') {
            respuesta = {
               error: true,
               codigo: 503,
               mensaje: 'La prenda ya fue creada previamente'
            };
         } else {
            prenda = {
               nombre: req.body.nombre,
               stock: req.body.stock,
               codigoBarras: req.body.codigoBarras
            };
            respuesta = {
               error: false,
               codigo: 200,
               mensaje: 'prenda creada',
               respuesta: prenda
            };
         }
      }

      res.send(respuesta);
   })
   .put(function (req, res) {
      if (!req.body.nombre || !req.body.stock || !req.body.codigoBarras) {
         respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Los campos nombre, stock y codigoBarras son requeridos'
         };
      } else {
         if (prenda.nombre === '' || prenda.stock === '' || prenda.codigoBarras === '') {
            respuesta = {
               error: true,
               codigo: 501,
               mensaje: 'La prenda no ha sido creada'
            };
         } else {
            prenda = {
               nombre: req.body.nombre,
               stock: req.body.stock,
               codigoBarras: req.body.codigoBarras
            };
            respuesta = {
               error: false,
               codigo: 200,
               mensaje: 'prenda actualizada',
               respuesta: prenda
            };
         }
      }

      res.send(respuesta);
   })
   .delete(function (req, res) {
      if (prenda.nombre === '' || prenda.stock === '' || prenda.codigoBarras === '') {
         respuesta = {
            error: true,
            codigo: 501,
            mensaje: 'La prenda no ha sido creada'
         };
      } else {
         respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'prenda eliminada'
         };
         prenda = {
            nombre: '',
            stock: '',
            codigoBarras: ''
         };
      }
      res.send(respuesta);
   });
app.use(function (req, res, next) {
   respuesta = {
      error: true,
      codigo: 404,
      mensaje: 'URL no encontrada'
   };
   res.status(404).send(respuesta);
});
app.listen(3000, () => {
   console.log("El servidor está inicializado en el puerto 3000");
});