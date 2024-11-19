import { executeQuery } from '../helpers/dbHelper';
import sql from '../DataBase/contection/Conexion';

const PagoController = {
    // Obtener todos los pagos con detalles
    async getAllPagos(req, res) {
        try {
            const result = await executeQuery('EXEC ConsultarPagos');
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error(`Error al obtener los pagos: ${error}`);
            res.status(500).json({ msg: 'Error al obtener los pagos' });
        }
    },
    async getPagosByNumDocumento(req, res) {
        const { NumDocumento } = req.body; // Asegúrate de usar exactamente "NumDocumento" en el cuerpo

        if (!NumDocumento) {
            return res.status(400).json({ msg: 'Debe proporcionar un número de documento en el cuerpo de la solicitud.' });
        }

        try {
            const result = await executeQuery('EXEC ObtenerPagosPorNumDocumento @NumDocumento = @NumDocumento', [
                { name: 'NumDocumento', type: sql.NVarChar(50), value: NumDocumento }
            ]);

            if (!result.recordset || result.recordset.length === 0) {
                return res.status(404).json({ msg: 'No se encontraron pagos para el número de documento proporcionado.' });
            }

            res.status(200).json(result.recordset);
        } catch (error) {
            console.error(`Error al obtener los pagos por número de documento: ${error}`);
            res.status(500).json({ msg: 'Error al obtener los pagos', error: error.message });
        }
    },

    async createPago(req, res) {
        const { IdAlumno, TotalPagar, Descripcion, DetallesPago, CantidadMensualidad } = req.body;
        const IdAdministrador = req.user?.id; // Usuario autenticado

        if (!IdAlumno || !TotalPagar || !Descripcion) {
            return res.status(400).json({ msg: 'Faltan datos requeridos: IdAlumno, TotalPagar o Descripcion.' });
        }

        if (!DetallesPago && !CantidadMensualidad) {
            return res.status(400).json({
                msg: 'Debe proporcionar al menos un detalle del pago o la cantidad mensualidad para distribuir.',
            });
        }

        try {
            let detallesTable = new sql.Table('PagoDetalleType');
            detallesTable.columns.add('IdTipoPago', sql.Int, { nullable: false });
            detallesTable.columns.add('IdMes', sql.Int, { nullable: true });
            detallesTable.columns.add('Anio', sql.Int, { nullable: true });
            detallesTable.columns.add('CantidadBase', sql.Decimal(10, 2), { nullable: false });
            detallesTable.columns.add('PorcentajeDescuento', sql.Decimal(5, 2), { nullable: true });
            detallesTable.columns.add('MultaRetrazo', sql.Decimal(10, 2), { nullable: true });
            detallesTable.columns.add('Descripcion', sql.NVarChar(200), { nullable: false });

            if (CantidadMensualidad && CantidadMensualidad > 0) {
                let totalDistribuir = TotalPagar;
                let mesActual = new Date().getMonth() + 1;
                let anioActual = new Date().getFullYear();

                while (totalDistribuir > 0) {
                    const montoMes = Math.min(totalDistribuir, CantidadMensualidad);
                    detallesTable.rows.add(
                        2, // Suponiendo que 2 es el ID para "Mensualidad"
                        mesActual,
                        anioActual,
                        montoMes,
                        0, // Sin descuento
                        0, // Sin multa
                        `Pago de mensualidad ${mesActual}/${anioActual}`
                    );

                    totalDistribuir -= montoMes;
                    mesActual++;
                    if (mesActual > 12) {
                        mesActual = 1;
                        anioActual++;
                    }
                }
            } else {
                DetallesPago.forEach(detalle => {
                    detallesTable.rows.add(
                        detalle.IdTipoPago,
                        detalle.IdMes,
                        detalle.Anio,
                        detalle.CantidadBase,
                        detalle.PorcentajeDescuento || 0,
                        detalle.MultaRetrazo || 0,
                        detalle.Descripcion
                    );
                });
            }

            const request = new sql.Request();
            request.input('IdAlumno', sql.Int, IdAlumno);
            request.input('FechaPago', sql.DateTime, new Date());
            request.input('TotalPagar', sql.Decimal(10, 2), TotalPagar);
            request.input('IdAdministrador', sql.Int, IdAdministrador);
            request.input('Descripcion', sql.NVarChar(200), Descripcion);
            request.input('DetallesPago', detallesTable);

            const result = await request.execute('CrearPago');

            if (!result.recordset || result.recordset.length === 0) {
                throw new Error('El procedimiento almacenado no devolvió un ID de pago.');
            }

            res.status(201).json({ msg: 'Pago creado exitosamente', pagoId: result.recordset[0].Id });
        } catch (error) {
            console.error(`Error al crear el pago: ${error}`);
            res.status(500).json({ msg: 'Error al crear el pago', error: error.message });
        }
    }

};

export default PagoController;




// ejemplo de create
/**
 * {
    "IdAlumno": 2,
    "TotalPagar": 150.00,
    "Descripcion": "Pago de matrícula y enero",
    "DetallesPago": [
        {
            "IdTipoPago": 1,
            "IdMes": null,
            "Anio": null,
            "CantidadBase": 100.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de matrícula"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 1,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de enero"
        }
    ]
}

para crear uno con mucos meses 
{
    "IdAlumno": 2,
    "TotalPagar": 550.00,
    "Descripcion": "Pago de colegiaturas de febrero a diciembre",
    "DetallesPago": [
        {
            "IdTipoPago": 2,
            "IdMes": 2,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de febrero"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 3,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de marzo"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 4,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de abril"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 5,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de mayo"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 6,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de junio"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 7,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de julio"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 8,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de agosto"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 9,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de septiembre"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 10,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de octubre"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 11,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de noviembre"
        },
        {
            "IdTipoPago": 2,
            "IdMes": 12,
            "Anio": 2024,
            "CantidadBase": 50.00,
            "PorcentajeDescuento": 0,
            "MultaRetrazo": 0,
            "Descripcion": "Pago de diciembre"
        }
    ]
}



para obtneer por numero de documenot
{
  "NumDocumento": "12121212"
}

 */