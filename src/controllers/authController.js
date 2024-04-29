const bcrypt = require('bcryptjs');
const pool = require('../config/dbConfig');

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
  const { id_usuario, nombre, contraseña } = req.body;
  try {
    // Verificar si el ID de usuario ya existe
    const userExists = await pool.query(
      'SELECT * FROM usuarios WHERE id_usuario = $1;',
      [id_usuario]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).send('El ID de usuario ya está registrado.');
    }

    const salt = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseña, salt);

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      'INSERT INTO usuarios (id_usuario, nombre, contraseña) VALUES ($1, $2, $3);',
      [id_usuario, nombre, contraseñaHash]
    );
    
    //res.status(201).json({ id_usuario, nombre });
    res.status(201).json({ message: "Usuario creado", nombre: nombre });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar al usuario'+ err.message);
  }
};

// Función para iniciar sesión
exports.login = async (req, res) => {
  const { id_usuario, contraseña } = req.body;
  try {
    const user = await pool.query(
      'SELECT * FROM usuarios WHERE id_usuario = $1;',
      [id_usuario]
    );

    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(contraseña, user.rows[0].contraseña);
      if (validPassword) {
        // Inicio de sesión exitoso, establecer sesión o token aquí
        //res.status(200).json({ message: "Inicio de sesión exitoso" });
        res.status(200).json({ message: "Inicio de sesión exitoso", nombre: user.rows[0].nombre });

      } else {
        res.status(401).send('Contraseña incorrecta');
      }
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');

  }
};
