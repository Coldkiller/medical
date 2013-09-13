//Exportar modulos para creacion de formularios
var forms = require('forms'),
    fields = forms.fields,
    validators = forms.validators;
    widgets = forms.widgets;


// Formulario de registro
var reg_form =forms.create({
    Nombre:  fields.string({required: true}),
    Apellidos:  fields.string({required: true}),
    Folio:  fields.string({required: true}),
    Ciudad:  fields.string({required: true}),
    Universidad:  fields.string({required: true}),
    Matricula:  fields.string({required: true}),
    Telefono:  fields.string({required: true}),
    Email: fields.email({required: true, label: 'Correo elctronico'}),
    facebook: fields.url(),
    Estado: fields.string({
        choices: {
        	aguascalientes: 'Aguascaliente',
            baja_california: 'Baja California',
            baja_california_sur: 'Baja California Sur',
            campeche: 'Campeche',
            coahuila_de_zaragoza: 'Coahuila de Zaragoza',
            colima:'Colima',
            distrito_federal:'Distrito Federal',
            durango:'Durango',
            Estado_de_Mexico:'Estado de México',
            Guanajuato:'Guanajuato',
            guerrero:'Guerrero',
            hidalgo:'Hidalgo',
            Jalisco:'Jalisco',
            Michoacan:'Michoacán',
            Morelos:'Morelos',
            Nayarit:'Nayarit',
            Nuevo_Leon:'Nuevo León',
            Oaxaca:'Oaxaca',
            Puebla:'Puebla',
            Querétaro:'Querétaro',
            Quintana_Roo:'Quintana Roo',
            San_luis:'San Luis Potosí',
            Sinaloa:'Sinaloa',
            Sonora:'Sonora',
            Tabasco:'Tabasco',
            Tamaulipas:'Tamaulipas',
            Tlaxcala:'Tlaxcala',
            Veracruz:'Veracruz',
            Yucatan:'Yucatán',
            Zacatecas:'Zacatecas',                               
        },
        widget: widgets.select(),
        validators: [function (form, field, callback) {
            if (field.data === 'two') {
                callback('two?! are you crazy?!');
            } else {
                callback();
            }
        }]
    }),
    Seleccione_Su_Nivel: fields.array({
        choices: {medicos_residentes: 'Medicos y residentes', enfermeros: 'Enfermeros', estudiantes: 'Estudiantes', otros: 'Otro Profesional de la Ssalud'},
        widget: widgets.multipleCheckbox()
    }),
    Sexo: fields.array({
        choices: {femenino: 'Femenino', masculino: 'Masculino'},
        widget: widgets.multipleCheckbox()
    }),
    Seleccione_Servicios: fields.string({
        choices: {congreso: 'Congreso Precio $450', precongreso: 'Precongreso: Tecnicas quirurjicas, Precio $1,000 ', transongreso: 'Transongreso: Monografico de actividades en trauma. $200'},
        widget: widgets.multipleRadio()
    }),


   
});

module.exports = reg_form;