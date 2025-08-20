import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import { db, createQuotesTable } from './database/knex';
import quoteRoutes from './routes/routes';

const app = express();
dotenv.config();
const puerto = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(quoteRoutes);

// Route to test database connection
app.get('/database', async (req, res) => {
  try {
    await db.raw('SELECT 1+1 as result');
    res.send('Server is running and connected to DB!');
  } catch (error) {
    console.error('DB Connection Error:', error);
    res.status(500).send('Server error: Could not connect to DB.');
  }
});

async function startServer() {
  await createQuotesTable();

  app
    .listen(puerto, () => console.log(`Escuchando peticiones puerto http://localhost:${puerto}/database`))
    .on("error", error => console.log(`Error en servidor ${error}`))
}

startServer();

/* app.get("/api/listAll", (req, res) => {

})

app.post("/api", (req, res) => {
  let respuesta = req.body.texto
  console.dir("POST request recibido con: " + respuesta)
  res.send(respuesta)
})

app.put("/api/:id", (req, res) => {
  res.json({
    estado: "OK",
    id: req.params.id,
    nuevoNombre: req.body.nombre
  })
})

app.delete("/api/:id", (req, res) => {
  res.json({
    estado: "Borrado",
    id: req.params.id,
    mensaje: req.body.mensaje
  })
}) */
