

const validarArchivoSubir = (req , res, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg: 'No hay archivos que subir - validar archivo subido'});
        return;
    }

    next();

}


module.exports = {
    validarArchivoSubir
}