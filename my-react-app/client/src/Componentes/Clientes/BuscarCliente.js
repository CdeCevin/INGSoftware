import React, { useState } from 'react';
import Modal from 'react-modal';

function BuscarCliente() {
    const [codigo, setCodigo] = useState('');
    const [clienteData, setClienteData] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("El código es:", codigo);
            const response = await fetch(`http://localhost:3001/api/buscarCliente`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo }) // Enviar el código en el cuerpo
            });
    
            if (response.ok) {
                const data = await response.json();
                setClienteData(data);
                setModalMessage('Cliente encontrado');
                setModalIsOpen(false); // Mantener el modal cerrado si el cliente se encuentra
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message);
                setClienteData(null);
                setModalIsOpen(true); // Abrir el modal si el cliente no se encuentra
            }
        } catch (error) {
            console.error('Error al buscar cliente:', error);
            setModalMessage('Error al buscar cliente.');
            setModalIsOpen(true); // Abrir el modal en caso de error
        }
    };      
    
    

    const closeModal = () => setModalIsOpen(false);

    return (
        <div style={{ marginLeft: '12%' }}>
            <div className="main-block">
                <form onSubmit={handleSubmit}>
                    <h1>Buscar Cliente</h1>
                    <fieldset>
                        <div className="account-details" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <label>Código cliente*</label>
                                <input 
                                    type="text" 
                                    name="input-cod" 
                                    pattern="[0-9]+" 
                                    maxLength="4" 
                                    required 
                                    value={codigo} 
                                    onChange={(e) => setCodigo(e.target.value)} 
                                />
                            </div>
                        </div>
                    </fieldset>
                    <button type="submit">Buscar</button>
                </form>

                {clienteData && (
                    <div className="client-details">
                        <h2>Detalles del Cliente</h2>
                        <p><strong>Nombre:</strong> {clienteData.nombres}</p>
                        <p><strong>Teléfono:</strong> {clienteData.telefono}</p>
                        <p><strong>Dirección:</strong> {clienteData.direccion}</p>
                    </div>
                )}
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Mensaje">
                <h2>Mensaje</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>Cerrar</button>
            </Modal>
        </div>
    );
}

export default BuscarCliente;

