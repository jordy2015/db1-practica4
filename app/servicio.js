var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var ip = process.env.ip;

		//Conexion con postgresql   
var pg = require('pg');
var conString = "postgres://postgres:123456789@localhost:5432/db1Practica4";
var client = new pg.Client(conString);
client.connect();

		//inicio del servidor
server.listen(port,ip, function () {    
});
  
		//Agrego carperas del html
app.use(express.static(__dirname + '/html'));
  
 		//Funciones del socket (Me permite interactuar con las paginas html)
io.on('connection', function(socket){
	
		//Consulta intinerario "pagina index"
		var query = client.query("SELECT DISTINCT A.\"INTINERARIO\", A.\"BUS\",A.\"ORIGEN\", A.\"DESTINO\",A.\"FECHA\", A.\"H_SALIDA\", A.\"H_LLEGADA\",B.\"VIAJE\", A.\"DIRECCION\" \"INICIO\", B.\"DIRECCION\" \"FIN\" FROM (SELECT B.\"INTINERARIO\", B.\"BUS\",C.\"ORIGEN\", C.\"DESTINO\",B.\"FECHA\", B.\"H_SALIDA\", B.\"H_LLEGADA\",  D.\"DIRECCION\", A.\"P_LLEGADA\" FROM \"VIAJE\" A, \"INTINERARIO\" B,\"RUTA\" C, \"PUNTO\" D WHERE B.\"RUTA\"=C.\"RUTA\" AND C.\"RUTA\"=A.\"RUTA\" AND D.\"PUNTO\"=A.\"P_INICIO\") A, (SELECT A.\"VIAJE\", D.\"PUNTO\", D.\"DIRECCION\" FROM \"VIAJE\" A, \"INTINERARIO\" B,\"RUTA\" C, \"PUNTO\" D WHERE B.\"RUTA\"=C.\"RUTA\" AND C.\"RUTA\"=A.\"RUTA\" AND D.\"PUNTO\"=A.\"P_LLEGADA\") B WHERE B.\"PUNTO\" =A.\"P_LLEGADA\"");
		query.on('row', function(row) {
		   socket.emit('visits',row);
		});

		//Guarda el tiket "pagina index"		  
	   socket.on('guardar1', function(x,x1,x2){
			var arr = x2.split(",");
			client.query("INSERT INTO \"TIKET\"(\"F_VENCIMIENTO\", \"F_GENERADO\", \"INTINERARIO\", \"DPI\") VALUES ('26/04/2015', '25/04/2015', $1, $2);", [parseInt(x1),parseInt(x)]);
			var querys = client.query("select \"TIKET\" FROM \"TIKET\" ORDER BY \"TIKET\" DESC limit 1");
			querys.on('row', function(row) {
			   socket.emit('tiket',row.TIKET);
			   for (var index in arr) {
			  		client.query("INSERT INTO \"RECORRIDO\"(\"TIKET\", \"VIAJE\") VALUES ($1, $2);", [row.TIKET,parseInt(arr[index])]);
				}
			});   
      });
      
      //busqueda el para la pagina pago "consulta"
	   socket.on('buscar1', function(x){
			var query3 = client.query(" SELECT SUM(C.\"PRECIO\")  \"PRECIO\", SUM(C.\"KILOMETROS\") \"KILO\" FROM \"TIKET\" A, \"RECORRIDO\" B, \"VIAJE\" C WHERE A.\"TIKET\"=B.\"TIKET\" AND B.\"VIAJE\"=C.\"VIAJE\" AND A.\"TIKET\"="+parseInt(x));
			query3.on('row', function(row) {
			   socket.emit('respuesta1',row);
			});
      });
      //busqueda el para la pagina pago "Guarda el pago"
	   socket.on('pago', function(x,x1){
			client.query("INSERT INTO \"FACTURA\"(\"FECHA\",\"TIKET\", \"TOTAL\") VALUES ('25/04/2015',$1, $2);", [parseInt(x),x1]);
			var querys = client.query("select \"FACTURA\" FROM \"FACTURA\" ORDER BY \"FACTURA\" DESC limit 1");
			querys.on('row', function(row) {
			   socket.emit('factura',row.FACTURA);      
	      });
      });
           
      //Consulta para la pagina factura
     socket.on('buscar2', function(x){
     	console.log(x);	
			var query4 = client.query("SELECT B.\"TIKET\",A.\"NOMBRE\", D.\"BUS\", E.\"ORIGEN\", E.\"DESTINO\" FROM \"CLIENTE\" A, \"TIKET\" B, \"FACTURA\" C, \"INTINERARIO\" D, \"RUTA\" E WHERE A.\"DPI\"=B.\"DPI\" AND B.\"INTINERARIO\"=D.\"INTINERARIO\" AND D.\"RUTA\"=E.\"RUTA\" AND B.\"TIKET\"=C.\"TIKET\" AND C.\"FACTURA\"="+parseInt(x));
			query4.on('row', function(row) {
				console.log(row.NOMBRE);
			   socket.emit('respuesta2',row);		   
			var query6 = client.query("SELECT SUM(C.\"PRECIO\")  \"PRECIO\", SUM(C.\"KILOMETROS\") \"KILO\" FROM \"TIKET\" A, \"RECORRIDO\" B, \"VIAJE\" C WHERE A.\"TIKET\"=B.\"TIKET\" AND B.\"VIAJE\"=C.\"VIAJE\" AND A.\"TIKET\"="+row.TIKET);
			query6.on('row', function(row) {
			   socket.emit('respuesta4',row);
			});
			});
			var query5 = client.query("select C.\"PRECIO\" ,C.\"KILOMETROS\", E.\"DIRECCION\" \"INICIO\", F.\"DIRECCION\" \"FINAL\" FROM \"TIKET\" A, \"RECORRIDO\" B, \"VIAJE\" C, \"FACTURA\" D, \"PUNTO\" E, \"PUNTO\" F WHERE A.\"TIKET\"=B.\"TIKET\" AND B.\"VIAJE\"=C.\"VIAJE\" AND C.\"P_INICIO\"=E.\"PUNTO\" AND C.\"P_LLEGADA\"=F.\"PUNTO\" AND A.\"TIKET\"=D.\"TIKET\" AND D.\"FACTURA\"="+parseInt(x));
			query5.on('row', function(row) {
			   socket.emit('respuesta3',row);
			});
      });

		//Eliminar buses "Pagina abc"
	   socket.on('eliminar', function(x){
			client.query("DELETE FROM \"BUS\"  WHERE \"BUS\"=" + [parseInt(x)]);
      });
      //Guardar bus "pagina abc"
	   socket.on('guardar', function(x,x2,x3){
			client.query("INSERT INTO \"BUS\"(\"MATRICULA\", \"MARCA\", \"TIPO\") VALUES ($1, $2, $3);", [x,x2,parseInt(x3)]);
      });
      //Modificar bus "pagina abc"
	   socket.on('mod', function(x,x2,x3,x4){
			client.query("UPDATE \"BUS\" SET  \"MATRICULA\"=$1, \"MARCA\"=$2, \"TIPO\"=$3 WHERE \"BUS\"="+parseInt(x), [x2,x3,x4]);
      });
          
});




