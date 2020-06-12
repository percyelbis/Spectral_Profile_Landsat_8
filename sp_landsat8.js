// Load Landsat 8

var bands = ['B2','B3','B4','B5','B6','B7'];
var OLI = ee.Image('LANDSAT/LC08/C01/T1_SR/LC08_003070_20190605')
          .divide(10000)
          .select(bands);

//Show

Map.centerObject(OLI,8);
Map.addLayer(OLI,{bands:['B6','B5','B4'],min:0,max:.5},'RGB',1);

//>>>>Crear Grafico>>>>//
// Logo
var logo = ee.Image("users/torchi_12/cnic_sicuani");
var cnic = ui.Thumbnail({
  image:logo,
  params:{bands:['b1','b2','b3'],min:0,max:255},
  style:{width:'120px',height:'70px'}});
// Create and style widgets.
var intro = ui.Panel([
  ui.Label({
    value: 'Inspector de Firma Espectral',
    style: {fontSize: '20px', fontWeight: 'bold'}
  }),
  ui.Label('Click un punto sobre el mapa.!!!')
  
]);
var dev = ui.Panel([
  ui.Label({
    value: 'Desarrollado por:',
    style: {fontSize: '12px', fontWeight: 'bold'}
  }),
  ui.Label('Percy Elbis Colque')
  
]);

var lon = ui.Label();
var lat = ui.Label();

// Add the widgets to a new panel.
var panel = ui.Panel();
panel.add(intro);
panel.add(lon);
panel.add(lat);


// Add the new panel to the root panel.
ui.root.insert(0, panel);

Map.onClick(function(coordenadas){
  lon.setValue('longitud: ' + coordenadas.lon.toFixed(2));
  lat.setValue('latitud: ' + coordenadas.lat.toFixed(2));
  
  var point = ee.Geometry.Point(coordenadas.lon,coordenadas.lat);
  var dot = ui.Map.Layer(point,{color: 'FF0000'});
  Map.layers().set(1,dot);
  
  var options = {
    title:'Firma Espectral',
    hAxis:{title: 'Longitud de Onda (micrometros)'},
    vAxis:{title: 'Reflectancia'},
    lineWidth: 1,
    pointSize: 4,
    
  };
  // Longitudes de Onda Promedio
  var longitudes = [0.48, 0.56, 0.65, 0.86, 1.61, 2.2];
  
  var firma = ui.Chart.image.regions(
    OLI,point,ee.Reducer.mean(),30,'label',longitudes)
    .setChartType('ScatterChart')
    .setOptions(options);
    
    firma.style().set({
      
      position: 'bottom-left',
      width: '500px',
      height: '200px'
      
    });
  panel.widgets().set(3, firma);
  panel.add(cnic);
  panel.add(dev);
});

Map.style().set('cursor', 'crosshair');
// Create the application title bar.
Map.add(ui.Label(
    'Inspector de Firma Espectral', {fontWeight: 'bold', fontSize: '24px'}));
