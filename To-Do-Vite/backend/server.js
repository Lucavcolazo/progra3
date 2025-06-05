const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;
const boardsFile = path.join(__dirname, 'boards.json');

// Middleware
app.use(cors());
app.use(express.json());

// Función para leer los tableros
async function readBoards() {
    try {
        const data = await fs.readFile(boardsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe, crear uno con datos iniciales
        const initialData = {
            boards: []
        };
        await fs.writeFile(boardsFile, JSON.stringify(initialData, null, 2));
        return initialData;
    }
}

// Función para escribir los tableros
async function writeBoards(data) {
    await fs.writeFile(boardsFile, JSON.stringify(data, null, 2));
}

// Obtener todos los tableros
app.get('/boards', async (req, res) => {
    try {
        const data = await readBoards();
        res.json(data.boards);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los tableros' });
    }
});

// Crear un nuevo tablero
app.post('/boards', async (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) {
            return res.status(400).json({ error: 'El nombre y la categoría son requeridos' });
        }

        if (!['Personal', 'Universidad'].includes(category)) {
            return res.status(400).json({ error: 'La categoría debe ser Personal o Universidad' });
        }

        const data = await readBoards();
        const newBoard = {
            name,
            category,
            tasks: []
        };

        data.boards.push(newBoard);
        await writeBoards(data);
        res.status(201).json(newBoard);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el tablero' });
    }
});

// Eliminar un tablero
app.delete('/boards/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const data = await readBoards();
        // Buscar el índice ignorando espacios y mayúsculas/minúsculas
        const boardIndex = data.boards.findIndex(board => board.name.trim().toLowerCase() === name.trim().toLowerCase());
        
        if (boardIndex === -1) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        data.boards.splice(boardIndex, 1);
        await writeBoards(data);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el tablero' });
    }
});

// Obtener tareas de un tablero
app.get('/boards/:name/tasks', async (req, res) => {
    try {
        const { name } = req.params;
        const { category } = req.query;
        const data = await readBoards();
        const board = data.boards.find(board => board.name === name && board.category === category);
        
        if (!board) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        res.json(board.tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer las tareas' });
    }
});

// Agregar una tarea a un tablero
app.post('/boards/:name/tasks', async (req, res) => {
    try {
        const { name } = req.params;
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'El texto es requerido' });
        }

        const data = await readBoards();
        const boardIndex = data.boards.findIndex(board => board.name === name);
        
        if (boardIndex === -1) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        const newTask = {
            id: Date.now(),
            text,
            completed: false
        };

        data.boards[boardIndex].tasks.push(newTask);
        await writeBoards(data);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
});

// Actualizar una tarea
app.patch('/boards/:name/tasks/:taskId', async (req, res) => {
    try {
        const { name, taskId } = req.params;
        const { completed, text } = req.body;
        
        const data = await readBoards();
        const boardIndex = data.boards.findIndex(board => board.name === name);
        
        if (boardIndex === -1) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        const taskIndex = data.boards[boardIndex].tasks.findIndex(task => task.id === parseInt(taskId));
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        const updatedTask = {
            ...data.boards[boardIndex].tasks[taskIndex],
            ...(completed !== undefined && { completed }),
            ...(text !== undefined && { text })
        };

        data.boards[boardIndex].tasks[taskIndex] = updatedTask;
        await writeBoards(data);
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
});

// Eliminar una tarea
app.delete('/boards/:name/tasks/:taskId', async (req, res) => {
    try {
        const { name, taskId } = req.params;
        const data = await readBoards();
        const boardIndex = data.boards.findIndex(board => board.name === name);
        
        if (boardIndex === -1) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        data.boards[boardIndex].tasks = data.boards[boardIndex].tasks.filter(
            task => task.id !== parseInt(taskId)
        );

        await writeBoards(data);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

// Eliminar todas las tareas completadas de un tablero
app.delete('/boards/:name/tasks/completed', async (req, res) => {
    try {
        const { name } = req.params;
        const data = await readBoards();
        const boardIndex = data.boards.findIndex(board => board.name.trim().toLowerCase() === name.trim().toLowerCase());
        if (boardIndex === -1) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }
        data.boards[boardIndex].tasks = data.boards[boardIndex].tasks.filter(task => !task.completed);
        await writeBoards(data);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar tareas completadas' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 