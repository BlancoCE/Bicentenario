const QRCode = require('qrcode');

const generarQR = async (req, res) => {
   try{
    const eventId = req.params.id;
    console.log(eventId);
    const eventUrl = `${process.env.FRONTEND_URL}/eventos/${eventId}/register`;

    //Generar QR como SVG
    const qrSvg = await QRCode.toString(eventUrl, {type: 'svg'});

    res.type('svg');
    res.send(qrSvg);
   }catch(error){
        res.status(500).json({error: 'Error generando el codigo QR'});
   }
};

module.exports = { generarQR };