/*

<div style="margin-left:10%">

<div class="main-block">
    <form action="pagina_Up_Cliente.php" method="get">
    <h1>Actualizar Cliente</h1>
    <fieldset>
      <legend>
        <h3>Cliente a Editar</h3>
      </legend>
      <div  class="account-details">
        <div><label>COD*</label><input type="text" name="input-rut" maxlength="9"  pattern="[0-9]+" placeholder="Ejemplo: 213233963YYY" required></div>
      </div>
    </fieldset>
    <fieldset>
      <legend>
        <h3>Datos a Editar </h3>
      </legend>
      <div  class="personal-details">
        <div>
          <div><label>Nombre</label><input type="text" name="input-nombre"  maxlength="130" ></div>
          <div><label>Telefono</label><input type="text" name="input-telef"  placeholder="Ejemplo: 912345678"  pattern="[0-9]+" maxlength="11"></div>
          
        </div>
      </div>
      <fieldset>
      <legend>
      <h3>Dirección</h3>
      </legend>
      <div  class="personal-details">
        <div>
          <div>
          <label>Región</label>
          <select name = "select_region" id="select_region">
              <option value="Arica y Parinacota">Arica y Parinacota </option>
              <option value="Tarapaca">Tarapaca</option>
              <option value="Antofagasta">Antofagasta</option>
              <option value="Atacama">Atacama</option>
              <option value="Coquimbo">Coquimbo</option>
              <option value="Valparaíso">Valparaíso</option>
              <option value="Metropolitana">Metropolitana</option>
              <option value="OHiggins">OHiggins</option>
              <option value="Maule">Maule</option>
              <option value="Ñuble">Ñuble</option>
              <option value="Biobío">Biobío</option>
              <option value="La Araucanía">La Araucanía</option>
              <option value="Los Ríos">Los Ríos</option>
              <option value="Los Lagos">Los Lagos</option>
              <option value="Aysén">Aysén</option>
              <option value="Magallanes">Magallanes</option>
            </select>
          </div>

          <div>
          <label>Comuna</label>
          <select name = "select_ciudad" id="select_ciudad">
            <option value="Select">Select</option>
            </select>
          </div>
          <div><label>Calle</label><input type="text" name="input-calle" maxlength="70"></div>
          <div><label>Número</label><input type="text" name="input-numero" placeholder="Ejemplo: 1234"  pattern="[0-9]+" maxlength="5"></div>

        </div>
          </div>
        </div>
      
    </fieldset>
    <button type="submit-cliente" href="/">Actualizar</button>
  </form>
  </div> 
</div>
</body>

<script>
jQuery(document).ready(function($){
var optionSets ={
"Arica y Parinacota": ['Arica', 'Camarones', 'General Lagos', 'Putre'],

"Tarapaca": ['Alto Hospicio', 'Iquique', 'Camiña', 'Colchane', 'Huara', 'Pica', 'Pozo Almonte'],

"Antofagasta": ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Maria Elena', 'Tocopilla'],

"Atacama": ['Chañaral', 'Diego de Almagro', 'Caldera', 'Copiapo', 'Tierra Amarilla', 'Alto del Carmen', 'Freirina', 'Huasco', 'Vallenar'],

"Coquimbo": ['Andacollo', 'Coquimbo', 'La Higuera', 'La Serena', 'Paihuano', 'Vicuña', 'Combarbala', 'Monte Patria', 'Ovalle', 'Punitaqui', 'Rio Hurtado', 'Canela', 'Illapel', 'Los Vilos', 'Salamanca'],

"Valparaíso": ['Rapa nui', 'Calle Larga', 'Los Andes', 'Rinconada', 'San Esteban', 'Cabildo', 'La Ligua', 'Papudo', 'Petorca', 'Zapallar', 'Hijuelas', 'La Calera', 'La Cruz', 'Nogales', 'Quillota', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'San Antonio', 'Santo Domingo', 'Catemu', 'Llay-Llay', 'Panquehue', 'Putaendo', 'San Felipe', 'Santa Maria', 'Casablanca', 'Concon', 'Juan Fernandez', 
'Puchuncavi', 'Quintero', 'Valparaiso', 'Viña del Mar', 'Limache', 'Olmue', 'Quilpue', 'Villa Alemana'],

"Metropolitana": ['Colina', 'Lampa', 'Til Til', 'Pirque', 'Puente Alto', 'San Jose de Maipo', 'Buin', 'Calera de Tango', 'Paine', 'San Bernardo', 'Alhue', 'Curacavi', 'Maria Pinto', 'Melipilla', 'San Pedro', 'Cerrillos', 'Cerro Navia', 'Conchali', 'El Bosque', 'Estacion Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Granja', 'La Florida', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipu', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolen', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Miguel', 'San Joaquin', 'San Ramon', 'Santiago', 'Vitacura', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor', 'Talagante'],

'OHiggins': ['Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machali', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rancagua', 'Rengo', 'Requinoa', 'San Vicente de Tagua Tagua', 'La Estrella', 'Litueche', 'Marchigüe', 'Navidad', 'Paredones', 'Pichilemu', 'Chepica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'San Fernando', 'Santa Cruz'],

"Maule": ['Cauquenes', 'Chanco', 'Pelluhue', 'Curico', 'Hualañe', 'Licanten', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquen', 'Colbun', 'Linares', 'Longavi', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas', 'Constitucion', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Rio Claro', 'San Clemente', 'San Rafael', 'Talca'],

"Ñuble": ['Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Quirihue', 'Ranquil', 'Trehuaco', 'Bulnes', 'Chillan Viejo', 'Chillan', 'El Carmen', 'Pemuco', 'Pinto', 'Quillon', 'San Ignacio', 'Yungay', 'Coihueco', 'Ñiquen', 'San Carlos', 'San Fabian', 'San Nicolas'],  

"Biobío": ['Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Lebu', 'Los alamos', 'Tirua', 'Alto Biobio', 'Antuco', 'Cabrero', 'Laja', 
'Los angeles', 'Mulchen', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Barbara', 'Tucapel', 'Yumbel', 'Chiguayante', 'Concepcion', 'Coronel', 'Florida', 'Hualpen', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tome'],

"La Araucanía": ['Carahue', 'Cholchol', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquen', 'Pucon', 'Puerto Saavedra', 'Temuco', 'Teodoro Schmidt', 'Tolten', 'Vilcun', 'Villarrica', 'Angol', 'Collipulli', 'Curacautin', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Puren', 'Renaico', 'Traiguen', 'Victoria'],

"Los Ríos": ['Mariquina', 'Lanco', 'Mafil', 'Valdivia', 'Corral', 'Paillaco', 'Los Lagos', 'Panguipulli', 'La Union', 'Rio Bueno', 'Lago Ranco', 'Futrono'],

"Los Lagos": ['Ancud', 'Castro', 'Chonchi', 'Curaco de Velez', 'Dalcahue', 'Puqueldon', 'Queilen', 'Quemchi', 'Quellon', 'Quinchao', 
'Calbuco', 'Cochamo', 'Fresia', 'Frutillar', 'Llanquihue', 'Los Muermos', 'Maullin', 'Puerto Montt', 'Puerto Varas', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Rio Negro', 'San Juan de la Costa', 'San Pablo', 'Chaiten', 'Futaleufu', 'Hualaihue', 'Palena'],  

"Aysén": ['Cisnes', 'Guaitecas', 'Aysen', 'Cochrane', 'OHiggins', 'Tortel', 'Coyhaique', 'Lago Verde', 'Chile Chico', 'Rio Ibañez'], 

"Magallanes": ['Antartica', 'Cabo de Hornos', 'Laguna Blanca', 'Punta Arenas', 'Rio Verde', 'San Gregorio', 'Porvenir', 'Primavera', 
'Timaukel', 'Natales', 'Torres del Paine']
}
{ 
     let appendString ='<option value="Select">Select</option>';
    for (let opt  in optionSets){  appendString+= '<option value="'+opt+'">'+opt+'</option>'}
    $('#select_region').html(appendString);
}
$('#select_region').on('change', function (e)  {
    let selectedGroup = this.value;
     let optGroup = optionSets[selectedGroup];
    let appendString ='<option value="Select">Select</option>';
    if (selectedGroup) { optGroup.forEach(val => appendString+= '<option value="'+val+'">'+val+'</option>')}
    $('#select_ciudad').html(appendString);
});
});
</script>
<script>
function myFunction() {
if (confirm("¿Está seguro que desea Cerrar Sesión?")) {
window.location.href = '../Funcionamiento/Cerrar_Sesion.php';
} else {
}
}
</script>*/