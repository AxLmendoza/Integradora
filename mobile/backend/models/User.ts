import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ error: 'Token requerido o mal formado' });
        }

        const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer"

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido o expirado' });
            }
            req.usuario_id = decoded.usuario_id; // Guarda el ID del usuario en la request
            next();
        });
    } catch (error) {
        console.error('Error en verificarToken:', error);
        res.status(500).json({ error: 'Error en la autenticación' });
    }
};
