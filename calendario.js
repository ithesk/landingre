/**
 * Iglesia Revoluciona - Funcionalidad para agregar eventos al calendario
 * Este archivo contiene la función para generar archivos .ics de calendario
 */

// Coordenadas de la iglesia
const COORDENADAS_IGLESIA = "18.4487452,-69.9641933";
const URL_MAPA = "https://maps.app.goo.gl/ATCZMUVEmZ8NeivaA";
const NOMBRE_IGLESIA = "Iglesia Revoluciona";

/**
 * Genera y descarga un archivo .ics para agregar un evento al calendario
 * @param {number} horaInicio - Hora de inicio del servicio (formato 24h)
 * @param {number} minInicio - Minutos de inicio del servicio
 * @param {number} horaFin - Hora de fin del servicio (formato 24h)
 * @param {number} minFin - Minutos de fin del servicio
 * @param {string} [tipoServicio] - Opcional: texto personalizado para el servicio
 */
function agregarAlCalendario(horaInicio, minInicio, horaFin, minFin, tipoServicio) {
    // Obtener el próximo domingo
    const hoy = new Date();
    const dia = hoy.getDay(); // 0 = domingo
    const diff = (7 - dia) % 7;
    const domingo = new Date(hoy);
    domingo.setDate(hoy.getDate() + diff);
    
    // Función para formatear fecha según formato iCalendar
    function formatear(dt) {
        return dt.toISOString().replace(/[-:]/g, "").split('.')[0] + "Z";
    }
    
    // Crear evento según los parámetros
    const eventoInicio = new Date(domingo);
    eventoInicio.setHours(horaInicio, minInicio, 0);
    const eventoFin = new Date(domingo);
    eventoFin.setHours(horaFin, minFin, 0);
    
    // Determinar nombre del evento
    let nombreEvento;
    if (tipoServicio) {
        nombreEvento = tipoServicio + " - " + NOMBRE_IGLESIA;
    } else {
        nombreEvento = (horaInicio === 10) ? "Primer Servicio - " + NOMBRE_IGLESIA : "Segundo Servicio - " + NOMBRE_IGLESIA;
    }
    
    // Crear contenido del archivo iCalendar
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Iglesia Revoluciona//RE//ES
BEGIN:VEVENT
SUMMARY:${nombreEvento}
LOCATION:${COORDENADAS_IGLESIA}
DTSTART:${formatear(eventoInicio)}
DTEND:${formatear(eventoFin)}
DESCRIPTION:Servicio dominical en ${NOMBRE_IGLESIA}\\n${URL_MAPA}
RRULE:FREQ=WEEKLY;BYDAY=SU
END:VEVENT
END:VCALENDAR`.trim();

    // Crear y descargar el archivo
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreEvento.replace(/ /g, "-") + ".ics";
    link.click();
}