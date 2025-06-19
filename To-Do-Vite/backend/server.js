const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/auth');


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes); // ruta publica 
app.use('/boards', authMiddleware); // ruta privada
app.use('/boards/:name/tasks', authMiddleware); // ruta privada



// Obtener todos los tableros
app.get('/boards', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM boards ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tableros:', error);
        res.status(500).json({ error: 'Error al leer los tableros' });
    }
});

// Crear un nuevo tablero
app.post('/boards', authMiddleware, async (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) {
            return res.status(400).json({ error: 'El nombre y la categoría son requeridos' });
        }

        if (!['Personal', 'Universidad'].includes(category)) {
            return res.status(400).json({ error: 'La categoría debe ser Personal o Universidad' });
        }

        const result = await pool.query(
            'INSERT INTO boards (name, category) VALUES ($1, $2) RETURNING *',
            [name, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear tablero:', error);
        res.status(500).json({ error: 'Error al crear el tablero' });
    }
});

// Eliminar un tablero
app.delete('/boards/:name', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        const result = await pool.query(
            'DELETE FROM boards WHERE name = $1 RETURNING *',
            [name]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar tablero:', error);
        res.status(500).json({ error: 'Error al eliminar el tablero' });
    }
});

// Obtener tareas de un tablero
app.get('/boards/:name/tasks', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await pool.query(
            'SELECT t.* FROM tasks t JOIN boards b ON t.board_id = b.id WHERE b.name = $1 ORDER BY t.created_at DESC',
            [name]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ error: 'Error al leer las tareas' });
    }
});

// Agregar una tarea a un tablero
app.post('/boards/:name/tasks', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'El texto es requerido' });
        }

        // Primero obtenemos el ID del tablero
        const boardResult = await pool.query('SELECT id FROM boards WHERE name = $1', [name]);
        if (boardResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        const boardId = boardResult.rows[0].id;
        const taskResult = await pool.query(
            'INSERT INTO tasks (board_id, text) VALUES ($1, $2) RETURNING *',
            [boardId, text]
        );

        res.status(201).json(taskResult.rows[0]);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
});

// Actualizar una tarea
app.patch('/boards/:name/tasks/:taskId', async (req, res) => {
    try {
        const { name, taskId } = req.params;
        const { completed, text } = req.body;
        
        // Primero obtenemos el ID del tablero
        const boardResult = await pool.query('SELECT id FROM boards WHERE name = $1', [name]);
        if (boardResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        const boardId = boardResult.rows[0].id;
        let updateQuery = 'UPDATE tasks SET ';
        const queryParams = [];
        let paramCount = 1;

        if (completed !== undefined) {
            updateQuery += `completed = $${paramCount}, `;
            queryParams.push(completed);
            paramCount++;
        }

        if (text !== undefined) {
            updateQuery += `text = $${paramCount}, `;
            queryParams.push(text);
            paramCount++;
        }

        // Remover la última coma y espacio
        updateQuery = updateQuery.slice(0, -2);
        
        // Agregar la condición WHERE
        updateQuery += ` WHERE id = $${paramCount} AND board_id = $${paramCount + 1} RETURNING *`;
        queryParams.push(parseInt(taskId), boardId);

        const result = await pool.query(updateQuery, queryParams);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
});

// Eliminar una tarea
app.delete('/boards/:name/tasks/:taskId', authMiddleware, async (req, res) => {
    try {
        const { name, taskId } = req.params;
        
        // Primero obtenemos el ID del tablero
        const boardResult = await pool.query('SELECT id FROM boards WHERE name = $1', [name]);
        if (boardResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        const boardId = boardResult.rows[0].id;
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND board_id = $2 RETURNING *',
            [parseInt(taskId), boardId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

// Eliminar todas las tareas completadas de un tablero
app.delete('/boards/:name/tasks/completed', authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        
        // Primero obtenemos el ID del tablero
        const boardResult = await pool.query('SELECT id FROM boards WHERE name = $1', [name]);
        if (boardResult.rows.length === 0) {
            return res.status(404).json({ error: 'Tablero no encontrado' });
        }

        const boardId = boardResult.rows[0].id;
        await pool.query(
            'DELETE FROM tasks WHERE board_id = $1 AND completed = true',
            [boardId]
        );

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar tareas completadas:', error);
        res.status(500).json({ error: 'Error al eliminar tareas completadas' });
    }
});

app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 