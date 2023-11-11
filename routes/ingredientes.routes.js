import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const fileIngredientes = await readFile('./data/ingredientes.json', 'utf-8')
const ingredientesData = JSON.parse(fileIngredientes)

const router = Router();

router.get('/all', (req, res) => {
    if (ingredientesData.length){
        res.status(200).json(ingredientesData)
    }else{
        res.status(400).json("No se encontraron ingredientes.")
    }
});

router.put('/add', (req, res) => {
    try {
        const { id, nombre } = req.body;

        const ingredienteExistente = ingredientesData.find(ingrediente => ingrediente.id === id);

        if (!ingredienteExistente) {
            ingredientesData.push({ id, nombre });
        } else {
            ingredienteExistente.nombre = nombre;
        }

        writeFile('./data/ingredientes.json', JSON.stringify(ingredientesData, null, 2), (err) => {
            if (err) {
                res.status(500).json('Error al actualizar o crear el ingrediente');
            } else {
                res.status(200).json({ message: 'Ingrediente actualizado o creado correctamente' });
            }
        });
    } catch (error) {
        res.status(500).json('Error al actualizar o crear el ingrediente');
    }
});

export default router;