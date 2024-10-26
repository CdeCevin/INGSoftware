// regiones.js
const optionSets = {
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
    };
  
  export default optionSets;
  