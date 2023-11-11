import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

let recetasData;

readFile('./data/recetas.json', 'utf-8')
    .then(data => {
        recetasData = JSON.parse(data);
    })
    .catch(err => {
        console.error('Error al leer el archivo de recetas:', err);
    });

const router = Router();

router.get('/', (req, res) => {
    if (recetasData && recetasData.length) {
        res.status(200).json(recetasData);
    } else {
        res.status(500).json("Error al buscar recetas o no se encontraron recetas.");
    }
});

router.post('/search', (req, res) => {
    try {
        const { nombre } = req.body;

        const recetaEncontrada = recetasData.find(receta => receta.nombre === nombre);

        if (!recetaEncontrada) {
            res.status(404).json({ message: 'Receta no encontrada' });
        } else {
            res.status(200).json(recetaEncontrada);
        }
    } catch (error) {
        res.status(500).json('Error al buscar la receta');
    }
});
router.put('/:idReceta/:idIngrediente', (req, res) => {
    try {
        const { idReceta, idIngrediente } = req.params;
        const { cantidad } = req.body;

        console.log('idReceta:', idReceta);
        console.log('idIngrediente:', idIngrediente);

        const receta = recetasData.find(r => r.id === parseInt(idReceta, 10));
        if (!receta) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }

        console.log('Receta encontrada:', receta);

        const ingrediente = receta.ingredientes.find(i => i.id === parseInt(idIngrediente, 10));
        if (!ingrediente) {
            return res.status(404).json({ message: 'Ingrediente no encontrado en la receta' });
        }

        console.log('Ingrediente encontrado:', ingrediente);

        ingrediente.cantidad = cantidad;

        writeFile('./data/recetas.json', JSON.stringify(recetasData, null, 2), (err) => {
            if (err) {
                res.status(500).json('Error al actualizar la receta');
            } else {
                res.status(200).json({ message: 'Cantidad de ingrediente actualizada correctamente' });
            }
        });
    } catch (error) {
        console.error('Error en la ruta PUT:', error);
        res.status(500).json('Error al actualizar la receta');
    }
});router.delete('/:idReceta', (req, res) => {
    try {
        const { idReceta } = req.params;


        const recetaIndex = recetasData.findIndex(r => r.id === parseInt(idReceta, 10));

        if (recetaIndex === -1) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }

        recetasData.splice(recetaIndex, 1);

        console.log('Recetas después de eliminar:', recetasData);

        writeFile('./data/recetas.json', JSON.stringify(recetasData, null, 2), (err) => {
            if (err) {
                res.status(500).json('Error al eliminar la receta');
            } else {
                res.status(200).json({ message: 'Receta eliminada correctamente' });
            }
        });
    } catch (error) {
        res.status(500).json('Error al eliminar la receta');
    }
});

export default router;