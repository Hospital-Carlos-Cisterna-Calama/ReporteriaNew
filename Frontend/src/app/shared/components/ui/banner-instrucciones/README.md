# BannerInstruccionesComponent

Componente reutilizable para mostrar un banner de instrucciones con gradiente personalizable y diseño totalmente responsive.

## 📋 Características

- ✅ **Totalmente responsive** con breakpoints sm, md
- 🎨 **4 esquemas de color** predefinidos (teal, blue, purple, green)
- 🔧 **Altamente personalizable** mediante inputs
- ♿ **Accesible** con estructura semántica
- 🎯 **Reutilizable** en cualquier página del sistema

## 🚀 Uso Básico

```typescript
import { BannerInstruccionesComponent } from '@app/shared/components/ui';

@Component({
  imports: [BannerInstruccionesComponent]
})
```

```html
<app-banner-instrucciones
  [titulo]="'Sistema de Reportería PPV'"
  [descripcion]="'Selecciona un reporte del menú lateral para generar informes'"
  [colorGradient]="'blue'"
/>
```

## 🎨 Propiedades (Inputs)

| Propiedad | Tipo | Por Defecto | Descripción |
|-----------|------|-------------|-------------|
| `titulo` | `string` | `'Sistema de Reportería'` | Título principal del banner |
| `descripcion` | `string` | `'Selecciona un reporte del menú...'` | Texto descriptivo |
| `colorGradient` | `'teal' \| 'blue' \| 'purple' \| 'green'` | `'teal'` | Esquema de color del gradiente |

## 🌈 Esquemas de Color

### Teal (Por Defecto)
```html
<app-banner-instrucciones [colorGradient]="'teal'" />
```
- Gradiente: `from-teal-500 to-cyan-600`
- Borde: `border-teal-400/30`
- Texto: `text-teal-50`

### Blue
```html
<app-banner-instrucciones [colorGradient]="'blue'" />
```
- Gradiente: `from-blue-500 to-indigo-600`
- Borde: `border-blue-400/30`
- Texto: `text-blue-50`

### Purple
```html
<app-banner-instrucciones [colorGradient]="'purple'" />
```
- Gradiente: `from-purple-500 to-pink-600`
- Borde: `border-purple-400/30`
- Texto: `text-purple-50`

### Green
```html
<app-banner-instrucciones [colorGradient]="'green'" />
```
- Gradiente: `from-green-500 to-emerald-600`
- Borde: `border-green-400/30`
- Texto: `text-green-50`

## 📱 Diseño Responsive

El componente se adapta automáticamente a diferentes tamaños de pantalla:

- **Móvil (< 640px)**: Layout vertical, padding reducido, iconos más pequeños
- **Tablet (≥ 640px)**: Layout horizontal, espaciado medio
- **Desktop (≥ 768px)**: Espaciado completo, bordes más redondeados

## 💡 Ejemplos de Uso

### Urgencias
```html
<app-banner-instrucciones
  [titulo]="'Sistema de Reportería de Urgencias'"
  [descripcion]="'Selecciona un reporte del menú lateral para generar informes de atenciones de urgencia'"
  [colorGradient]="'teal'"
/>
```

### PPV
```html
<app-banner-instrucciones
  [titulo]="'Sistema de Reportería PPV'"
  [descripcion]="'Selecciona un reporte del menú lateral para generar informes de pabellón y procedimientos'"
  [colorGradient]="'blue'"
/>
```

### Farmacia
```html
<app-banner-instrucciones
  [titulo]="'Sistema de Reportería Farmacia'"
  [descripcion]="'Genera reportes de medicamentos, stock y prescripciones'"
  [colorGradient]="'green'"
/>
```

## 🎯 Casos de Uso

- Páginas de reportería
- Dashboards
- Secciones de ayuda
- Instrucciones de formularios
- Guías de navegación

## ✨ Características Visuales

- **Icono informativo** con efecto backdrop blur
- **Sombra suave** para profundidad visual
- **Gradiente de color** personalizable
- **Bordes redondeados** adaptativos
- **Texto blanco** con opacidad ajustada para máxima legibilidad
