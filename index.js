import express from 'express';
import bodyParser from 'body-parser';
import ingredientesRoutes from './routes/ingredientes.routes.js';
import recetasRoutes from './routes/recetas.routes.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

// Rutas
app.use('/ingredientes', ingredientesRoutes);
app.use('/recetas', recetasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto: ${PORT}`);
});